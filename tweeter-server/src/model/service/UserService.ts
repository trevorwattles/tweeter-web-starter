import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserRequest,
  UserResponse,
  LogoutRequest,
  LogoutResponse,
  AuthToken,
  User,
} from "tweeter-shared";
import bcrypt from "bcryptjs";
import { IDAOFactory } from "../dao/IDAOFactory";
import { IUserDAO } from "../dao/IUserDAO";
import { IAuthTokenDAO } from "../dao/IAuthTokenDAO";
import { IS3DAO } from "../dao/IS3DAO";
import { AuthService } from "./AuthService";

const SALT_ROUNDS = 10;

export class UserService {
  private userDAO: IUserDAO;
  private authTokenDAO: IAuthTokenDAO;
  private s3DAO: IS3DAO;
  private authService: AuthService;

  constructor(factory: IDAOFactory) {
    this.userDAO = factory.getUserDAO();
    this.authTokenDAO = factory.getAuthTokenDAO();
    this.s3DAO = factory.getS3DAO();
    this.authService = new AuthService(this.authTokenDAO);
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    if (!request.alias || !request.password) {
      throw new Error("[Bad Request] missing required parameters");
    }

    const userRow = await this.userDAO.getUser(request.alias);

    if (!userRow) {
      throw new Error("[Unauthorized] invalid alias or password");
    }

    const passwordMatch = await bcrypt.compare(
      request.password,
      userRow.passwordHash
    );

    if (!passwordMatch) {
      throw new Error("[Unauthorized] invalid alias or password");
    }

    const user = new User(
      userRow.firstName,
      userRow.lastName,
      userRow.alias,
      userRow.imageUrl
    );

    const authToken = AuthToken.Generate();
    await this.authTokenDAO.putAuthToken(
      authToken.token,
      userRow.alias,
      authToken.timestamp
    );

    return {
      success: true,
      message: null,
      user,
      authToken,
    };
  }

  public async register(request: RegisterRequest): Promise<RegisterResponse> {
    if (
      !request.firstName ||
      !request.lastName ||
      !request.alias ||
      !request.password
    ) {
      throw new Error("[Bad Request] missing required parameters");
    }

    // Check if user already exists
    const existingUser = await this.userDAO.getUser(request.alias);
    if (existingUser) {
      throw new Error("[Bad Request] alias already taken");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(request.password, SALT_ROUNDS);

    // Upload profile image to S3
    let imageUrl: string;
    if (request.imageStringBase64) {
      imageUrl = await this.s3DAO.putImage(
        request.alias.replace("@", ""),
        request.imageStringBase64
      );
    } else {
      imageUrl =
        "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
    }

    // Store the user in DynamoDB
    await this.userDAO.putUser(
      request.alias,
      request.firstName,
      request.lastName,
      passwordHash,
      imageUrl
    );

    const user = new User(
      request.firstName,
      request.lastName,
      request.alias,
      imageUrl
    );

    const authToken = AuthToken.Generate();
    await this.authTokenDAO.putAuthToken(
      authToken.token,
      request.alias,
      authToken.timestamp
    );

    return {
      success: true,
      message: null,
      user,
      authToken,
    };
  }

  public async getUser(request: UserRequest): Promise<UserResponse> {
    if (!request.alias) {
      throw new Error("[Bad Request] missing required parameters");
    }

    await this.authService.validate(request.authToken);

    const userRow = await this.userDAO.getUser(request.alias);

    const user = userRow
      ? new User(
          userRow.firstName,
          userRow.lastName,
          userRow.alias,
          userRow.imageUrl
        )
      : null;

    return {
      success: true,
      message: null,
      user,
    };
  }

  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    if (!request.authToken) {
      throw new Error("[Bad Request] missing required parameters");
    }

    // Handle authToken as either a string or an AuthToken-like object
    let tokenString: string;
    if (typeof request.authToken === "string") {
      tokenString = request.authToken;
    } else {
      const authTokenObj = request.authToken as any;
      tokenString = authTokenObj.token || authTokenObj._token;
    }

    await this.authTokenDAO.deleteAuthToken(tokenString);

    return {
      success: true,
      message: null,
    };
  }
}

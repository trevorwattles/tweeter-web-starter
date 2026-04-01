import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserRequest, UserResponse, LogoutRequest, LogoutResponse, FakeData, AuthToken } from "tweeter-shared";

export class UserService {
    public async logout(request: LogoutRequest): Promise<LogoutResponse> {
        if (!request.authToken) {
            throw new Error("[Bad Request] missing required parameters");
        }

        // Fake data backend doesn't need to do anything to log someone out
        return {
            success: true,
            message: null
        };
    }

    public async getUser(request: UserRequest): Promise<UserResponse> {
        if (!request.alias) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const user = FakeData.instance.findUserByAlias(request.alias);

        return {
            success: true,
            message: null,
            user: user
        };
    }

    public async login(request: LoginRequest): Promise<LoginResponse> {
        if (!request.alias || !request.password) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("[Server Error] invalid alias or password");
        }

        return {
            success: true,
            message: null,
            user: user,
            authToken: AuthToken.Generate()
        };
    }

    public async register(request: RegisterRequest): Promise<RegisterResponse> {
        if (!request.firstName || !request.lastName || !request.alias || !request.password) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("[Server Error] invalid registration");
        }

        return {
            success: true,
            message: null,
            user: user,
            authToken: AuthToken.Generate()
        };
    }
}

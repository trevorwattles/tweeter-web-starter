import {
  FollowerCountRequest,
  FollowerCountResponse,
  FolloweeCountRequest,
  FolloweeCountResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  IsFollowerStatusRequest,
  IsFollowerStatusResponse,
  FollowRequest,
  FollowResponse,
  UnfollowRequest,
  UnfollowResponse,
  User,
} from "tweeter-shared";
import { IDAOFactory } from "../dao/IDAOFactory";
import { IFollowDAO } from "../dao/IFollowDAO";
import { IUserDAO } from "../dao/IUserDAO";
import { AuthService } from "./AuthService";

export class FollowService {
  private followDAO: IFollowDAO;
  private userDAO: IUserDAO;
  private authService: AuthService;

  constructor(factory: IDAOFactory) {
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
    this.authService = new AuthService(factory.getAuthTokenDAO());
  }

  // Helper to extract alias from either a User instance or plain JSON object
  private getUserAlias(user: any): string {
    return user.alias || user._alias;
  }

  private getUserName(user: any): string {
    if (user.name) return user.name;
    const firstName = user.firstName || user._firstName;
    const lastName = user.lastName || user._lastName;
    return `${firstName} ${lastName}`;
  }

  public async getFollowerCount(
    request: FollowerCountRequest
  ): Promise<FollowerCountResponse> {
    if (!request.user) {
      throw new Error("[Bad Request] missing user");
    }

    await this.authService.validate(request.authToken);

    const count = await this.followDAO.getFollowerCount(this.getUserAlias(request.user));

    return {
      success: true,
      message: null,
      followerCount: count,
    };
  }

  public async getFolloweeCount(
    request: FolloweeCountRequest
  ): Promise<FolloweeCountResponse> {
    if (!request.user) {
      throw new Error("[Bad Request] missing user");
    }

    await this.authService.validate(request.authToken);

    const count = await this.followDAO.getFolloweeCount(this.getUserAlias(request.user));

    return {
      success: true,
      message: null,
      followeeCount: count,
    };
  }

  public async loadMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<PagedUserItemResponse> {
    if (!request.userAlias || !request.pageSize) {
      throw new Error("[Bad Request] missing required parameters");
    }

    await this.authService.validate(request.authToken);

    const lastAlias = request.lastItem ? this.getUserAlias(request.lastItem) : undefined;
    const page = await this.followDAO.getPageOfFollowers(
      request.userAlias,
      request.pageSize,
      lastAlias
    );

    // Convert FollowRows to User objects
    const users: User[] = [];
    for (const row of page.values) {
      const userRow = await this.userDAO.getUser(row.followerAlias);
      if (userRow) {
        users.push(
          new User(
            userRow.firstName,
            userRow.lastName,
            userRow.alias,
            userRow.imageUrl
          )
        );
      }
    }

    return {
      success: true,
      message: null,
      items: users,
      hasMore: page.hasMorePages,
    };
  }

  public async loadMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<PagedUserItemResponse> {
    if (!request.userAlias || !request.pageSize) {
      throw new Error("[Bad Request] missing required parameters");
    }

    await this.authService.validate(request.authToken);

    const lastAlias = request.lastItem ? this.getUserAlias(request.lastItem) : undefined;
    const page = await this.followDAO.getPageOfFollowees(
      request.userAlias,
      request.pageSize,
      lastAlias
    );

    // Convert FollowRows to User objects
    const users: User[] = [];
    for (const row of page.values) {
      const userRow = await this.userDAO.getUser(row.followeeAlias);
      if (userRow) {
        users.push(
          new User(
            userRow.firstName,
            userRow.lastName,
            userRow.alias,
            userRow.imageUrl
          )
        );
      }
    }

    return {
      success: true,
      message: null,
      items: users,
      hasMore: page.hasMorePages,
    };
  }

  public async getIsFollowerStatus(
    request: IsFollowerStatusRequest
  ): Promise<IsFollowerStatusResponse> {
    if (!request.user || !request.selectedUser) {
      throw new Error("[Bad Request] missing required parameters");
    }

    await this.authService.validate(request.authToken);

    const follow = await this.followDAO.getFollow(
      this.getUserAlias(request.user),
      this.getUserAlias(request.selectedUser)
    );

    return {
      success: true,
      message: null,
      isFollower: follow !== null,
    };
  }

  public async follow(request: FollowRequest): Promise<FollowResponse> {
    if (!request.userToFollow) {
      throw new Error("[Bad Request] missing required parameters");
    }

    const currentUserAlias = await this.authService.validate(
      request.authToken
    );

    const currentUserRow = await this.userDAO.getUser(currentUserAlias);
    if (!currentUserRow) {
      throw new Error("[Server Error] current user not found");
    }

    await this.followDAO.putFollow(
      currentUserAlias,
      `${currentUserRow.firstName} ${currentUserRow.lastName}`,
      this.getUserAlias(request.userToFollow),
      this.getUserName(request.userToFollow)
    );

    const followerCount = await this.followDAO.getFollowerCount(
      this.getUserAlias(request.userToFollow)
    );
    const followeeCount = await this.followDAO.getFolloweeCount(
      this.getUserAlias(request.userToFollow)
    );

    return {
      success: true,
      message: null,
      followerCount,
      followeeCount,
    };
  }

  public async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
    if (!request.userToUnfollow) {
      throw new Error("[Bad Request] missing required parameters");
    }

    const currentUserAlias = await this.authService.validate(
      request.authToken
    );

    await this.followDAO.deleteFollow(
      currentUserAlias,
      this.getUserAlias(request.userToUnfollow)
    );

    const followerCount = await this.followDAO.getFollowerCount(
      this.getUserAlias(request.userToUnfollow)
    );
    const followeeCount = await this.followDAO.getFolloweeCount(
      this.getUserAlias(request.userToUnfollow)
    );

    return {
      success: true,
      message: null,
      followerCount,
      followeeCount,
    };
  }
}

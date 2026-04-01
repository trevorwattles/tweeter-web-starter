import { FollowerCountRequest, FollowerCountResponse, FolloweeCountRequest, FolloweeCountResponse, PagedUserItemRequest, PagedUserItemResponse, IsFollowerStatusRequest, IsFollowerStatusResponse, FollowRequest, FollowResponse, UnfollowRequest, UnfollowResponse, PostStatusRequest, PostStatusResponse, PagedStatusItemRequest, PagedStatusItemResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserRequest, UserResponse, LogoutRequest, LogoutResponse, User, Status, AuthToken } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL = "https://3rx6icvrn7.execute-api.us-west-2.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getFollowerCount(request: FollowerCountRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<FollowerCountRequest, FollowerCountResponse>(
            request, 
            "/follower/count"
        );

        if (response.success) {
            return response.followerCount;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getFolloweeCount(request: FolloweeCountRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<FolloweeCountRequest, FolloweeCountResponse>(
            request,
            "/followee/count"
        );

        if (response.success) {
            return response.followeeCount;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async loadMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
            request,
            "/follower/list"
        );

        if (response.success) {
            const items = (response.items ?? []).map(
                (user: any) => new User(user._firstName, user._lastName, user._alias, user._imageUrl)
            );
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async loadMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
            request,
            "/followee/list"
        );

        if (response.success) {
            const items = (response.items ?? []).map(
                (user: any) => new User(user._firstName, user._lastName, user._alias, user._imageUrl)
            );
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getIsFollowerStatus(request: IsFollowerStatusRequest): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<IsFollowerStatusRequest, IsFollowerStatusResponse>(
            request,
            "/follower/status"
        );

        if (response.success) {
            return response.isFollower;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async follow(request: FollowRequest): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
            request,
            "/follow"
        );

        if (response.success) {
            return [response.followerCount, response.followeeCount];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async unfollow(request: UnfollowRequest): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<UnfollowRequest, UnfollowResponse>(
            request,
            "/unfollow"
        );

        if (response.success) {
            return [response.followerCount, response.followeeCount];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async postStatus(request: PostStatusRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<PostStatusRequest, PostStatusResponse>(
            request,
            "/status/post"
        );

        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async loadMoreStoryItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
            request,
            "/story/list"
        );

        if (response.success) {
            const items = (response.items ?? []).map(
                (status: any) => new Status(
                    status._post,
                    new User(
                        status._user._firstName,
                        status._user._lastName,
                        status._user._alias,
                        status._user._imageUrl
                    ),
                    status._timestamp
                )
            );
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async loadMoreFeedItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
            request,
            "/feed/list"
        );

        if (response.success) {
            const items = (response.items ?? []).map(
                (status: any) => new Status(
                    status._post,
                    new User(
                        status._user._firstName,
                        status._user._lastName,
                        status._user._alias,
                        status._user._imageUrl
                    ),
                    status._timestamp
                )
            );
            return [items, response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async login(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(
            request,
            "/auth/login"
        );

        if (response.success) {
            return [
                new User(
                    (response.user as any)._firstName,
                    (response.user as any)._lastName,
                    (response.user as any)._alias,
                    (response.user as any)._imageUrl
                ),
                new AuthToken(
                    (response.authToken as any)._token,
                    (response.authToken as any)._timestamp
                )
            ];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<RegisterRequest, RegisterResponse>(
            request,
            "/auth/register"
        );

        if (response.success) {
            return [
                new User(
                    (response.user as any)._firstName,
                    (response.user as any)._lastName,
                    (response.user as any)._alias,
                    (response.user as any)._imageUrl
                ),
                new AuthToken(
                    (response.authToken as any)._token,
                    (response.authToken as any)._timestamp
                )
            ];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getUser(request: UserRequest): Promise<User | null> {
        const response = await this.clientCommunicator.doPost<UserRequest, UserResponse>(
            request,
            "/user/get"
        );

        if (response.success) {
            if (response.user) {
                return new User(
                    (response.user as any)._firstName,
                    (response.user as any)._lastName,
                    (response.user as any)._alias,
                    (response.user as any)._imageUrl
                );
            } else {
                return null;
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async logout(request: LogoutRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<LogoutRequest, LogoutResponse>(
            request,
            "/auth/logout"
        );

        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }
}

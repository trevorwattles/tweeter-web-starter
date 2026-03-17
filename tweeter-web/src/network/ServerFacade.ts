import { FollowerCountRequest, FollowerCountResponse, FolloweeCountRequest, FolloweeCountResponse, PagedUserItemRequest, PagedUserItemResponse, User } from "tweeter-shared";
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
            return [response.items ?? [], response.hasMore];
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
            return [response.items ?? [], response.hasMore];
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }
}

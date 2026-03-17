import { FollowerCountRequest, FollowerCountResponse, FolloweeCountRequest, FolloweeCountResponse, PagedUserItemRequest, PagedUserItemResponse, FakeData } from "tweeter-shared";

export class FollowService {
    public async getFollowerCount(request: FollowerCountRequest): Promise<FollowerCountResponse> {
        if (!request.user) {
            throw new Error("[Bad Request] missing user");
        }

        const count = await FakeData.instance.getFollowerCount(request.user.alias);

        return {
            success: true,
            message: null,
            followerCount: count
        };
    }

    public async getFolloweeCount(request: FolloweeCountRequest): Promise<FolloweeCountResponse> {
        if (!request.user) {
            throw new Error("[Bad Request] missing user");
        }

        const count = await FakeData.instance.getFolloweeCount(request.user.alias);

        return {
            success: true,
            message: null,
            followeeCount: count
        };
    }

    public async loadMoreFollowers(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const [items, hasMore] = await FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.userAlias);

        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore
        };
    }

    public async loadMoreFollowees(request: PagedUserItemRequest): Promise<PagedUserItemResponse> {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const [items, hasMore] = await FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.userAlias);

        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore
        };
    }
}

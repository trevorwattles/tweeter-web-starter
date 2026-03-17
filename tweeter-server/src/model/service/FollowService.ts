import { FollowerCountRequest, FollowerCountResponse, FolloweeCountRequest, FolloweeCountResponse, PagedUserItemRequest, PagedUserItemResponse, IsFollowerStatusRequest, IsFollowerStatusResponse, FollowRequest, FollowResponse, UnfollowRequest, UnfollowResponse, FakeData } from "tweeter-shared";

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

    public async getIsFollowerStatus(request: IsFollowerStatusRequest): Promise<IsFollowerStatusResponse> {
        if (!request.user || !request.selectedUser) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const isFollower = await FakeData.instance.isFollower();

        return {
            success: true,
            message: null,
            isFollower: isFollower
        };
    }

    public async follow(request: FollowRequest): Promise<FollowResponse> {
        if (!request.userToFollow) {
            throw new Error("[Bad Request] missing required parameters");
        }

        // Return mocked updated counts (add 1 to followee logic, but FakeData isn't real anyway)
        const followerCount = await FakeData.instance.getFollowerCount(request.userToFollow.alias);
        const followeeCount = await FakeData.instance.getFolloweeCount(request.userToFollow.alias);

        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount
        };
    }

    public async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
        if (!request.userToUnfollow) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const followerCount = await FakeData.instance.getFollowerCount(request.userToUnfollow.alias);
        const followeeCount = await FakeData.instance.getFolloweeCount(request.userToUnfollow.alias);

        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount
        };
    }
}

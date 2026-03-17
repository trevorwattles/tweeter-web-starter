"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async getFollowerCount(request) {
        if (!request.user) {
            throw new Error("[Bad Request] missing user");
        }
        const count = await tweeter_shared_1.FakeData.instance.getFollowerCount(request.user.alias);
        return {
            success: true,
            message: null,
            followerCount: count
        };
    }
    async getFolloweeCount(request) {
        if (!request.user) {
            throw new Error("[Bad Request] missing user");
        }
        const count = await tweeter_shared_1.FakeData.instance.getFolloweeCount(request.user.alias);
        return {
            success: true,
            message: null,
            followeeCount: count
        };
    }
    async loadMoreFollowers(request) {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }
        const [items, hasMore] = await tweeter_shared_1.FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.userAlias);
        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore
        };
    }
    async loadMoreFollowees(request) {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }
        const [items, hasMore] = await tweeter_shared_1.FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.userAlias);
        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore
        };
    }
    async getIsFollowerStatus(request) {
        if (!request.user || !request.selectedUser) {
            throw new Error("[Bad Request] missing required parameters");
        }
        const isFollower = await tweeter_shared_1.FakeData.instance.isFollower();
        return {
            success: true,
            message: null,
            isFollower: isFollower
        };
    }
    async follow(request) {
        if (!request.userToFollow) {
            throw new Error("[Bad Request] missing required parameters");
        }
        // Return mocked updated counts (add 1 to followee logic, but FakeData isn't real anyway)
        const followerCount = await tweeter_shared_1.FakeData.instance.getFollowerCount(request.userToFollow.alias);
        const followeeCount = await tweeter_shared_1.FakeData.instance.getFolloweeCount(request.userToFollow.alias);
        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount
        };
    }
    async unfollow(request) {
        if (!request.userToUnfollow) {
            throw new Error("[Bad Request] missing required parameters");
        }
        const followerCount = await tweeter_shared_1.FakeData.instance.getFollowerCount(request.userToUnfollow.alias);
        const followeeCount = await tweeter_shared_1.FakeData.instance.getFolloweeCount(request.userToUnfollow.alias);
        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount
        };
    }
}
exports.FollowService = FollowService;

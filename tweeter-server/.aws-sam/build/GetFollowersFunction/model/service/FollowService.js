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
}
exports.FollowService = FollowService;

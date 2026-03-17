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
}
exports.FollowService = FollowService;

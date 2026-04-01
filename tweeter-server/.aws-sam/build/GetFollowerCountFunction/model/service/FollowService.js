"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const AuthService_1 = require("./AuthService");
class FollowService {
    followDAO;
    userDAO;
    authService;
    constructor(factory) {
        this.followDAO = factory.getFollowDAO();
        this.userDAO = factory.getUserDAO();
        this.authService = new AuthService_1.AuthService(factory.getAuthTokenDAO());
    }
    // Helper to extract alias from either a User instance or plain JSON object
    getUserAlias(user) {
        return user.alias || user._alias;
    }
    getUserName(user) {
        if (user.name)
            return user.name;
        const firstName = user.firstName || user._firstName;
        const lastName = user.lastName || user._lastName;
        return `${firstName} ${lastName}`;
    }
    async getFollowerCount(request) {
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
    async getFolloweeCount(request) {
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
    async loadMoreFollowers(request) {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }
        await this.authService.validate(request.authToken);
        const lastAlias = request.lastItem ? this.getUserAlias(request.lastItem) : undefined;
        const page = await this.followDAO.getPageOfFollowers(request.userAlias, request.pageSize, lastAlias);
        // Convert FollowRows to User objects
        const users = [];
        for (const row of page.values) {
            const userRow = await this.userDAO.getUser(row.followerAlias);
            if (userRow) {
                users.push(new tweeter_shared_1.User(userRow.firstName, userRow.lastName, userRow.alias, userRow.imageUrl));
            }
        }
        return {
            success: true,
            message: null,
            items: users,
            hasMore: page.hasMorePages,
        };
    }
    async loadMoreFollowees(request) {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }
        await this.authService.validate(request.authToken);
        const lastAlias = request.lastItem ? this.getUserAlias(request.lastItem) : undefined;
        const page = await this.followDAO.getPageOfFollowees(request.userAlias, request.pageSize, lastAlias);
        // Convert FollowRows to User objects
        const users = [];
        for (const row of page.values) {
            const userRow = await this.userDAO.getUser(row.followeeAlias);
            if (userRow) {
                users.push(new tweeter_shared_1.User(userRow.firstName, userRow.lastName, userRow.alias, userRow.imageUrl));
            }
        }
        return {
            success: true,
            message: null,
            items: users,
            hasMore: page.hasMorePages,
        };
    }
    async getIsFollowerStatus(request) {
        if (!request.user || !request.selectedUser) {
            throw new Error("[Bad Request] missing required parameters");
        }
        await this.authService.validate(request.authToken);
        const follow = await this.followDAO.getFollow(this.getUserAlias(request.user), this.getUserAlias(request.selectedUser));
        return {
            success: true,
            message: null,
            isFollower: follow !== null,
        };
    }
    async follow(request) {
        if (!request.userToFollow) {
            throw new Error("[Bad Request] missing required parameters");
        }
        const currentUserAlias = await this.authService.validate(request.authToken);
        const currentUserRow = await this.userDAO.getUser(currentUserAlias);
        if (!currentUserRow) {
            throw new Error("[Server Error] current user not found");
        }
        await this.followDAO.putFollow(currentUserAlias, `${currentUserRow.firstName} ${currentUserRow.lastName}`, this.getUserAlias(request.userToFollow), this.getUserName(request.userToFollow));
        const followerCount = await this.followDAO.getFollowerCount(this.getUserAlias(request.userToFollow));
        const followeeCount = await this.followDAO.getFolloweeCount(this.getUserAlias(request.userToFollow));
        return {
            success: true,
            message: null,
            followerCount,
            followeeCount,
        };
    }
    async unfollow(request) {
        if (!request.userToUnfollow) {
            throw new Error("[Bad Request] missing required parameters");
        }
        const currentUserAlias = await this.authService.validate(request.authToken);
        await this.followDAO.deleteFollow(currentUserAlias, this.getUserAlias(request.userToUnfollow));
        const followerCount = await this.followDAO.getFollowerCount(this.getUserAlias(request.userToUnfollow));
        const followeeCount = await this.followDAO.getFolloweeCount(this.getUserAlias(request.userToUnfollow));
        return {
            success: true,
            message: null,
            followerCount,
            followeeCount,
        };
    }
}
exports.FollowService = FollowService;

import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { FollowerCountRequest, User, PagedUserItemRequest, IsFollowerStatusRequest, FollowRequest, UnfollowRequest } from "tweeter-shared";

describe("ServerFacade", () => {
    let serverFacade: ServerFacade;

    beforeAll(() => {
        serverFacade = new ServerFacade();
    });

    it("should return the follower count for a user", async () => {
        const user = new User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        
        const request: FollowerCountRequest = {
            authToken: "test-auth-token",
            user: user,
        };

        const followerCount = await serverFacade.getFollowerCount(request);

        expect(followerCount).toBeGreaterThanOrEqual(0);
        console.log(`Follower count for ${user.alias}: ${followerCount}`);
    });
    it("should return the followee count for a user", async () => {
        const user = new User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        
        const request: FollowerCountRequest = {
            authToken: "test-auth-token",
            user: user,
        };

        const followeeCount = await serverFacade.getFolloweeCount(request);

        expect(followeeCount).toBeGreaterThanOrEqual(0);
        console.log(`Followee count for ${user.alias}: ${followeeCount}`);
    });

    it("should return a page of followers for a user", async () => {
        const request: PagedUserItemRequest = {
            authToken: "test-auth-token",
            userAlias: "@allen",
            pageSize: 10,
            lastItem: null,
        };

        const [users, hasMore] = await serverFacade.loadMoreFollowers(request);

        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThan(0);
        expect(hasMore).toBeDefined();
        console.log(`Loaded ${users.length} followers. Has more: ${hasMore}`);
    });

    it("should return a page of followees for a user", async () => {
        const request: PagedUserItemRequest = {
            authToken: "test-auth-token",
            userAlias: "@allen",
            pageSize: 10,
            lastItem: null,
        };

        const [users, hasMore] = await serverFacade.loadMoreFollowees(request);

        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThan(0);
        expect(hasMore).toBeDefined();
        console.log(`Loaded ${users.length} followees. Has more: ${hasMore}`);
    });

    it("should return the is follower status between two users", async () => {
        const user = new User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        const selectedUser = new User("Amy", "Ames", "@amy", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png");
        
        const request: IsFollowerStatusRequest = {
            authToken: "test-auth-token",
            user: user,
            selectedUser: selectedUser
        };

        const isFollower = await serverFacade.getIsFollowerStatus(request);

        expect(isFollower).toBeDefined();
        console.log(`Is ${user.alias} a follower of ${selectedUser.alias}? ${isFollower}`);
    });

    it("should process a follow request and return updated counts", async () => {
        const userToFollow = new User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        
        const request: FollowRequest = {
            authToken: "test-auth-token",
            userToFollow: userToFollow
        };

        const [followerCount, followeeCount] = await serverFacade.follow(request);

        expect(followerCount).toBeGreaterThanOrEqual(0);
        expect(followeeCount).toBeGreaterThanOrEqual(0);
        console.log(`Followed ${userToFollow.alias}. New Follower Count: ${followerCount}, New Followee Count: ${followeeCount}`);
    });
    it("should process an unfollow request and return updated counts", async () => {
        const userToUnfollow = new User("Allen", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
        
        const request: UnfollowRequest = {
            authToken: "test-auth-token",
            userToUnfollow: userToUnfollow
        };

        const [followerCount, followeeCount] = await serverFacade.unfollow(request);

        expect(followerCount).toBeGreaterThanOrEqual(0);
        expect(followeeCount).toBeGreaterThanOrEqual(0);
        console.log(`Unfollowed ${userToUnfollow.alias}. New Follower Count: ${followerCount}, New Followee Count: ${followeeCount}`);
    });
});

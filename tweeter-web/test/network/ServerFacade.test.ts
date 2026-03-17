import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { FollowerCountRequest, User } from "tweeter-shared";

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
});

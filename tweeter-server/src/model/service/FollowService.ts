import { FollowerCountRequest, FollowerCountResponse, FakeData } from "tweeter-shared";

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
}

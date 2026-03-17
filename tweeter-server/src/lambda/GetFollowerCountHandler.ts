import { FollowerCountRequest, FollowerCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: any): Promise<FollowerCountResponse> => {
    const followService = new FollowService();
    let request: FollowerCountRequest;
    
    if (event.body) {
        request = JSON.parse(event.body);
    } else {
        request = event;
    }
    
    const response = await followService.getFollowerCount(request);
    
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(response)
    } as any;
};

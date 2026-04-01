import { PagedUserItemRequest, PagedUserItemResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: any): Promise<PagedUserItemResponse> => {
    const followService = new FollowService();
    let request: PagedUserItemRequest;
    
    if (event.body) {
        request = JSON.parse(event.body);
    } else {
        request = event;
    }

    let deserializedLastItem = null;
    if (request.lastItem) {
        deserializedLastItem = User.fromJson(JSON.stringify(request.lastItem));
    }
    
    const requestWithObject = {
        ...request,
        lastItem: deserializedLastItem
    };
    
    const response = await followService.loadMoreFollowers(requestWithObject);
    
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

import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: any): Promise<PostStatusResponse> => {
    const statusService = new StatusService();
    let request: PostStatusRequest;
    
    if (event.body) {
        request = JSON.parse(event.body);
    } else {
        request = event;
    }
    
    const response = await statusService.postStatus(request);
    
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

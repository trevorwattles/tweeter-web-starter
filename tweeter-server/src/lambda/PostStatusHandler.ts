import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (event: any): Promise<PostStatusResponse> => {
    const factory = new DynamoDAOFactory();
    const statusService = new StatusService(factory);
    let request: PostStatusRequest;
    
    if (event.body) {
        request = JSON.parse(event.body);
    } else {
        request = event;
    }
    
    try {
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
    } catch (e: any) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
                success: false,
                message: e.message,
                errorMessage: e.message
            })
        } as any;
    }
};

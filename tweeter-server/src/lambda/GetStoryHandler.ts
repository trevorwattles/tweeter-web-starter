import { PagedStatusItemRequest, PagedStatusItemResponse, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: any): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService();
    let request: PagedStatusItemRequest;
    
    if (event.body) {
        request = JSON.parse(event.body);
    } else {
        request = event;
    }

    let deserializedLastItem = null;
    if (request.lastItem) {
        deserializedLastItem = Status.fromJson(JSON.stringify(request.lastItem));
    }
    
    const requestWithObject = {
        ...request,
        lastItem: deserializedLastItem
    };
    
    const response = await statusService.loadMoreStoryItems(requestWithObject);
    
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

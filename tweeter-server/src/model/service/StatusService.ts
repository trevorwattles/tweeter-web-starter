import { PostStatusRequest, PostStatusResponse, PagedStatusItemRequest, PagedStatusItemResponse, FakeData } from "tweeter-shared";

export class StatusService {
    public async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
        if (!request.newStatus) {
            throw new Error("[Bad Request] missing required parameters");
        }

        // For now, we don't actually persist anything — just acknowledge success
        return {
            success: true,
            message: null
        };
    }

    public async loadMoreStoryItems(request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const [items, hasMore] = await FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);

        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore
        };
    }
    public async loadMoreFeedItems(request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> {
        if (!request.userAlias || !request.pageSize) {
            throw new Error("[Bad Request] missing required parameters");
        }

        const [items, hasMore] = await FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);

        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore
        };
    }
}

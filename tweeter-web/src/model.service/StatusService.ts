import { AuthToken, Status, PostStatusRequest, PagedStatusItemRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    } as PagedStatusItemRequest;
    return await new ServerFacade().loadMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    } as PagedStatusItemRequest;
    return await new ServerFacade().loadMoreFeedItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const request = {
      authToken: authToken.token,
      newStatus: newStatus,
    } as PostStatusRequest;

    await new ServerFacade().postStatus(request);
  }
}


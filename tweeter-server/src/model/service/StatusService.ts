import {
  PostStatusRequest,
  PostStatusResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  Status,
  User,
} from "tweeter-shared";
import { IDAOFactory } from "../dao/IDAOFactory";
import { IStatusDAO, FeedItem } from "../dao/IStatusDAO";
import { IFollowDAO } from "../dao/IFollowDAO";
import { IUserDAO } from "../dao/IUserDAO";
import { AuthService } from "./AuthService";

export class StatusService {
  private statusDAO: IStatusDAO;
  private followDAO: IFollowDAO;
  private userDAO: IUserDAO;
  private authService: AuthService;

  constructor(factory: IDAOFactory) {
    this.statusDAO = factory.getStatusDAO();
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
    this.authService = new AuthService(factory.getAuthTokenDAO());
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<PostStatusResponse> {
    if (!request.newStatus) {
      throw new Error("[Bad Request] missing required parameters");
    }

    const currentUserAlias = await this.authService.validate(
      request.authToken
    );

    const status = request.newStatus as any;
    const timestamp = status.timestamp || status._timestamp;
    const post = status.post || status._post;

    // Write to the story table
    await this.statusDAO.putStory(currentUserAlias, timestamp, post);

    // Fan out to all followers' feeds
    const followerAliases =
      await this.followDAO.getFollowerAliases(currentUserAlias);

    if (followerAliases.length > 0) {
      const feedItems: FeedItem[] = followerAliases.map((alias) => ({
        receiverAlias: alias,
        senderAlias: currentUserAlias,
        timestamp,
        post,
      }));

      await this.statusDAO.putFeedBatch(feedItems);
    }

    return {
      success: true,
      message: null,
    };
  }

  public async loadMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    if (!request.userAlias || !request.pageSize) {
      throw new Error("[Bad Request] missing required parameters");
    }

    await this.authService.validate(request.authToken);

    const lastTimestamp = request.lastItem
      ? (request.lastItem.timestamp || (request.lastItem as any)._timestamp)
      : undefined;

    const page = await this.statusDAO.getPageOfStory(
      request.userAlias,
      request.pageSize,
      lastTimestamp
    );

    // Convert StatusRows to Status objects
    const statuses: Status[] = [];
    for (const row of page.values) {
      const userRow = await this.userDAO.getUser(row.senderAlias);
      if (userRow) {
        const user = new User(
          userRow.firstName,
          userRow.lastName,
          userRow.alias,
          userRow.imageUrl
        );
        statuses.push(new Status(row.post, user, row.timestamp));
      }
    }

    return {
      success: true,
      message: null,
      items: statuses,
      hasMore: page.hasMorePages,
    };
  }

  public async loadMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    if (!request.userAlias || !request.pageSize) {
      throw new Error("[Bad Request] missing required parameters");
    }

    await this.authService.validate(request.authToken);

    const lastTimestamp = request.lastItem
      ? (request.lastItem.timestamp || (request.lastItem as any)._timestamp)
      : undefined;

    const page = await this.statusDAO.getPageOfFeed(
      request.userAlias,
      request.pageSize,
      lastTimestamp
    );

    // Convert StatusRows to Status objects
    const statuses: Status[] = [];
    for (const row of page.values) {
      const userRow = await this.userDAO.getUser(row.senderAlias);
      if (userRow) {
        const user = new User(
          userRow.firstName,
          userRow.lastName,
          userRow.alias,
          userRow.imageUrl
        );
        statuses.push(new Status(row.post, user, row.timestamp));
      }
    }

    return {
      success: true,
      message: null,
      items: statuses,
      hasMore: page.hasMorePages,
    };
  }
}

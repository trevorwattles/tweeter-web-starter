import { DataPage } from "./DataPage";

export interface StatusRow {
  senderAlias: string;
  timestamp: number;
  post: string;
}

export interface FeedItem {
  receiverAlias: string;
  senderAlias: string;
  timestamp: number;
  post: string;
}

export interface IStatusDAO {
  putStory(senderAlias: string, timestamp: number, post: string): Promise<void>;

  getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<DataPage<StatusRow>>;

  putFeedBatch(items: FeedItem[]): Promise<void>;

  getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<DataPage<StatusRow>>;
}

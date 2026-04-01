import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IStatusDAO, StatusRow, FeedItem } from "../IStatusDAO";
import { DataPage } from "../DataPage";

const STORIES_TABLE = "stories";
const FEEDS_TABLE = "feeds";

export class DynamoStatusDAO implements IStatusDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: "us-west-2" })
    );
  }

  async putStory(
    senderAlias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: STORIES_TABLE,
        Item: {
          sender_alias: senderAlias,
          timestamp,
          post,
        },
      })
    );
  }

  async getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<DataPage<StatusRow>> {
    const params: any = {
      TableName: STORIES_TABLE,
      KeyConditionExpression: "sender_alias = :sa",
      ExpressionAttributeValues: {
        ":sa": senderAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        sender_alias: senderAlias,
        timestamp: lastTimestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    const rows: StatusRow[] = (result.Items || []).map((item) => ({
      senderAlias: item.sender_alias,
      timestamp: item.timestamp,
      post: item.post,
    }));

    return new DataPage(rows, !!result.LastEvaluatedKey);
  }

  async putFeedBatch(items: FeedItem[]): Promise<void> {
    // DynamoDB batch write is limited to 25 items
    const BATCH_SIZE = 25;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);

      const writeRequests = batch.map((item) => ({
        PutRequest: {
          Item: {
            receiver_alias: item.receiverAlias,
            timestamp: item.timestamp,
            sender_alias: item.senderAlias,
            post: item.post,
          },
        },
      }));

      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [FEEDS_TABLE]: writeRequests,
          },
        })
      );
    }
  }

  async getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<DataPage<StatusRow>> {
    const params: any = {
      TableName: FEEDS_TABLE,
      KeyConditionExpression: "receiver_alias = :ra",
      ExpressionAttributeValues: {
        ":ra": receiverAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        receiver_alias: receiverAlias,
        timestamp: lastTimestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    const rows: StatusRow[] = (result.Items || []).map((item) => ({
      senderAlias: item.sender_alias,
      timestamp: item.timestamp,
      post: item.post,
    }));

    return new DataPage(rows, !!result.LastEvaluatedKey);
  }
}

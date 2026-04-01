import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { IFollowDAO, FollowRow } from "../IFollowDAO";
import { DataPage } from "../DataPage";

const TABLE_NAME = "follows";
const INDEX_NAME = "follows_index";

export class DynamoFollowDAO implements IFollowDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: "us-west-2" })
    );
  }

  async putFollow(
    followerAlias: string,
    followerName: string,
    followeeAlias: string,
    followeeName: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
          follower_name: followerName,
          followee_name: followeeName,
        },
      })
    );
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
  }

  async getFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<FollowRow | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return {
      followerAlias: result.Item.follower_handle,
      followerName: result.Item.follower_name,
      followeeAlias: result.Item.followee_handle,
      followeeName: result.Item.followee_name,
    };
  }

  async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias?: string
  ): Promise<DataPage<FollowRow>> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "follower_handle = :fh",
      ExpressionAttributeValues: {
        ":fh": followerAlias,
      },
      Limit: pageSize,
    };

    if (lastFolloweeAlias) {
      params.ExclusiveStartKey = {
        follower_handle: followerAlias,
        followee_handle: lastFolloweeAlias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    const rows: FollowRow[] = (result.Items || []).map((item) => ({
      followerAlias: item.follower_handle,
      followerName: item.follower_name,
      followeeAlias: item.followee_handle,
      followeeName: item.followee_name,
    }));

    return new DataPage(rows, !!result.LastEvaluatedKey);
  }

  async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias?: string
  ): Promise<DataPage<FollowRow>> {
    const params: any = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression: "followee_handle = :fh",
      ExpressionAttributeValues: {
        ":fh": followeeAlias,
      },
      Limit: pageSize,
    };

    if (lastFollowerAlias) {
      params.ExclusiveStartKey = {
        followee_handle: followeeAlias,
        follower_handle: lastFollowerAlias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    const rows: FollowRow[] = (result.Items || []).map((item) => ({
      followerAlias: item.follower_handle,
      followerName: item.follower_name,
      followeeAlias: item.followee_handle,
      followeeName: item.followee_name,
    }));

    return new DataPage(rows, !!result.LastEvaluatedKey);
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :fh",
        ExpressionAttributeValues: { ":fh": followeeAlias },
        Select: "COUNT",
      })
    );

    return result.Count ?? 0;
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "follower_handle = :fh",
        ExpressionAttributeValues: { ":fh": followerAlias },
        Select: "COUNT",
      })
    );

    return result.Count ?? 0;
  }

  async getFollowerAliases(followeeAlias: string): Promise<string[]> {
    const aliases: string[] = [];
    let lastKey: Record<string, any> | undefined = undefined;

    do {
      const params: any = {
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :fh",
        ExpressionAttributeValues: { ":fh": followeeAlias },
        ProjectionExpression: "follower_handle",
      };

      if (lastKey) {
        params.ExclusiveStartKey = lastKey;
      }

      const result = await this.client.send(new QueryCommand(params));

      for (const item of result.Items || []) {
        aliases.push(item.follower_handle);
      }

      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return aliases;
  }
}

import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAuthTokenDAO, AuthTokenRow } from "../IAuthTokenDAO";

const TABLE_NAME = "authTokens";

export class DynamoAuthTokenDAO implements IAuthTokenDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: "us-west-2" })
    );
  }

  async putAuthToken(
    token: string,
    alias: string,
    timestamp: number
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { token, alias, timestamp },
      })
    );
  }

  async getAuthToken(token: string): Promise<AuthTokenRow | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!result.Item) {
      return null;
    }

    return {
      token: result.Item.token,
      alias: result.Item.alias,
      timestamp: result.Item.timestamp,
    };
  }

  async updateAuthTokenTimestamp(
    token: string,
    timestamp: number
  ): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { token },
        UpdateExpression: "SET #ts = :ts",
        ExpressionAttributeNames: { "#ts": "timestamp" },
        ExpressionAttributeValues: { ":ts": timestamp },
      })
    );
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }
}

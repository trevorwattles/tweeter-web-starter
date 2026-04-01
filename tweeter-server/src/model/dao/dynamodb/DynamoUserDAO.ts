import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { IUserDAO, UserRow } from "../IUserDAO";

const TABLE_NAME = "users";

export class DynamoUserDAO implements IUserDAO {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: "us-west-2" })
    );
  }

  async putUser(
    alias: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          alias,
          firstName,
          lastName,
          passwordHash,
          imageUrl,
        },
      })
    );
  }

  async getUser(alias: string): Promise<UserRow | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!result.Item) {
      return null;
    }

    return {
      alias: result.Item.alias,
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      imageUrl: result.Item.imageUrl,
      passwordHash: result.Item.passwordHash,
    };
  }
}

import { IDAOFactory } from "../IDAOFactory";
import { IUserDAO } from "../IUserDAO";
import { IAuthTokenDAO } from "../IAuthTokenDAO";
import { IFollowDAO } from "../IFollowDAO";
import { IStatusDAO } from "../IStatusDAO";
import { IS3DAO } from "../IS3DAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { S3ImageDAO } from "../s3/S3ImageDAO";

export class DynamoDAOFactory implements IDAOFactory {
  getUserDAO(): IUserDAO {
    return new DynamoUserDAO();
  }

  getAuthTokenDAO(): IAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  getFollowDAO(): IFollowDAO {
    return new DynamoFollowDAO();
  }

  getStatusDAO(): IStatusDAO {
    return new DynamoStatusDAO();
  }

  getS3DAO(): IS3DAO {
    return new S3ImageDAO();
  }
}

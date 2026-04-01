import { IUserDAO } from "./IUserDAO";
import { IAuthTokenDAO } from "./IAuthTokenDAO";
import { IFollowDAO } from "./IFollowDAO";
import { IStatusDAO } from "./IStatusDAO";
import { IS3DAO } from "./IS3DAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getAuthTokenDAO(): IAuthTokenDAO;
  getFollowDAO(): IFollowDAO;
  getStatusDAO(): IStatusDAO;
  getS3DAO(): IS3DAO;
}

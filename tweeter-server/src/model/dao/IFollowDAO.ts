import { DataPage } from "./DataPage";

export interface FollowRow {
  followerAlias: string;
  followerName: string;
  followeeAlias: string;
  followeeName: string;
}

export interface IFollowDAO {
  putFollow(
    followerAlias: string,
    followerName: string,
    followeeAlias: string,
    followeeName: string
  ): Promise<void>;

  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  getFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<FollowRow | null>;

  getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias?: string
  ): Promise<DataPage<FollowRow>>;

  getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias?: string
  ): Promise<DataPage<FollowRow>>;

  getFollowerCount(followeeAlias: string): Promise<number>;

  getFolloweeCount(followerAlias: string): Promise<number>;

  getFollowerAliases(followeeAlias: string): Promise<string[]>;
}

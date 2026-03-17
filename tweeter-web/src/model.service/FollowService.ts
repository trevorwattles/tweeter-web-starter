import { AuthToken, User, FakeData, FollowerCountRequest, FolloweeCountRequest, PagedUserItemRequest, IsFollowerStatusRequest, FollowRequest, UnfollowRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem
    } as PagedUserItemRequest;
    return await new ServerFacade().loadMoreFollowees(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem
    } as PagedUserItemRequest;
    return await new ServerFacade().loadMoreFollowers(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const request = {
      authToken: authToken.token,
      user: user,
      selectedUser: selectedUser
    } as IsFollowerStatusRequest;
    return await new ServerFacade().getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request = {
      authToken: authToken.token,
      user: user,
    } as FolloweeCountRequest;
    return await new ServerFacade().getFolloweeCount(request);
  }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        const request = {
            authToken: authToken.token,
            user: user,
        } as FollowerCountRequest;
        return await new ServerFacade().getFollowerCount(request);
    }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      authToken: authToken.token,
      userToFollow: userToFollow,
    } as FollowRequest;
    
    return await new ServerFacade().follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      authToken: authToken.token,
      userToUnfollow: userToUnfollow,
    } as UnfollowRequest;

    return await new ServerFacade().unfollow(request);
  }
}

import { AuthToken, User, FakeData, FollowerCountRequest, FolloweeCountRequest, PagedUserItemRequest } from "tweeter-shared";
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
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
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
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow,
    );

    return [followerCount, followeeCount];
  }
}

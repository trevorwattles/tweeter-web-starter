import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessagePresenter, MessageView } from "./MessagePresenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends MessagePresenter<UserInfoView> {
  private service = new FollowService();

  public async loadUserStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    this.setIsFollowerStatus(authToken, currentUser, displayedUser);
    this.setNumbFollowees(authToken, displayedUser);
    this.setNumbFollowers(authToken, displayedUser);
  }

  private async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser,
          ),
        );
      }
    }, "determine follower status");
  }

  private async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  private async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    await this.doLoadingMessageOperation(
      `Following ${displayedUser.name}...`,
      "follow user",
      async () => {
        const [followerCount, followeeCount] = await this.service.follow(
          authToken,
          displayedUser,
        );
        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ) {
    await this.doLoadingMessageOperation(
      `Unfollowing ${displayedUser.name}...`,
      "unfollow user",
      async () => {
        const [followerCount, followeeCount] = await this.service.unfollow(
          authToken,
          displayedUser,
        );
        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
    );
  }

  public switchToLoggedInUser(currentUser: User) {
    this.view.setDisplayedUser(currentUser);
  }
}

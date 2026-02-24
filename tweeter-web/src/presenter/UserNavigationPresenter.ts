import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigateTo: (url: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService = new UserService();
  public async navigateToUser(
    authToken: AuthToken | null,
    alias: string,
    currentDisplayedUser: User | null,
    featurePath: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (!authToken) return;

      const user = await this.userService.getUser(authToken, alias);

      if (user) {
        // Business Logic: Only navigate if the user is different
        if (!currentDisplayedUser || !user.equals(currentDisplayedUser)) {
          this.view.setDisplayedUser(user);
          this.view.navigateTo(`${featurePath}/${user.alias}`);
        }
      }
    }, "get user");
  }
}

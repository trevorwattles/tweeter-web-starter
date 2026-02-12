import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigateTo: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private userService: UserService;

  constructor(view: UserNavigationView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken | null,
    alias: string,
    currentDisplayedUser: User | null,
    featurePath: string,
  ) {
    try {
      if (!authToken) return;

      const user = await this.userService.getUser(authToken, alias);

      if (user) {
        // Business Logic: Only navigate if the user is different
        if (!currentDisplayedUser || !user.equals(currentDisplayedUser)) {
          this.view.setDisplayedUser(user);
          this.view.navigateTo(`${featurePath}/${user.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }
}

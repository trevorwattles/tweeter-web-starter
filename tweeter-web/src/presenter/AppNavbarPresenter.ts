import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { messageView, Presenter } from "./Presenter";

export interface AppNavbarView extends messageView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private userService = new UserService();

  public async logOut(authToken: AuthToken | null) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "log user out");
  }
}

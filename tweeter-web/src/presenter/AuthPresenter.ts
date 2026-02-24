import { User, AuthToken } from "tweeter-shared";
import { UserQueryPresenter } from "./UserQueryPresenter"; // Updated import
import { View } from "./Presenter";
import { AuthService } from "../model.service/AuthService";

export interface AuthView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigateTo: (url: string) => void;
}

export abstract class AuthPresenter<
  T,
  V extends AuthView,
> extends UserQueryPresenter<V> {
  protected authService = new AuthService();

  protected async doAuthOperation(
    description: string,
    rememberMe: boolean,
    operation: () => Promise<[User, AuthToken]>,
    onSuccess: (user: User) => void,
  ) {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await operation();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      onSuccess(user);
    }, description);

    this.view.setIsLoading(false);
  }

  public abstract checkSubmitButtonStatus(form: T): boolean;
}

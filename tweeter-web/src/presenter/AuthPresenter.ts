import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AuthView {
  setIsLoading: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigateTo: (url: string) => void;
}
export abstract class AuthPresenter<TForm> {
  protected view: AuthView;

  private userService: UserService;

  protected constructor(view: AuthView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public abstract checkSubmitButtonStatus(form: TForm): boolean;
}

import { AuthService } from "../model.service/AuthService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginForm {
  alias: string;
  password: string;
  rememberMe: boolean;
  originalUrl?: string;
}

export class LoginPresenter extends AuthPresenter<LoginForm> {
  private service: AuthService;

  public constructor(view: AuthView) {
    super(view);
    this.service = new AuthService();
  }

  public checkSubmitButtonStatus(form: LoginForm): boolean {
    return !form.alias || !form.password;
  }

  public async doLogin(form: LoginForm) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(
        form.alias,
        form.password,
      );
      this.view.updateUserInfo(user, user, authToken, form.rememberMe);

      if (!!form.originalUrl) {
        this.view.navigateTo(form.originalUrl);
      } else {
        this.view.navigateTo(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}

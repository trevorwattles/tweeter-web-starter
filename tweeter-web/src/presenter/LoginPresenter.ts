import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginForm {
  alias: string;
  password: string;
  rememberMe: boolean;
  originalUrl?: string;
}

export class LoginPresenter extends AuthPresenter<LoginForm, AuthView> {
  public checkSubmitButtonStatus(form: LoginForm): boolean {
    return !form.alias || !form.password;
  }

  public async doLogin(form: LoginForm) {
    await this.doAuthOperation(
      "log user in",
      form.rememberMe,
      () => this.authService.login(form.alias, form.password),
      (user) => {
        const url = form.originalUrl ?? `/feed/${user.alias}`;
        this.view.navigateTo(url);
      },
    );
  }
}

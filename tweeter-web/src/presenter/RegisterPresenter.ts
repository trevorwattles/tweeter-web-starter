import { AuthService } from "../model.service/AuthService";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { LoginForm } from "./LoginPresenter";

export interface RegisterForm {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageUrl: string;
  imageFileExtension: string;
  imageBytes: Uint8Array;
  rememberMe: boolean;
}
export class RegisterPresenter extends AuthPresenter<RegisterForm> {
  private service: AuthService;

  public constructor(view: AuthView) {
    super(view);
    this.service = new AuthService();
  }

  public checkSubmitButtonStatus(form: RegisterForm): boolean {
    return (
      !form.firstName ||
      !form.lastName ||
      !form.alias ||
      !form.password ||
      !form.imageUrl ||
      !form.imageFileExtension
    );
  }

  public async doRegister(form: RegisterForm) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.register(
        form.firstName,
        form.lastName,
        form.alias,
        form.password,
        form.imageBytes,
        form.imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, form.rememberMe);
      this.view.navigateTo(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}

import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

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

export interface RegisterView extends AuthView {
  setImageUrl: (url: string) => void;
  setImageFileExtension: (extension: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthPresenter<
  RegisterForm,
  RegisterView
> {
  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];
        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );
        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = file.name.split(".").pop();
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
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
    await this.doAuthOperation(
      "register user",
      form.rememberMe,
      () =>
        this.authService.register(
          form.firstName,
          form.lastName,
          form.alias,
          form.password,
          form.imageBytes,
          form.imageFileExtension,
        ),
      (user) => this.view.navigateTo(`/feed/${user.alias}`),
    );
  }
}

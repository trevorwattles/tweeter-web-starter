import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationField from "../../AuthenticationField/AuthenticationField";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import {
  RegisterPresenter,
  RegisterView,
} from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const view: RegisterView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigateTo: navigate,
    setImageUrl: setImageUrl,
    setImageBytes: setImageBytes,
    setImageFileExtension: setImageFileExtension,
  };

  const [presenter] = useState(() => new RegisterPresenter(view));

  const checkSubmitButtonStatus = (): boolean => {
    return presenter.checkSubmitButtonStatus({
      firstName,
      lastName,
      alias,
      password,
      imageUrl,
      imageFileExtension,
      imageBytes,
      rememberMe,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    presenter.handleImageFile(file);
  };

  const doRegister = async () => {
    await presenter.doRegister({
      firstName,
      lastName,
      alias,
      password,
      imageUrl,
      imageFileExtension,
      imageBytes,
      rememberMe,
    });
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationField
          id="firstNameInput"
          label="First Name"
          placeholder="First Name"
          value={firstName}
          onChange={setFirstName}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
          doAction={doRegister}
        />

        <AuthenticationField
          id="lastNameInput"
          label="Last Name"
          placeholder="Last Name"
          value={lastName}
          onChange={setLastName}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
          doAction={doRegister}
        />

        <AuthenticationField
          id="aliasInput"
          label="Alias"
          placeholder="name@example.com"
          value={alias}
          onChange={setAlias}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
          doAction={doRegister}
        />

        <div className="mb-3">
          <AuthenticationField
            id="passwordInput"
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            checkSubmitButtonStatus={checkSubmitButtonStatus}
            doAction={doRegister}
          />
        </div>

        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !checkSubmitButtonStatus())
                doRegister();
            }}
            onChange={handleFileChange}
          />

          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail mt-2" alt="" />
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;

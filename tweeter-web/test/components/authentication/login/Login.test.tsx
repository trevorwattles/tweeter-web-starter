import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { mock, instance, verify, deepEqual } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("starts with sign in button disabled", () => {
    const { signInButton } = renderLoginandGetElement("/");
    expect(signInButton).toBeDisabled();
  });
  it("enables sign in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginandGetElement("/");
    await user.type(aliasField, "test");
    await user.type(passwordField, "test");
    expect(signInButton).toBeEnabled();
  });
  it("disables singn in button if either alias or password field is empty", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginandGetElement("/");
    await user.type(aliasField, "test");
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
    await user.type(passwordField, "test");
    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter login method with correct parameters when sign in button is clicked", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.com";
    const alias = "@alias";
    const password = "password";
    const loginForm = {
      alias,
      password,
      rememberMe: false,
      originalUrl,
    };

    const { signInButton, aliasField, passwordField, user } =
      renderLoginandGetElement(originalUrl, mockPresenterInstance);
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(deepEqual(loginForm))).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginandGetElement(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("Alias");
  const passwordField = screen.getByLabelText("Password");

  return { user, signInButton, aliasField, passwordField };
}

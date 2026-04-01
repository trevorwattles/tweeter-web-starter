import { AuthToken, User, FakeData, UserRequest, LogoutRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    const request = {
      authToken: authToken.token,
      alias: alias,
    } as UserRequest;

    return await new ServerFacade().getUser(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request = {
      authToken: authToken.token,
    } as LogoutRequest;

    return await new ServerFacade().logout(request);
  }
}

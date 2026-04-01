import { Buffer } from "buffer";
import { User, AuthToken, FakeData, LoginRequest, RegisterRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class AuthService implements Service {
  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const request = {
      authToken: "",
      alias: alias,
      password: password,
    } as LoginRequest;

    return await new ServerFacade().login(request);
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request = {
      authToken: "",
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      imageStringBase64: imageStringBase64,
      imageFileExtension: imageFileExtension,
    } as RegisterRequest;

    return await new ServerFacade().register(request);
  }
}

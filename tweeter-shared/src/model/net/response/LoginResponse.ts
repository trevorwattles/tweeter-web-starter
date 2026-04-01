import { User } from "../../domain/User";
import { AuthToken } from "../../domain/AuthToken";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse {
    readonly user: User;
    readonly authToken: AuthToken;
}

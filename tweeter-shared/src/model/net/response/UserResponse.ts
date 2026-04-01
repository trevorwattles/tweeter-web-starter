import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export interface UserResponse extends TweeterResponse {
    readonly user: User | null;
}

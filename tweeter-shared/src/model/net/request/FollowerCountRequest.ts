import { TweeterRequest } from "./TweeterRequest";
import { User } from "../../domain/User";

export interface FollowerCountRequest extends TweeterRequest {
    readonly user: User;
}

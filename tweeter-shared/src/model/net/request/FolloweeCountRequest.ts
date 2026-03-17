import { TweeterRequest } from "./TweeterRequest";
import { User } from "../../domain/User";

export interface FolloweeCountRequest extends TweeterRequest {
    readonly user: User;
}

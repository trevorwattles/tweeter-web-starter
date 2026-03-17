import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest {
  userToFollow: User;
}

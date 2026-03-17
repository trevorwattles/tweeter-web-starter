import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowRequest extends TweeterRequest {
  userToUnfollow: User;
}

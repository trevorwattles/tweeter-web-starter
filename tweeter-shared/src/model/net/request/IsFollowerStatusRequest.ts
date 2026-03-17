import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerStatusRequest extends TweeterRequest {
  user: User;
  selectedUser: User;
}

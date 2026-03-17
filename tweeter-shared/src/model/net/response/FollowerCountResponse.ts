import { TweeterResponse } from "./TweeterResponse";

export interface FollowerCountResponse extends TweeterResponse {
    readonly followerCount: number;
}

import { TweeterResponse } from "./TweeterResponse";

export interface FolloweeCountResponse extends TweeterResponse {
    readonly followeeCount: number;
}

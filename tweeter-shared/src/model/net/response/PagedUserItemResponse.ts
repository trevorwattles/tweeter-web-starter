import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse {
    readonly items: User[] | null;
    readonly hasMore: boolean;
}

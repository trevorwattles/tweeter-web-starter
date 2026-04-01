import { Status } from "../../domain/Status";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedStatusItemResponse extends TweeterResponse {
    readonly items: Status[] | null;
    readonly hasMore: boolean;
}

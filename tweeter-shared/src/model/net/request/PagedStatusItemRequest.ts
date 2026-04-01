import { Status } from "../../domain/Status";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedStatusItemRequest extends TweeterRequest {
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: Status | null;
}

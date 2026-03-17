import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: User | null;
}

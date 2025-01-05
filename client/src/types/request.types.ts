import { User } from "./user.types";

export interface FriendRequest {
    _id: string;
    status: string;
    createdAt: string;
    fromUserDetails: User
}
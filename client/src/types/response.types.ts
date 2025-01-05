import { FriendRequest } from "./request.types";
import { Recommended, User } from "./user.types";

export interface LoginResponse {
    statusCode: number;
    data: User;
    message: string;
    success: boolean;
}

export interface FriendsResponse {
    statusCode: number;
    data: User[];
    message: string;
    success: boolean;
}

export interface RecommendedPeople {
    statusCode: number;
    data: Recommended[];
    message: string;
    success: boolean;
}

export interface GetFriendRequest {
    statusCode: number;
    data: FriendRequest[];
    message: string;
    success: boolean;
}

export interface Unfriend {
    statusCode: number;
    data: null;
    message: string;
    success: boolean;
}
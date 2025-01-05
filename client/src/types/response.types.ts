import { User } from "./user.types";

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
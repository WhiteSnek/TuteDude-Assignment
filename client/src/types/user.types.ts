export interface User {
    _id: string;
    username: string;
    fullname: string;
    avatar: string;
}

export interface Recommended {
    _id: string;
    username: string;
    fullname: string;
    password: string;
    avatar: string;
    mutualFriends: number;
    commonInterests: number;
    reason: string;
}
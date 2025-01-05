import { LoginUser } from "./login.types";
import { FriendRequest } from "./request.types";
import { Recommended, User } from "./user.types";

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (userInfo: LoginUser) => Promise<{ success: boolean; error?: string }>;
  getFriends: () => Promise<{
    success: boolean;
    message: User[] | null;
    error?: string;
  }>;
  getRecommended: () => Promise<{
    success: boolean;
    message: Recommended[] | null;
    error?: string;
  }>;
  getFriendRequests: () => Promise<{
    success: boolean;
    message: FriendRequest[] | null;
    error?: string;
  }>;
  unFriend: (friendId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  handleFriendRequest: (friendId: string, status: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  sendFriendRequest: (toUserId: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  searchPeople: (query: string) => Promise<{
    success: boolean;
    message: User[] | null;
    error?: string;
  }>;
  logout: () => Promise<{
    success: boolean;
    message: string;
  }>;
  register: (formData: FormData) => Promise<{
    success: boolean;
    message: string;
  }>;
}

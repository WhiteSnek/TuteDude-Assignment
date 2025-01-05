import React, { createContext, ReactNode, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ProfileType, Recommended, User } from "@/types/user.types";
import { LoginUser } from "@/types/login.types";
import {
  FriendsResponse,
  GetFriendRequest,
  LoginResponse,
  NoData,
  ProfileResponse,
  RecommendedPeople,
} from "@/types/response.types";
import { UserContextType } from "@/types/context.types";
import { FriendRequest } from "@/types/request.types";

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response: AxiosResponse<LoginResponse> = await axios.get(
          "/users/current-user",
          { withCredentials: true }
        );
        if (response && response.data.success) {
          setUser(response.data.data);
        } else {
          throw new Error("No user found");
        }
      } catch (error) {
        setUser(null);
      }
    };

    getCurrentUser();
  }, []);

  const login = async (
    userInfo: LoginUser
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        "/users/login",
        userInfo,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.success) {
        setUser(response.data.data);
        console.log(user);
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      console.log(error);
      return { success: false, error };
    }
  };

    const register = async (formData: FormData): Promise<{success: boolean, message: string}> => {
      try {
        const username = formData.get("username");
        const password = formData.get("password");
        if (typeof username !== "string" || typeof password !== "string") {
          throw new Error("Invalid email or password");
        }
        const userInfo: LoginUser = { username, password };
        const response:AxiosResponse<NoData> = await axios.post(
          "/users/register",
          formData,
          { withCredentials: true }
        );
        if(response.data.success){
          await login(userInfo);
          return { success: true, message: response.data.message };
        }
        return {success: false, message: response.data.message}
      } catch (error: any) {
        return {success: false, message: error}
      }
    };

    const logout = async (): Promise<{success: boolean, message: string}> => {
      try {
        const response: AxiosResponse<NoData> = await axios.post(
          "/users/logout",
          {},
          { withCredentials: true }
        );
        if(response.data.success){
            setUser(null);
            return { success: true, message: "Logged out successfully" };
        }
        else {
            return { success: false, message: response.data.message };
        }
      } catch (error: any) {
        return { success: false, message: error}
      }
    };

  const getFriends = async (): Promise<{
    success: boolean;
    message: User[] | null;
    error?: string;
  }> => {
    try {
      const response: AxiosResponse<FriendsResponse> = await axios.get(
        "/users/friends",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        return { success: true, message: response.data.data, error: "" };
      } else
        return {
          success: false,
          message: null,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, message: null, error };
    }
  };

  const getRecommended = async (): Promise<{
    success: boolean;
    message: Recommended[] | null;
    error?: string;
  }> => {
    try {
      const response: AxiosResponse<RecommendedPeople> = await axios.get(
        "/users/recommended",
        { withCredentials: true }
      );
      if (response.data.success) {
        return { success: true, message: response.data.data, error: "" };
      } else
        return {
          success: false,
          message: null,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, message: null, error };
    }
  };

  const getFriendRequests = async (): Promise<{
    success: boolean;
    message: FriendRequest[] | null;
    error?: string;
  }> => {
    try {
      const response: AxiosResponse<GetFriendRequest> = await axios.get(
        "/users/request",
        { withCredentials: true }
      );
      if (response.data.success) {
        return { success: true, message: response.data.data, error: "" };
      } else
        return {
          success: false,
          message: null,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, message: null, error };
    }
  };

  const sendFriendRequest = async (
    toUserId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const response: AxiosResponse<NoData> = await axios.post(
        "/users/request",
        { toUserId },
        { withCredentials: true }
      );
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else
        return {
          success: false,
          message: response.data.message,
        };
    } catch (error: any) {
      return { success: false, message: error };
    }
  };

  const unFriend = async (
    friendId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: AxiosResponse<NoData> = await axios.post(
        "/users/unfriend",
        { friendId },
        { withCredentials: true }
      );
      if (response.data.success) {
        return { success: true, error: "" };
      } else
        return {
          success: false,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const handleFriendRequest = async (
    requestId: string,
    status: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: AxiosResponse<NoData> = await axios.post(
        "/users/friend-request",
        { requestId, status },
        { withCredentials: true }
      );
      if (response.data.success) {
        return { success: true, error: "" };
      } else
        return {
          success: false,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const searchPeople = async (
    query: string
  ): Promise<{
    success: boolean;
    message: User[] | null;
    error?: string;
  }> => {
    try {
      const response: AxiosResponse<FriendsResponse> = await axios.post(
        "/users/search",
        { query }
      );
      if (response.data.success) {
        return { success: true, message: response.data.data, error: "" };
      } else
        return {
          success: false,
          message: null,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, message: null, error };
    }
  };

  const getUserProfile = async(userId: string): Promise<{ success: boolean; data: ProfileType | null; error?: string }> => {
    try {
      const response:AxiosResponse<ProfileResponse> = await axios.get(`/users/profile/${userId}`);
      console.log(response.data)
      if (response.data.success) {
        return { success: true, data: response.data.data, error: "" };
      } else
        return {
          success: false,
          data: null,
          error: response.data.message,
        };
    } catch (error: any) {
      return { success: false, data: null, error };
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        getFriends,
        getRecommended,
        getFriendRequests,
        unFriend,
        handleFriendRequest,
        sendFriendRequest,
        searchPeople,
        logout,
        register,
        getUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

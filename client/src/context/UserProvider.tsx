import React, { createContext, ReactNode, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Recommended, User } from "@/types/user.types";
import { LoginUser } from "@/types/login.types";
import {
  FriendsResponse,
  GetFriendRequest,
  LoginResponse,
  NoData,
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

  //   const register = async (formData: FormData): Promise<boolean> => {
  //     try {
  //       const email = formData.get("email");
  //       const password = formData.get("password");
  //       if (typeof email !== "string" || typeof password !== "string") {
  //         throw new Error("Invalid email or password");
  //       }
  //       const userInfo: LoginTemplate = { email, password };
  //       await axios.post(
  //         "/users/addUser",
  //         formData,
  //         { withCredentials: true }
  //       );
  //       await login(userInfo);
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   };

  //   const logout = async (): Promise<boolean> => {
  //     try {
  //       const response: AxiosResponse<string> = await axios.post(
  //         "/users/protected/logout",
  //         {},
  //         { withCredentials: true }
  //       );
  //       console.log(response);
  //       setUser(null);
  //       navigate('/login')
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   };

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

  const sendFriendRequest = async (friendId: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const response: AxiosResponse<NoData> = await axios.post(
        "/users/request",
        { friendId },
        { withCredentials: true }
      );
      if (response.data.success) {
        return { success: true, message: response.data.message};
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
        sendFriendRequest
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

import { LoginUser } from "./login.types";
import { User } from "./user.types";

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User| null>>;
  login: (userInfo: LoginUser) => Promise<{success: boolean, error?: string}>;
  
}
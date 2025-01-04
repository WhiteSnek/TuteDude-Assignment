import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  closeDialog: () => void;
  openRegisterDialog: () => void;
}

const Login: React.FC<LoginProps> = ({ closeDialog, openRegisterDialog }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
    navigate("/explore");
    closeDialog();
  };

  return (
    <div className="p-6 flex justify-center items-center rounded-lg">
      <div className="max-w-md w-full">
        <DialogTitle className="text-2xl font-bold text-indigo-800 text-center mb-4">
          Login
        </DialogTitle>
        <DialogDescription className="text-gray-700 text-center mb-6">
          Please enter your username and password to log in.
        </DialogDescription>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-md transition-all duration-200"
              onClick={() => {
                setUsername("");
                closeDialog(); // Close the login dialog
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-800 text-white hover:bg-indigo-900 px-6 py-2 rounded-md transition-all duration-200"
            >
              Login
            </Button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <Button
            type="button"
            className="text-indigo-800 hover:text-indigo-600 bg-transparent hover:bg-transparent shadow-none"
            onClick={() => {
              closeDialog(); 
              openRegisterDialog(); 
            }}
          >
            Don't have an account? Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

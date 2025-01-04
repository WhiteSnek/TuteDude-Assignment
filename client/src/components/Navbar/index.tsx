import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import Search from "./Search";
import Profile from "./Profile";

const Navbar: React.FC = () => {
    const user = {
        name: 'Nikhil',
        avatarUrl: 'https://picsum.photos/200/300',
    }
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-800 text-white">
      <Logo />

      <div className="flex items-center justify-end space-x-4 w-1/2">
        {user ? (
          <>
            <Search />
            <Profile user={user} />
          </>
        ) : (
          <Button className="bg-indigo-600 hover:bg-indigo-700">Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

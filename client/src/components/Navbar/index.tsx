import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import Search from "./Search";
import Profile from "./Profile";

import Login from "./Login";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const user = null;

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-indigo-800 text-white">
        <Logo />

        <div className="flex items-center justify-end space-x-4">
          {user ? (
            <>
              <Search />
              <Profile user={user} />
            </>
          ) : (
            <Button
              onClick={() => setIsLoginOpen(true)}
              className="bg-white text-indigo-800 text-lg hover:bg-zinc-300"
            >
              Login
            </Button>
          )}
        </div>
      </nav>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsLoginOpen(true)} className="hidden">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Login />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;

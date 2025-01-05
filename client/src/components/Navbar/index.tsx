import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import Search from "./Search";
import Profile from "./Profile";

import Login from "./Login";
import Register from "./Register";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/hooks/user.hooks";

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const {user} = useUser()
  // const user = null

  const closeLoginDialog = () => setIsLoginOpen(false);
  const openRegisterDialog = () => setIsRegisterOpen(true);
  const closeRegisterDialog = () => setIsRegisterOpen(false);

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

      {/* Dialog for Login */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsLoginOpen(true)} className="hidden">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Login closeDialog={closeLoginDialog} openRegisterDialog={openRegisterDialog} />
        </DialogContent>
      </Dialog>

      {/* Dialog for Register */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsRegisterOpen(true)} className="hidden">
            Open Register Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Register closeDialog={closeRegisterDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;

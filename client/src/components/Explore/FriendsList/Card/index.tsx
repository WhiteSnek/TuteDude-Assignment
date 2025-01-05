import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user.types";

interface FriendInfoProps {
  user: User;
}

const Card: React.FC<FriendInfoProps> = ({ user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUnfriendClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const handleConfirmUnfriend = () => {
    if (selectedUserId) {
      // onUnfriend(selectedUserId);
      setIsDialogOpen(false);
    }
  };

  const handleCancelUnfriend = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <img
        src={user.avatar}
        alt={user.fullname}
        className="w-14 h-14 rounded-full border-2 border-indigo-600"
      />
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{user.fullname}</span>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => handleUnfriendClick(user._id)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Unfriend
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-lg p-6 shadow-lg">
          <DialogTitle>Confirm Unfriend</DialogTitle>
          <DialogDescription>
            Are you sure you want to unfriend {user.fullname}? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUnfriend}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={handleConfirmUnfriend}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Card;

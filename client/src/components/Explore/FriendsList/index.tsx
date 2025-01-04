import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import Card from "./Card";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface FriendsListProps {
  friends: User[];
//   onUnfriend: (userId: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUnfriendClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const handleConfirmUnfriend = () => {
    if (selectedUserId) {
    //   onUnfriend(selectedUserId);
      setIsDialogOpen(false);
    }
  };

  const handleCancelUnfriend = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-zinc-100 rounded-md p-6 h-full shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-500">You have no friends yet. Start connecting with people!</p>
      ) : (
        <div className="space-y-4">
          {friends.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Card user={user} />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleUnfriendClick(user.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Unfriend
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Confirm Unfriend</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to unfriend {user.name}? This action cannot be undone.
                  </DialogDescription>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelUnfriend}>
                      Cancel
                    </Button>
                    <Button className="bg-red-600 text-white" onClick={handleConfirmUnfriend}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;

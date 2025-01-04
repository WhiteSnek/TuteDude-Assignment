import React from "react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface FriendRequestsProps {
  friendRequests: User[];
  acceptFriendRequest: (userId: string) => void;
  rejectFriendRequest: (userId: string) => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ friendRequests, acceptFriendRequest, rejectFriendRequest }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Friend Requests</h2>
      {friendRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <div className="flex flex-wrap gap-4 ">
          {friendRequests.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg w-full hover:shadow-lg">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => acceptFriendRequest(user.id)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => rejectFriendRequest(user.id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;

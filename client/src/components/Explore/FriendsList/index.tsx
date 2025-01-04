import React from "react";

import Card from "./Card";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface FriendsListProps {
  friends: User[];
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  
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
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;

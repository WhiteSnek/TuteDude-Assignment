import React from "react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface FriendInfoProps {
  user: User;
}

const Card: React.FC<FriendInfoProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-14 h-14 rounded-full border-2 border-indigo-600"
      />
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{user.name}</span>
      </div>
    </div>
  );
};

export default Card;

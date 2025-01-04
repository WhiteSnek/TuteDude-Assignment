import React from "react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface RecommendedPeopleProps {
  recommendedPeople: User[];
  sendFriendRequest: (userId: string) => void;
}

const RecommendedPeople: React.FC<RecommendedPeopleProps> = ({ recommendedPeople, sendFriendRequest }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recommended People</h2>
      <div className="flex flex-wrap gap-4">
        {recommendedPeople.map((user) => (
          <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg w-full sm:w-1/3">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <Button
                onClick={() => sendFriendRequest(user.id)}
                className="mt-2 bg-indigo-800 text-white hover:bg-indigo-900"
              >
                Send Friend Request
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPeople;

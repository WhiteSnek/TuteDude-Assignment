import React from "react";
import RecommendedPeople from "./RecommendedPeople";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";


const Explore: React.FC = () => {
  const sendFriendRequest = (userId: string) => {
    console.log(`Sent friend request to user with id: ${userId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 p-6 gap-8 h-screen">
      <div className="col-span-1 sm:col-span-3 h-full">
        <FriendsList />
      </div>

      <div className="col-span-1 sm:col-span-6">
        <RecommendedPeople sendFriendRequest={sendFriendRequest} />
      </div>

      <div className="col-span-1 sm:col-span-3">
        <FriendRequests />
      </div>
    </div>
  );
};

export default Explore;

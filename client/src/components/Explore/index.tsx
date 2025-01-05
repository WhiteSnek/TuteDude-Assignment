import React, { useState, useEffect } from "react";
import RecommendedPeople from "./RecommendedPeople";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";

interface User {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: string[];
  interests: string[];
}

const Explore: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<User[]>([]);

  useEffect(() => {
    setFriendRequests([
      { id: "4", name: "Chris Green", avatar: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg", mutualFriends: [], interests: [] },
    ]);
  }, []);

  const sendFriendRequest = (userId: string) => {
    console.log(`Sent friend request to user with id: ${userId}`);
  };

  const acceptFriendRequest = (userId: string) => {
    console.log(`Accepted friend request from user with id: ${userId}`);
    const userToAdd = friendRequests.find((user) => user.id === userId);
    if (userToAdd) {
      setFriendRequests(friendRequests.filter((user) => user.id !== userId));
    }
  };

  const rejectFriendRequest = (userId: string) => {
    console.log(`Rejected friend request from user with id: ${userId}`);
    setFriendRequests(friendRequests.filter((user) => user.id !== userId));
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
        <FriendRequests
          friendRequests={friendRequests}
          acceptFriendRequest={acceptFriendRequest}
          rejectFriendRequest={rejectFriendRequest}
        />
      </div>
    </div>
  );
};

export default Explore;

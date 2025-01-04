import React, { useState, useEffect } from "react";
import RecommendedPeople from "./RecommendedPeople";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";

interface User {
    id: string;
    name: string;
    avatar: string;
  }

const Explore: React.FC = () => {
  const [recommendedPeople, setRecommendedPeople] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    // Fetch recommended people, friend requests, and friends list (mock data here)
    setRecommendedPeople([
      { id: "1", name: "John Doe", avatar: "/images/avatar1.jpg" },
      { id: "2", name: "Jane Smith", avatar: "/images/avatar2.jpg" },
      { id: "3", name: "Michael Brown", avatar: "/images/avatar3.jpg" },
    ]);
    setFriendRequests([
      { id: "4", name: "Chris Green", avatar: "/images/avatar4.jpg" },
    ]);
    setFriends([
      { id: "5", name: "Emily White", avatar: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" },
      { id: "5", name: "Emily White", avatar: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" },
      { id: "5", name: "Emily White", avatar: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" },
    ]);
  }, []);

  const sendFriendRequest = (userId: string) => {
    // Send a friend request to the user
    console.log(`Sent friend request to user with id: ${userId}`);
  };

  const acceptFriendRequest = (userId: string) => {
    // Accept the friend request
    console.log(`Accepted friend request from user with id: ${userId}`);
    setFriendRequests(friendRequests.filter((user) => user.id !== userId));
    setFriends([...friends, { id: userId, name: "New Friend", avatar: "/images/avatar.jpg" }]);
  };

  const rejectFriendRequest = (userId: string) => {
    // Reject the friend request
    console.log(`Rejected friend request from user with id: ${userId}`);
    setFriendRequests(friendRequests.filter((user) => user.id !== userId));
  };

  return (
    <div className="grid grid-cols-12 p-6 gap-8 h-screen">
      {/* Friends List (Left) */}
      <div className="col-span-3 h-full">
        <FriendsList friends={friends} />
      </div>

      {/* Explore People (Center) */}
      <div className="col-span-6">
        <RecommendedPeople recommendedPeople={recommendedPeople} sendFriendRequest={sendFriendRequest} />
      </div>

      {/* Friend Requests (Right) */}
      <div className="col-span-3">
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

import React, { useEffect, useState } from "react";

import Card from "./Card";
import { User } from "@/types/user.types";
import { useUser } from "@/hooks/user.hooks";
import { useToast } from "@/hooks/use-toast";

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const { getFriends } = useUser();
  const { toast } = useToast();
  useEffect(() => {
    const getFriendsArray = async () => {
      const response = await getFriends();
      if (response.success) {
        setFriends(response.message);
      } else {
        const errorMessage = typeof response.error === "object" ? JSON.stringify(response.error) : response.error;
        toast({
          variant: "destructive",
          title: errorMessage,
        });
      }
    };
    getFriendsArray();
  }, []);
  return (
    <div className="bg-zinc-100 rounded-md p-6 h-full shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Your Friends
      </h2>
      {!friends || friends.length === 0 ? (
        <p className="text-gray-500">
          You have no friends yet. Start connecting with people!
        </p>
      ) : (
        <div className="space-y-4">
          {friends.map((user) => (
            <div
              key={user._id}
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

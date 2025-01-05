import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user.types";
import { UserPlus } from "lucide-react";
import { useUser } from "@/hooks/user.hooks";
import { useNavigate } from "react-router-dom";

interface SearchDropdownProps {
  results: User[];
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ results }) => {
  const [friendRequestSent, setFriendRequestSent] = useState<string | null>(
    null
  );
  const navigate = useNavigate()
  const { sendFriendRequest } = useUser();
  const handleAddFriend = async (userId: string) => {
    const response = await sendFriendRequest(userId);
    if (response.success) setFriendRequestSent(userId);
    else {
      console.error("Failed to send friend request");
    }
  };
  return (
    <Card className="absolute z-50 top-10 right-20 py-4 w-[200px] md:w-[400px] bg-zinc-300 text-black rounded-lg shadow-lg">
      <CardContent className="space-y-2">
        {results.map((user) => (
          <button
          onClick={()=>navigate(`/profile/${user._id}`)}
            key={user._id}
            className="flex w-full items-center justify-between p-3 rounded-lg hover:bg-zinc-200 transition duration-200"
          >
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.fullname}
                className="w-12 h-12 rounded-full border border-zinc-600"
              />
              <div>
                <p className="text-sm font-medium ">
                  {user.fullname}
                </p>
                <p className="text-xs text-zinc-700">@{user.username}</p>
              </div>
            </div>

            {friendRequestSent === user._id ? (
              <Button
                className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-full"
                disabled
              >
                Friend Request Sent
              </Button>
            ) : (
              <Button
                onClick={() => handleAddFriend(user._id)}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SearchDropdown;

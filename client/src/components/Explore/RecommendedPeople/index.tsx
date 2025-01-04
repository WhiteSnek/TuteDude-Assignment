import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, UserPlus, Info } from "lucide-react"; // Icons for close, add friend, and info
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: string[];
  interests: string[];
}

interface RecommendedPeopleProps {
  recommendedPeople: User[];
  sendFriendRequest: (userId: string) => void;
}

const RecommendedPeople: React.FC<RecommendedPeopleProps> = ({
  recommendedPeople,
  sendFriendRequest,
}) => {
  const [friendRequestSent, setFriendRequestSent] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<User | null>(null);

  const handleAddFriend = (userId: string) => {
    sendFriendRequest(userId);
    setFriendRequestSent(userId);
  };

  const handleDeleteRecommendation = (userId: string) => {
    // deleteRecommendation(userId);
  };

  const handleShowRecommendationReason = (user: User) => {
    setSelectedRecommendation(user);
    setOpenDialog(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended People</h2>
      <div className="space-y-6">
        {recommendedPeople.map((user) => (
          <div
            key={user.id}
            className="relative flex flex-col sm:flex-row items-center gap-4 p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-500"
          >
            <X
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => handleDeleteRecommendation(user.id)}
            />
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex flex-col sm:flex-1">
              <span className="font-semibold text-gray-700">{user.name}</span>
              <span className="text-sm text-gray-500 mt-1">Mutual Friends: {user.mutualFriends.length}</span>
              <Button
                onClick={() => handleShowRecommendationReason(user)}
                variant="link"
                className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                Why Recommended
              </Button>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              {friendRequestSent === user.id ? (
                <Button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-full" disabled>
                  Friend Request Sent
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddFriend(user.id)}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRecommendation && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <DialogTitle className="text-xl font-semibold text-gray-800">Why {selectedRecommendation.name} was recommended?</DialogTitle>
            <DialogDescription className="text-gray-600 mt-3">
              <strong>Interests:</strong> {selectedRecommendation.interests.join(", ")}
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)} className="mt-4 w-full">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RecommendedPeople;

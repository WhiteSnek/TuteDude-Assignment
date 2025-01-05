import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, UserPlus, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Recommended } from "@/types/user.types";
import { useUser } from "@/hooks/user.hooks";

interface RecommendedPeopleProps {
  sendFriendRequest: (userId: string) => void;
}

const RecommendedPeople: React.FC<RecommendedPeopleProps> = ({
  sendFriendRequest,
}) => {
  const [friendRequestSent, setFriendRequestSent] = useState<string | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Recommended | null>(null);
  const [recommendedPeople, setRecommendedPeople] = useState<
    Recommended[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const { getRecommended } = useUser();

  useEffect(() => {
    const fetchRecommendedPeople = async () => {
      setLoading(true);
      try {
        const response = await getRecommended();
        if (response.success) {
          setRecommendedPeople(response.message);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommended people:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedPeople();
  }, []);

  const handleAddFriend = (userId: string) => {
    sendFriendRequest(userId);
    setFriendRequestSent(userId);
  };

  const handleDeleteRecommendation = (userId: string) => {
    setRecommendedPeople((prev) =>
      prev ? prev.filter((user) => user._id !== userId) : null
    );
  };

  const handleShowRecommendationReason = (user: Recommended) => {
    setSelectedRecommendation(user);
    setOpenDialog(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Recommended People
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading recommendations...</p>
      ) : !recommendedPeople || recommendedPeople.length === 0 ? (
        <p className="text-gray-500">
          No people recommended. Try adding someone you know to your network!
        </p>
      ) : (
        <div className="space-y-6">
          {recommendedPeople.map((user) => (
            <div
              key={user._id}
              className="relative flex flex-col sm:flex-row items-center gap-4 p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-500"
            >
              <X
                className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
                aria-label={`Remove ${user.fullname} from recommendations`}
                onClick={() => handleDeleteRecommendation(user._id)}
              />
              <img
                src={user.avatar}
                alt={user.fullname}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col sm:flex-1">
                <span className="font-semibold text-gray-700">
                  {user.fullname}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Mutual Friends: {user.mutualFriends}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Common Interests: {user.commonInterests}
                </span>
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
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecommendation && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Why {selectedRecommendation.fullname} was recommended?
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-3">
              <strong>{selectedRecommendation.reason}</strong>
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="mt-4 w-full"
              >
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

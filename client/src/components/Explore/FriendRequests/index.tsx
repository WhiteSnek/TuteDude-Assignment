import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FriendRequest } from "@/types/request.types";
import { useUser } from "@/hooks/user.hooks";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


const FriendRequests: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[] | null>([]);
  const {getFriendRequests, handleFriendRequest} = useUser();
  const [loading, setLoading] = useState(true);
  const {toast} = useToast()
 useEffect(() => {
     const fetchFriendRequests = async () => {
       setLoading(true);
       try {
         const response = await getFriendRequests();
         if (response.success) {
           setFriendRequests(response.message);
         } else {
           console.error("Failed to fetch recommendations");
         }
       } catch (error) {
         console.error("Error fetching recommended people:", error);
       } finally {
         setLoading(false);
       }
     };
     fetchFriendRequests();
   }, []);



   const acceptFriendRequest = async (requestId: string) => {
      const status = 'accepted';
      const response = await handleFriendRequest(requestId, status);
      if (response.success) {
        toast({
          title: 'Friend request accepted',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Faied to accept friend request!',
        })
      }
   }

   const rejectFriendRequest = async (requestId: string) => {
    const status = 'rejected';
    const response = await handleFriendRequest(requestId, status);
    if (response.success) {
      toast({
        title: 'Friend request rejected',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Faied to reject friend request!',
      })
    }
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Friend Requests</h2>
      {loading ? (
        <p className="text-gray-500">Loading recommendations...</p>
      ) : !friendRequests ||  friendRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <div className="flex flex-wrap gap-4 ">
          {friendRequests.map((friendRequest) => (
            <div key={friendRequest.fromUserDetails._id} className="flex items-center gap-4 p-4 border rounded-lg w-full hover:shadow-lg">
              <img src={friendRequest.fromUserDetails.avatar} alt={friendRequest.fromUserDetails.fullname} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium">{friendRequest.fromUserDetails.fullname}</span>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => acceptFriendRequest(friendRequest._id)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => rejectFriendRequest(friendRequest.fromUserDetails._id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default FriendRequests;

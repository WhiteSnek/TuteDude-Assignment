import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/user.hooks'; 
import { ProfileType } from '@/types/user.types'; 
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

interface ProfileProps {
  userId: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const { user, getUserProfile, sendFriendRequest } = useUser();
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); 
      try {
        const response = await getUserProfile(userId);
        if (response.success) {
          setProfile(response.data);
        } else {
          console.error('Failed to fetch profile', response.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setLoading(false); 
    };
    fetchUserProfile();
  }, [userId, getUserProfile]);

  if (loading || !user) {
    return (
      <div className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto">
        <p>User not found.</p>
      </div>
    );
  }

  const isUser = user?._id === profile._id;

  const handleAddFriend = async (userId: string) => {
    const response = await sendFriendRequest(userId);
    if (response.success) setFriendRequestSent(true);
    else {
      console.error("Failed to send friend request");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto space-y-8">
      <div className="flex items-center mb-6">
        <img
          src={profile.avatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mr-4 border-4 border-gray-200 shadow-lg"
        />
        <div>
          <h2 className="text-4xl font-semibold text-gray-900">{profile.fullname}</h2>
          <p className="text-xl text-gray-600">@{profile.username}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{isUser ? 'Your' : `${profile.fullname}'s`} Friends</h3>
          <div className="grid grid-cols-3 gap-4">
            {!profile.friends || profile.friends.length === 0 ? (
              <p className="text-gray-500">No friends yet.</p>
            ) : (
              profile.friends.map((friend) => (
                <div key={friend._id} className="flex items-center p-4 rounded-lg hover:bg-gray-100 transition ease-in-out duration-200">
                  <img
                    src={friend.avatar}
                    alt={friend.fullname}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <span className="font-semibold">{friend.fullname}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{isUser ? 'Your' : `${profile.fullname}'s`} Interests</h3>
          <div className="flex gap-4 px-4">
            {!profile.interests || profile.interests.length === 0 ? (
              <p className="text-gray-500">No interests listed.</p>
            ) : (
              profile.interests.map((interest, index) => (
                <div key={index} className="text-white px-4 py-2 rounded-full bg-indigo-600">{interest.toUpperCase()}</div>
              ))
            )}
          </div>
        </div>

        <div className="text-center">
          {!isUser && (
            friendRequestSent ? (
              <Button
                className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-full"
                disabled
              >
                Friend Request Sent
              </Button>
            ) : (
              <Button
                onClick={() => handleAddFriend(profile._id)}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

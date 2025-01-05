import React from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user.hooks";
import { useNavigate } from "react-router-dom";

interface DropdownContentProps {
  userId: string;
  closeDropdown: () => void;
}

const DropdownContent: React.FC<DropdownContentProps> = ({ userId, closeDropdown }) => {
  const navigate = useNavigate()
    const {logout} = useUser()
  const handleProfileClick = () => {
    navigate(`/profile/${userId}`)
    closeDropdown(); 
  };

  const handleLogout = async () => {
    const response = await logout()
    if(response.success){
      navigate('/')
      closeDropdown(); 
    }
       
    else console.log('Error logging out')
  };

  return (
    <div className="absolute right-0 mt-2 p-4 bg-indigo-800 border-2 border-white text-white rounded-lg shadow-lg w-48 ">
      <Button
        variant="secondary"
        onClick={handleProfileClick}
        className="w-full text-left p-2 bg-indigo-500 text-white hover:bg-indigo-700 rounded"
      >
        View Profile
      </Button>
      <Button
        variant="secondary"
        onClick={handleLogout}
        className="w-full text-left p-2 bg-indigo-500 text-white hover:bg-indigo-700 rounded mt-2"
      >
        Logout
      </Button>
    </div>
  );
};

export default DropdownContent;

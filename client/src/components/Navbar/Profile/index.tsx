import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user.types";
import DropdownContent from "./DropdownContent";

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Avatar onClick={toggleDropdown}>
        <AvatarImage src={user.avatar} alt={user.fullname} />
        <AvatarFallback>{user.fullname[0]}</AvatarFallback>
      </Avatar>
      {isDropdownOpen && <DropdownContent userId={user._id} closeDropdown={toggleDropdown} />}
    </div>
  );
};

export default Profile;

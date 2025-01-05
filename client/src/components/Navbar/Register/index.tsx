import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUser } from "@/hooks/user.hooks";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  closeDialog: () => void;
}

const Register: React.FC<RegisterProps> = ({ closeDialog }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  const navigate = useNavigate()

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInterest(e.target.value);
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim().toLowerCase())) {
      setInterests((prevInterests) => [...prevInterests, newInterest.trim().toLowerCase()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const {register} = useUser()
  const {toast} = useToast()
  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullname", fullName);
    if (avatar) {
      formData.append("avatar", avatar);
      }
      formData.append("password", password);
      interests.forEach((interest) => {
        formData.append("interests[]", interest); 
      });
    const response = await register(formData);
    if(response.success){
      toast({
        title: "Registration successful",
      })
    } else{
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: response.message,
        })
    }
    navigate('/explore')
    closeDialog()
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <DialogTitle className="text-2xl font-bold text-indigo-800">Register</DialogTitle>
        <DialogDescription className="text-gray-700 mb-4">
          Please enter your details to create an account.
        </DialogDescription>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="avatar">
              Avatar
            </label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full"
            />
            {avatarPreview && (
              <div className="mt-2">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="interests">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-indigo-200 text-indigo-800 py-1 px-3 rounded-full text-sm cursor-pointer"
                  onClick={() => removeInterest(interest)}
                >
                  {interest} <span className="ml-1 text-xs">x</span>
                </span>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                type="text"
                value={newInterest}
                onChange={handleInterestChange}
                placeholder="Add an interest"
                className="w-2/3"
              />
              <Button
                type="button"
                onClick={addInterest}
                className="ml-2 bg-indigo-800 text-white hover:bg-indigo-900"
              >
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-800 text-white hover:bg-indigo-900">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

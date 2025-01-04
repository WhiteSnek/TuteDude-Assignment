import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface RegisterProps{
    closeDialog: () => void;
}

const Register: React.FC<RegisterProps> = ({ closeDialog }: { closeDialog: () => void }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

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

  const handleRegister = () => {
    console.log("Username:", username);
    console.log("Full Name:", fullName);
    console.log("Avatar:", avatar);
    console.log("Password:", password);
    console.log("Interests:", interests);
    // Here, you can send the data to your API or handle registration logic
  };

  return (
    <div className="p-6 flex justify-center items-center">
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
              Avatar URL
            </label>
            <Input
              id="avatar"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Enter your avatar URL"
              className="w-full"
            />
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

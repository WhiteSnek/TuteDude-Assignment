import { Input } from "@/components/ui/input";
import React from "react";

const Search: React.FC = () => {
  return (
    <div className="hidden md:block w-1/2">
      <Input
        type="text"
        placeholder="Search People..."
        className="text-white placeholder:text-white"
      />
    </div>
  );
};

export default Search;

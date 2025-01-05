import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import SearchDropdown from "./SearchDropdown";
import { User } from "@/types/user.types";
import { useUser } from "@/hooks/user.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { searchPeople } = useUser();

  const handleSearch = async () => {
    if (query.trim() === "") {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await searchPeople(query);
      console.log(response)
      if (response.success) {
        setResults(response.message);
      } else {
        setResults(null);
      }
    } catch (error) {
      console.error("Error searching people:", error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative hidden md:block">
      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search People..."
          className="text-white placeholder:text-white"
        />
        <Button onClick={handleSearch} className="bg-blue-600 text-white">
          Search
        </Button>
      </div>
      {loading && (
        <div className="absolute mt-2 w-full flex justify-center">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
      )}
      {query && results && results.length > 0 && !loading && (
        <SearchDropdown results={results} />
      )}
      {query && results?.length === 0 && !loading && (
        <div className="absolute mt-2 w-full bg-zinc-800 text-white p-2 rounded-lg">
          No results found.
        </div>
      )}
    </div>
  );
};

export default Search;

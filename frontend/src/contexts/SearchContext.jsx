import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { FileText } from "lucide-react"; // Assuming FileText is a component

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchType, setSearchType] = useState("document"); // 'document' or 'profile'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // Added searchResults state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { session } = useAuth();

  const isBanglaText = (text) => {
    const banglaRange = /[\u0980-\u09FF]/;
    return banglaRange.test(text);
  };

  const handleSearch = async (query) => {
    const endpoint =
      searchType === "document"
        ? `${import.meta.env.VITE_API_URL}/document/search`
        : `${import.meta.env.VITE_API_URL}/user/search`;

    try {
      const url = new URL(endpoint);
      url.searchParams.append("query", query);
      url.searchParams.append(
        "is-bangla",
        searchType === "document" ? isBanglaText(query) : false
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const data = await response.json();
      setSearchResults(data);
      return data;
    } catch (error) {
      console.error("Search failed:", error);
      throw error;
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchType,
        setSearchType,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        handleSearch,
        isSearchVisible,
        setIsSearchVisible,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

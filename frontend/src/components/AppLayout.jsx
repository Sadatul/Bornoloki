// src/components/Layout/AppLayout.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  LogOut,
  Search,
  Users,
  FileText,
  MessageCircle,
} from "lucide-react";
import DocumentList from "./DocumentList";
import { useTheme } from "@/contexts/ThemeContext";
import { useSearch } from "@/contexts/SearchContext";
import { SearchResults } from "@/components/SearchResults";
import { useNavigate } from "react-router-dom";

const AppLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const { isDark } = useTheme();
  const searchContainerRef = useRef(null);
  const {
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSearchVisible,
    setIsSearchVisible,
  } = useSearch();
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSearchVisible]);

  const handleSearchSubmit = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearching(true);
      try {
        await handleSearch(searchQuery.trim());
        setIsSearchVisible(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setIsSearchVisible(true);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-500 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Top Navigation Bar */}
      <div
        className={`w-full ${isDark ? "bg-slate-800" : "bg-white"} border-b ${
          isDark ? "border-slate-700" : "border-gray-200"
        } px-4 py-2`}
      >
        <div className="w-full mx-auto flex items-center justify-between">
          {/* Logo/Brand */}
          <div
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Bornoloki
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative" ref={searchContainerRef}>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center space-x-2">
                  <Search
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${searchType}s...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  onFocus={handleSearchFocus}
                  className={`w-full h-9 pl-10 pr-24 rounded-md ${
                    isDark
                      ? "bg-slate-700 text-white border-slate-600 placeholder-gray-400"
                      : "bg-gray-100 border-gray-200 placeholder-gray-500"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div className="absolute right-2 flex items-center space-x-1">
                  <button
                    onClick={() => setSearchType("document")}
                    className={`p-1 rounded ${
                      searchType === "document"
                        ? isDark
                          ? "bg-slate-600 text-white"
                          : "bg-gray-200 text-gray-800"
                        : "text-gray-500"
                    }`}
                    title="Search Documents"
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    onClick={() => setSearchType("user")}
                    className={`p-1 rounded ${
                      searchType === "user"
                        ? isDark
                          ? "bg-slate-600 text-white"
                          : "bg-gray-200 text-gray-800"
                        : "text-gray-500"
                    }`}
                    title="Search Users"
                  >
                    <Users size={16} />
                  </button>
                </div>
              </div>
              <SearchResults />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              {user?.user_metadata.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile_pic"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircle
                  size={32}
                  className={isDark ? "text-gray-300" : "text-gray-400"}
                />
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 -ml-2 h-6 text-xs"
                onClick={signOut}
              >
                <LogOut size={14} className="mr-1" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-80 flex flex-col ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          } border-r`}
        >
          {/* Documents List */}
          <div className="flex-1 overflow-y-hidden p-2">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                My Documents
              </h2>
            </div>
            <DocumentList />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
      {/* Floating Chat Button */}
      <Button
        onClick={() => navigate("/chat")}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${
          isDark
            ? "bg-violet-600 hover:bg-violet-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <MessageCircle className="w-8 h-8" />
        <span className="sr-only">Open Chat</span>
      </Button>
    </div>
  );
};

export default AppLayout;

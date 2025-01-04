import { FileText } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDocument } from "@/contexts/DocumentContext";
import { useNavigate } from "react-router-dom";

export function SearchResults() {
  const { searchResults, searchType, isSearchVisible, setIsSearchVisible } = useSearch();
  const { isDark } = useTheme();
  const { fetchDocument } = useDocument();
  const navigate = useNavigate();

  if (!searchResults || !isSearchVisible) return null;

  const handleDocumentClick = async (documentId) => {
    const doc = await fetchDocument(documentId);
    if (doc) {
      setIsSearchVisible(false);
      navigate(`/editor/${documentId}`);
    }
  };

  const handleUserClick = (userId) => {
    setIsSearchVisible(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="absolute top-full left-0 right-0 w-full max-w-2xl mt-2 z-50">
      <div className={`max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg shadow-2xl
        ${isDark 
          ? "bg-slate-900/60 border-slate-700/50" 
          : "bg-white/60 border-white/20"} 
        backdrop-blur-md border backdrop-saturate-150 backdrop-brightness-125`}>
        {searchType === "document" && searchResults.results && (
          <div className="p-4 space-y-4">
            {searchResults.results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleDocumentClick(result.document.id)}
                className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer
                  ${isDark 
                    ? "bg-slate-800/80 hover:bg-slate-800/90 border-slate-700/50" 
                    : "bg-white/80 hover:bg-white/90 border-white/20"}
                  border shadow-lg hover:shadow-xl backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {result.document.title}
                  </h3>
                </div>
                <div className="mt-2 text-sm">
                  <span className={`px-2 py-1 rounded-full
                    ${isDark 
                      ? "bg-blue-500/20 text-blue-300" 
                      : "bg-blue-100 text-blue-800"}`}>
                    Score: {(result.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchType === "user" && Array.isArray(searchResults) && (
          <div className="p-4 space-y-4">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02]
                  ${isDark 
                    ? "bg-slate-800/80 hover:bg-slate-800/90 border-slate-700/50" 
                    : "bg-white/80 hover:bg-white/90 border-white/20"}
                  border shadow-lg hover:shadow-xl backdrop-blur-sm`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full ring-2 ring-offset-2 
                      ${isDark ? 'ring-blue-500/50 ring-offset-slate-800' : 'ring-blue-500/30 ring-offset-white'}"
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {user.name}
                    </h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

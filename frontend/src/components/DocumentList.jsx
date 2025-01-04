import { useNavigate } from "react-router-dom";
import { useDocument } from "@/contexts/DocumentContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FileText, Plus } from "lucide-react";

const DocumentList = () => {
  const navigate = useNavigate();
  const { documents } = useDocument();
  const { isDark } = useTheme();

  return (
    <div
      className={`w-[79] h-full pl-2 ${
        isDark ? "border-slate-700" : "border-gray-200"
      } `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          New Documents
        </h2>
        <button
          onClick={() => navigate("/editor/new")}
          className={`p-1.5 rounded-lg transition-colors
            ${
              isDark
                ? "hover:bg-slate-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => navigate(`/editor/${doc.id}`)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
              ${
                isDark
                  ? "hover:bg-slate-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <FileText size={16} />
            <span className="break-words">{doc.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;

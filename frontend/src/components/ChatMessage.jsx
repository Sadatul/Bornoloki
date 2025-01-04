import { MessageCircle, Bot } from "lucide-react";

export function ChatMessage({ message, isDark }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`p-2 rounded-full ${
          isUser
            ? isDark
              ? "bg-violet-600"
              : "bg-blue-500"
            : isDark
            ? "bg-slate-700"
            : "bg-gray-200"
        }`}
      >
        {isUser ? (
          <MessageCircle className="w-6 h-6 text-white" />
        ) : (
          <Bot
            className={`w-6 h-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          />
        )}
      </div>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? isDark
              ? "bg-violet-600 text-white"
              : "bg-blue-500 text-white"
            : isDark
            ? "bg-slate-700 text-gray-100"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

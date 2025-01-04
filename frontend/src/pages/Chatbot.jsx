import React from "react";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function ChatBot() {
  const { messages, isLoading, sendMessage } = useChat();
  const { isDark } = useTheme();

  return (
    <div
      className={`h-screen flex flex-col ${
        isDark ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <header
        className={`${
          isDark ? "bg-slate-800 shadow-slate-700/20" : "bg-white"
        } shadow-sm`}
      >
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-2">
          <MessageSquare
            className={`w-6 h-6 ${
              isDark ? "text-violet-400" : "text-blue-500"
            }`}
          />
          <h1
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Bangla AI Chat
          </h1>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col overflow-hidden">
        <div className="flex-1 space-y-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              } mt-8`}
            >
              <p>Start a conversation in Bangla or Banglish!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} isDark={isDark} />
            ))
          )}
        </div>

        <div
          className={`fixed bottom-4 left-[60%] transform -translate-x-1/2 w-full max-w-4xl px-4`}
        >
          <div
            className={`${
              isDark ? "bg-slate-800" : "bg-white"
            } p-4 rounded-2xl shadow-lg`}
          >
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading}
              isDark={isDark}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

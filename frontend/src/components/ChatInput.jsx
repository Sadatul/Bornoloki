import React, { useState } from "react";
import { Send } from "lucide-react";

export function ChatInput({ onSend, disabled, isDark }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="Type your message in Bangla or Banglish..."
        className={`flex-1 p-4 rounded-xl border focus:outline-none focus:ring-2 ${
          isDark
            ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-violet-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={`p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark
            ? "bg-violet-600 text-white hover:bg-violet-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        <Send className="w-6 h-6" />
      </button>
    </form>
  );
}

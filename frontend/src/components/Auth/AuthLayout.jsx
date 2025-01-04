import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { FloatingLetters } from "../Animation/FloatingLetters";
import { AnimatedWave } from "@/components/Animation/AnimateWave";

const AuthLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Wave Animation Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <AnimatedWave />
      </div>

      {/* Theme Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={`absolute top-4 right-4 rounded-full z-10 ${
          isDark
            ? "text-yellow-300 hover:text-yellow-200"
            : "text-slate-700 hover:text-slate-900"
        }`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </Button>

      {/* Main Content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2
          className={`mt-6 text-center text-3xl font-extrabold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Sign in to your account
        </h2>
      </div>

      {/* Login Box */}
      <FloatingLetters />
      <div
        className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 ${
          isDark ? "bg-slate-800" : "bg-white border border-gray-200"
        } py-8 px-4 shadow-lg backdrop-blur-sm sm:rounded-lg sm:px-10`}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

import { useDarkMode } from "../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 
                  ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
    >
      <span
        className={`absolute flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300 transform
                    ${isDark ? "translate-x-7 bg-gray-900" : "translate-x-1 bg-white"}`}
      >
        {isDark ? (
          <Moon size={14} className="text-yellow-400" />
        ) : (
          <Sun size={14} className="text-orange-500" />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;

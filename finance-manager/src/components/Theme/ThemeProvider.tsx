"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Palette, Sun, Moon, Sparkles } from "lucide-react";

type Theme = "light" | "dark" | "ocean" | "forest" | "cosmic";
type AnimationLevel = "minimal" | "normal" | "rich";

interface ThemeContextType {
  theme: Theme;
  animationLevel: AnimationLevel;
  setTheme: (theme: Theme) => void;
  setAnimationLevel: (level: AnimationLevel) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [animationLevel, setAnimationLevel] =
    useState<AnimationLevel>("normal");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load theme from localStorage first (for immediate display)
    const savedTheme = localStorage.getItem("finance-theme") as Theme;
    const savedAnimation = localStorage.getItem(
      "finance-animation"
    ) as AnimationLevel;

    if (savedTheme) setTheme(savedTheme);
    if (savedAnimation) setAnimationLevel(savedAnimation);

    // Then sync with database settings
    const syncWithDatabase = async () => {
      try {
        const { getSettings } = await import("@/lib/database");
        const settings = await getSettings();

        if (settings?.theme) {
          let mappedTheme: Theme = "light";

          if (settings.theme === "system") {
            // Detect system preference
            mappedTheme = window.matchMedia("(prefers-color-scheme: dark)")
              .matches
              ? "dark"
              : "light";
          } else {
            // Use the theme as-is from settings
            mappedTheme = settings.theme as Theme;
          }

          // Only update if different from localStorage
          if (!savedTheme || savedTheme !== mappedTheme) {
            setTheme(mappedTheme);
            localStorage.setItem("finance-theme", mappedTheme);
          }
        }
      } catch (error) {
        console.error("Error syncing theme with database:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    syncWithDatabase();
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-animation", animationLevel);

    // Update body class for smooth transitions
    document.body.classList.add("theme-transitioning");

    setTimeout(() => {
      document.body.classList.remove("theme-transitioning");
    }, 300);
  }, [theme, animationLevel]);

  const handleSetTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("finance-theme", newTheme);

    // Also update in database
    try {
      const { getSettings, updateSettings } = await import("@/lib/database");
      const settings = await getSettings();
      if (settings?.id) {
        await updateSettings({ theme: newTheme });
      }
    } catch (error) {
      console.error("Error saving theme to database:", error);
    }
  };

  const handleSetAnimationLevel = (level: AnimationLevel) => {
    setAnimationLevel(level);
    localStorage.setItem("finance-animation", level);
  };

  const isDark =
    theme === "dark" ||
    theme === "ocean" ||
    theme === "forest" ||
    theme === "cosmic";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        animationLevel,
        setTheme: handleSetTheme,
        setAnimationLevel: handleSetAnimationLevel,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeSelector() {
  const { theme, setTheme, animationLevel, setAnimationLevel } = useTheme();

  const themes = [
    {
      id: "light",
      name: "Clair",
      icon: Sun,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: "dark",
      name: "Sombre",
      icon: Moon,
      color: "from-gray-700 to-gray-900",
    },
    {
      id: "ocean",
      name: "Océan",
      icon: Palette,
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "forest",
      name: "Forêt",
      icon: Sparkles,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "cosmic",
      name: "Cosmique",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
    },
  ];

  const animationLevels = [
    { id: "minimal", name: "Minimal", description: "Animations réduites" },
    { id: "normal", name: "Normal", description: "Animations équilibrées" },
    { id: "rich", name: "Riche", description: "Animations complètes" },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.id;

            return (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as any)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? "border-financial-500 bg-financial-50 scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:scale-102"
                  }
                  group overflow-hidden
                `}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${themeOption.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative z-10 text-center">
                  <Icon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      isSelected ? "text-financial-600" : "text-gray-600"
                    }`}
                  />
                  <div
                    className={`text-sm font-medium ${
                      isSelected ? "text-financial-900" : "text-gray-900"
                    }`}
                  >
                    {themeOption.name}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-financial-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation Level */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Niveau d'Animation
        </h3>
        <div className="space-y-2">
          {animationLevels.map((level) => (
            <label
              key={level.id}
              className={`
                flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer
                ${
                  animationLevel === level.id
                    ? "border-financial-500 bg-financial-50"
                    : "border-gray-200 hover:border-gray-300"
                }
                transition-all duration-200
              `}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="animation"
                  value={level.id}
                  checked={animationLevel === level.id}
                  onChange={() => setAnimationLevel(level.id as any)}
                  className="mr-3 text-financial-600"
                />
                <div>
                  <div className="font-medium text-gray-900">{level.name}</div>
                  <div className="text-sm text-gray-600">
                    {level.description}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

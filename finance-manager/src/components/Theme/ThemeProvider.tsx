"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Palette, Sun, Moon, Sparkles } from "lucide-react";

type Theme = "light" | "dark" | "ocean" | "cosmic";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load theme from localStorage first (for immediate display)
    const savedTheme = localStorage.getItem("finance-theme") as Theme;
    if (savedTheme) setTheme(savedTheme);

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

    // Update body class for smooth transitions
    document.body.classList.add("theme-transitioning");

    setTimeout(() => {
      document.body.classList.remove("theme-transitioning");
    }, 300);
  }, [theme]);

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

  const isDark = theme === "dark" || theme === "ocean" || theme === "cosmic";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
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
  const { theme, setTheme } = useTheme();

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
    </div>
  );
}

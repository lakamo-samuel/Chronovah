import { useDarkMode } from "../../hooks/useDarkMode";
import { Database, Moon, Sun, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useStorage } from "../../hooks/useStorage";
import ProgressInput from "./ProgressInput";
import { THEMES, getStoredTheme, setTheme, getThemeColor, type Theme } from "../../lib/theme";

export default function AppearanceStorage() {
  const { toggleDarkMode, isDarkMode } = useDarkMode();
  const { storageUsed, usedValue, max } = useStorage();
  const [currentTheme, setCurrentTheme] = useState<Theme>('ocean');

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setTheme(theme);
  };

  return (
    <div className="bg-default mb-4 rounded-2xl p-5 shadow space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-primary">
        Appearance & Storage
      </h2>

      {/* Dark/Light Mode Toggle */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted">
            Mode: {isDarkMode ? "Dark" : "Light"}
          </span>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 bg-card text-primary border border-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            Toggle
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary">Theme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleThemeChange(theme.name)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                currentTheme === theme.name
                  ? 'border-primary bg-primary/5'
                  : 'border-default hover:border-primary/50'
              }`}
            >
              {/* Color swatch */}
              <div
                className="w-full h-10 rounded-md mb-2 shadow-sm"
                style={{ backgroundColor: getThemeColor(theme.name) }}
              />
              
              {/* Theme name */}
              <p className="text-xs font-medium text-primary text-center">{theme.label}</p>
              <p className="text-xs text-muted text-center">{theme.description}</p>

              {/* Checkmark for active theme */}
              {currentTheme === theme.name && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Storage Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Database size={16} className="text-muted" />
          <span className="text-muted">Storage Used</span>
          <span className="ml-auto font-medium text-primary">{storageUsed}</span>
        </div>
        <ProgressInput min={0} max={max} value={usedValue} onChange={() => {}} />
      </div>
    </div>
  );
}



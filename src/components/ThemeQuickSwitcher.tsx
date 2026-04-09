import { useEffect, useRef, useState } from 'react';
import { Palette, X } from 'lucide-react';
import { THEMES, getStoredTheme, setTheme, getThemeColor, type Theme } from '../lib/theme';

export default function ThemeQuickSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('ocean');
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
  }, []);

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-8 right-5 z-40 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center"
        aria-label="Open theme switcher"
      >
        <Palette size={22} />
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-32 md:bottom-24 right-5 z-50 bg-default border border-default rounded-xl shadow-xl p-4 w-56 animate-scale-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-primary">Themes</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-card rounded transition-colors"
              aria-label="Close theme switcher"
            >
              <X size={16} className="text-muted" />
            </button>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`relative p-2 rounded-lg border-2 transition-all text-center ${
                  currentTheme === theme.name
                    ? 'border-primary bg-primary/5'
                    : 'border-default hover:border-primary/50'
                }`}
                title={theme.label}
              >
                {/* Color swatch */}
                <div
                  className="w-full h-6 rounded-md mb-1.5"
                  style={{ backgroundColor: getThemeColor(theme.name) }}
                />

                {/* Theme name */}
                <p className="text-xs font-medium text-primary">{theme.label}</p>

                {/* Checkmark for active theme */}
                {currentTheme === theme.name && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full border border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Tip for keyboard users */}
          <p className="text-xs text-muted mt-3 px-1">Press Esc to close</p>
        </div>
      )}
    </>
  );
}

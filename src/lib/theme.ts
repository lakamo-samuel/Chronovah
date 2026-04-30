/**
 * Theme Management System
 * Manages theme selection and persistence via localStorage
 * Supports 6 themes: ocean, midnight, forest, sunset, rose, slate
 */

export type Theme = 'ocean' | 'midnight' | 'forest' | 'sunset' | 'rose' | 'slate';

const THEME_KEY = 'chronovah-theme';

export const THEMES: { name: Theme; label: string; description?: string }[] = [
  { name: 'ocean', label: 'Ocean', description: 'Blue (default)' },
  { name: 'midnight', label: 'Midnight', description: 'Indigo' },
  { name: 'forest', label: 'Forest', description: 'Emerald' },
  { name: 'sunset', label: 'Sunset', description: 'Orange' },
  { name: 'rose', label: 'Rose', description: 'Rose Red' },
  { name: 'slate', label: 'Slate', description: 'Neutral Gray' },
];

/**
 * Get the currently stored theme from localStorage
 * Defaults to 'ocean' if not found
 */
export function getStoredTheme(): Theme {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme && isValidTheme(theme)) {
      return theme as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return 'ocean';
}

/**
 * Check if a string is a valid theme name
 */
function isValidTheme(value: unknown): value is Theme {
  return (
    typeof value === 'string' &&
    ['ocean', 'midnight', 'forest', 'sunset', 'rose', 'slate'].includes(value)
  );
}

/**
 * Apply a theme by setting the appropriate class on the document root
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  // Remove all theme classes except current
  root.classList.remove(
    'theme-midnight',
    'theme-forest',
    'theme-sunset',
    'theme-rose',
    'theme-slate'
  );

  // Add theme class if not ocean (ocean is the default)
  if (theme !== 'ocean') {
    root.classList.add(`theme-${theme}`);
  }
}

/**
 * Set a theme, save to localStorage, and apply it
 */
export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
    // Still apply the theme even if localStorage fails
    applyTheme(theme);
  }
}

/**
 * Get the color value for a specific theme at a specific shade
 * Useful for displaying theme previews
 */
export function getThemeColor(theme: Theme, shade: 500 | 600 = 500): string {
  const colors: Record<Theme, Record<number, string>> = {
    ocean: {
      500: '#3b82f6',
      600: '#2563eb',
    },
    midnight: {
      500: '#6366f1',
      600: '#4f46e5',
    },
    forest: {
      500: '#22c55e',
      600: '#16a34a',
    },
    sunset: {
      500: '#ea580c',
      600: '#c2410c',
    },
    rose: {
      500: '#ec4899',
      600: '#db2777',
    },
    slate: {
      500: '#64748b',
      600: '#475569',
    },
  };

  return colors[theme][shade] || colors.ocean[shade];
}

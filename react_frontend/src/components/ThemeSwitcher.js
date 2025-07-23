import React from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * PUBLIC_INTERFACE
 * ThemeSwitcher toggles between light/dark UI themes.
 * @param {string} theme - active theme
 * @param {function} toggleTheme - toggle function
 */
function ThemeSwitcher({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-secondary)] text-[var(--button-text)] flex items-center gap-2"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} aria-hidden="true" /> Dark
        </>
      ) : (
        <>
          <Sun size={16} aria-hidden="true" /> Light
        </>
      )}
    </button>
  );
}
export default ThemeSwitcher;

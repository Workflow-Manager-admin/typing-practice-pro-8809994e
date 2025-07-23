import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ThemeSwitcher toggles between light/dark UI themes.
 * @param {string} theme - active theme
 * @param {function} toggleTheme - toggle function
 */
function ThemeSwitcher({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-secondary)] text-[var(--button-text)]"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
export default ThemeSwitcher;

import React, { useState, useEffect } from 'react';
import './App.css';
import TypingTest from './components/TypingTest';
import ThemeSwitcher from './components/ThemeSwitcher';
import SettingsModal from './components/SettingsModal';
import StatsBar from './components/StatsBar';
import OnScreenKeyboard from './components/OnScreenKeyboard';

function App() {
  const [theme, setTheme] = useState('light');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const openSettings = () => setSettingsOpen(true);

  // PUBLIC_INTERFACE
  const closeSettings = () => setSettingsOpen(false);

  return (
    <div className="App min-h-screen flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
      <header className="w-full flex items-center justify-between px-4 py-2 bg-[var(--bg-secondary)] border-b-[1px] border-[var(--border-color)] shadow-sm fixed z-20 top-0 left-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--text-primary)] text-lg select-none" aria-label="Typing Practice App">⌨️ Typing Practice</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <button
            className="rounded-md px-3 py-1 text-[var(--bg-primary)] bg-[var(--text-secondary)] font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-secondary)]"
            onClick={openSettings}
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-8 px-4 transition-colors duration-300">
        <StatsBar />
        <TypingTest />
      </main>
      <footer className="w-full text-center py-2 text-xs text-[var(--text-secondary)]">
        © {new Date().getFullYear()} Typing Practice | Built with React
      </footer>
      <SettingsModal open={settingsOpen} onClose={closeSettings} theme={theme} setTheme={setTheme} />
      <OnScreenKeyboard />
    </div>
  );
}

export default App;

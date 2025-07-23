import React, { useState, useEffect } from 'react';
import './App.css';
import TypingTest from './components/TypingTest';
import ThemeSwitcher from './components/ThemeSwitcher';
import StatsBar from './components/StatsBar';
import OnScreenKeyboard from './components/OnScreenKeyboard';
import SettingsPanel from './components/SettingsPanel';
import { Keyboard, Settings, SquareUser, Type as TypeIcon } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState('light');
  // For the sidebar, settingsOpen is not needed

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App min-h-screen bg-[var(--bg-primary)] flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar settings panel: always visible for configuration */}
      <aside className="settings-sidebar w-full md:w-72 bg-[var(--bg-secondary)] border-r-[1px] border-[var(--border-color)] flex flex-col justify-between min-h-screen shadow-lg fixed md:static left-0 top-0 z-30">
        <div>
          <div className="flex items-center gap-2 px-5 pt-5 pb-2">
            <TypeIcon size={28} strokeWidth={2.4} className="text-[var(--text-secondary)]" /> 
            <span className="font-extrabold text-xl text-[var(--text-primary)] leading-tight select-none" aria-label="Typing Practice App">
              Typing Practice
            </span>
          </div>
          <div className="px-5 pb-3">
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Welcome to Typing Practice! Use this panel to customize your typing experience in real time.
            </p>
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          </div>
          <SettingsPanel theme={theme} setTheme={setTheme} />
        </div>
        <div className="px-5 pb-6 pt-2 text-xs text-[var(--text-secondary)] flex items-center gap-2 border-t border-[var(--border-color)]">
          <Keyboard size={17} />
          <span>
            Powered by React. Accessible, responsive, and minimal.
          </span>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-72 transition-all duration-300">
        <header className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)] border-b-[1px] border-[var(--border-color)] shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SquareUser size={22} strokeWidth={2.1} className="text-[var(--text-primary)]" />
            <span className="font-medium text-sm md:text-lg select-none" aria-label="Typing Practice">
              Practice Session
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* ThemeSwitcher is now only in sidebar */}
            <Settings size={20} className="text-[var(--text-secondary)] opacity-70 pointer-events-none" />
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center pt-8 pb-8 px-2 md:px-8 transition-colors duration-300">
          <div className="w-full max-w-xl mx-auto mb-6 text-base text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-xl p-5 shadow font-sans">
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <TypeIcon size={21} strokeWidth={2.1} className="inline text-[var(--text-secondary)]" />
              Typing Practice Test
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Start typing the prompt below as accurately and quickly as you can. Your progress, speed, and accuracy will update in real time. Adjust timer, difficulty, or theme at any moment using the sidebar panel.
            </p>
          </div>
          <StatsBar />
          <TypingTest />
        </main>
        <footer className="w-full text-center py-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
          © {new Date().getFullYear()} Typing Practice | Built with React
        </footer>
        <OnScreenKeyboard />
      </div>
    </div>
  );
}

export default App;

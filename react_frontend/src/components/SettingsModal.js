import React, { useContext, useState } from 'react';
import { TypingTestContext } from './TypingTestContext';

const TIMER_OPTIONS = [15, 30, 60, 120];
const CATEGORIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Technical', value: 'technical' },
  { label: 'Random', value: 'random' },
];

/**
 * PUBLIC_INTERFACE
 * SettingsModal enables user to configure timer, category, modes, theme.
 */
function SettingsModal({ open, onClose, theme, setTheme }) {
  const ctx = useContext(TypingTestContext) || {};

  // These are provided by TypingTestContext if in test area; otherwise pass dummy setters.
  const {
    settings = {
      caseSensitive: false,
      setCaseSensitive: () => {},
      strictMode: false,
      setStrictMode: () => {},
      wordBankCategory: 'easy',
      setWordBankCategory: () => {},
      timerLength: 60,
      setTimerLength: () => {},
    }
  } = ctx;

  // Trap focus on modal open - Hook must always execute
  React.useEffect(() => {
    function handler(e) {
      if (open && e.key === 'Escape') onClose();
    }
    if (open) {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
    // If not open, do nothing special on cleanup
    return undefined;
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      data-testid="settings-modal"
    >
      <div className="w-full max-w-md bg-[var(--bg-primary)] rounded-xl p-6 shadow-lg border border-[var(--border-color)] relative animate-fade-down">
        <button
          className="absolute top-3 right-3 text-[var(--text-secondary)] hover:bg-[var(--border-color)] rounded-full p-1"
          aria-label="Close settings"
          onClick={onClose}
        >✖</button>
        <h2 className="text-lg font-bold mb-4" id="settings-title">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Timer Length</label>
            <div className="flex gap-2">
              {TIMER_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`px-3 py-1 rounded ${settings.timerLength === opt ? 'bg-[var(--button-bg)] text-[var(--button-text)]' : 'bg-[var(--border-color)] text-[var(--text-primary)]'}`}
                  onClick={() => settings.setTimerLength(opt)}
                  aria-pressed={settings.timerLength === opt}
                >
                  {opt}s
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Word Bank Category</label>
            <select
              className="w-full mt-1 rounded bg-[var(--bg-secondary)] border-[var(--border-color)] border px-2 py-1"
              value={settings.wordBankCategory}
              onChange={e => settings.setWordBankCategory(e.target.value)}
              aria-label="Word bank category"
            >
              {CATEGORIES.map(c => (
                <option value={c.value} key={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.caseSensitive}
                onChange={e => settings.setCaseSensitive(e.target.checked)}
                aria-checked={settings.caseSensitive}
                className="accent-[var(--button-bg)]"
              />
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.strictMode}
                onChange={e => settings.setStrictMode(e.target.checked)}
                aria-checked={settings.strictMode}
                className="accent-[var(--button-bg)]"
              />
              <span>Strict Mode</span>
            </label>
          </div>
          <div>
            <label className="block font-medium mb-1">Theme</label>
            <select
              className="w-full mt-1 rounded bg-[var(--bg-secondary)] border-[var(--border-color)] border px-2 py-1"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              aria-label="Theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold rounded bg-[var(--button-bg)] text-[var(--button-text)]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;

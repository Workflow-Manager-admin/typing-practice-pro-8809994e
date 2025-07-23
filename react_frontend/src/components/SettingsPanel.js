import React, { useContext } from 'react';
import { TypingTestContext } from './TypingTestContext';
import { Timer, Layers, CheckSquare, CaseSensitive, Paintbrush, Settings } from 'lucide-react';

const TIMER_OPTIONS = [15, 30, 60, 120];
const CATEGORIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Technical', value: 'technical' },
  { label: 'Random', value: 'random' },
];

const THEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" }
];

/**
 * PUBLIC_INTERFACE
 * SettingsPanel is an always-visible sidebar for configuration (theme, timer, category, strict, case etc).
 */
function SettingsPanel({ theme, setTheme }) {
  const ctx = useContext(TypingTestContext) || {};
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

  return (
    <section className="px-5 pb-2 flex flex-col gap-5 text-[var(--text-primary)] w-full" aria-label="Settings panel">
      <div className="mb-1 flex items-center gap-2 text-[var(--text-secondary)] font-bold">
        <Settings size={19} />
        <span className="text-lg">Configuration</span>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
        Modify your typing environment to suit your needs. Settings update instantly and apply to all typing sessions.
      </p>
      {/* Timer */}
      <div>
        <label className="flex items-center gap-2 font-semibold mb-1">
          <Timer size={15} /> Timer Length
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
          {TIMER_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`px-3 py-1 rounded ${
                settings.timerLength === opt
                  ? 'bg-[var(--button-bg)] text-[var(--button-text)]'
                  : 'bg-[var(--border-color)] text-[var(--text-primary)]'
              }`}
              onClick={() => settings.setTimerLength(opt)}
              aria-pressed={settings.timerLength === opt}
            >
              {opt}s
            </button>
          ))}
        </div>
      </div>
      {/* Category */}
      <div>
        <label className="flex items-center gap-2 font-semibold mb-1">
          <Layers size={15} /> Word Bank Category
        </label>
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
      {/* Toggles */}
      <div className="flex items-center gap-5 mt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <CaseSensitive size={15} aria-hidden="true" />
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
          <CheckSquare size={15} aria-hidden="true" />
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
      {/* Theme */}
      <div>
        <label className="flex items-center gap-2 font-semibold mb-1">
          <Paintbrush size={15} /> Theme
        </label>
        <select
          className="w-full mt-1 rounded bg-[var(--bg-secondary)] border-[var(--border-color)] border px-2 py-1"
          value={theme}
          onChange={e => setTheme(e.target.value)}
          aria-label="Theme"
        >
          {THEME_OPTIONS.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="h-4" />
    </section>
  );
}

export default SettingsPanel;

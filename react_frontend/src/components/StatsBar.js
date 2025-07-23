import React, { useContext } from 'react';
import { TypingTestContext } from './TypingTestContext';
import {
  Timer as TimerIcon,
  Layers as LayersIcon,
  PlayCircle as PlayCircleIcon,
  Zap as ZapIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-react';

/**
 * PUBLIC_INTERFACE
 * StatsBar component displays live typing statistics:
 * WPM, accuracy, timer, wordbank info, and test mode indicators.
 *
 * This version robustly handles the case where TypingTestContext is undefined or partially missing.
 */
function StatsBar() {
  // Attempt to get context, or fall back to safe defaults
  const ctx = useContext(TypingTestContext);

  // Provide fallbacks for all values
  const stats = (ctx && ctx.stats) || { wpm: 0, accuracy: 100, timer: 0, totalChars: 0, charsTyped: 0 };
  const settings = (ctx && ctx.settings) || {
    caseSensitive: false,
    strictMode: false,
    wordBankCategory: 'easy',
    timerLength: 60,
  };
  const isRunning = (ctx && typeof ctx.isRunning === 'boolean') ? ctx.isRunning : false;

  // If even these are missing, render minimal placeholder (should not happen, but double-safeguard)
  if (!ctx) {
    // Optionally render a visible warning for devs
    return (
      <div
        className="w-full max-w-2xl mx-auto flex items-center justify-center gap-3 p-3 mb-4 bg-[var(--bg-secondary)] rounded-xl shadow transition-all"
        aria-label="Typing statistics"
        style={{ color: 'red', fontStyle: 'italic', opacity: 0.6 }}
      >
        StatsBar: No TypingTestContext provider found.
      </div>
    );
  }

  // Use Lucide icons and provide layout/UX explanation text
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 p-3 mb-4 bg-[var(--bg-secondary)] rounded-xl shadow transition-all"
         aria-label="Typing statistics">
      <div className="w-full mb-2 px-2 text-xs text-[var(--text-secondary)]">
        Your live typing progress, speed, and accuracy are shown here.
      </div>
      <div className="flex items-center gap-6">
        <span className="text-base md:text-lg font-mono flex items-center gap-1">
          <TimerIcon size={14} /> {settings.timerLength}s
        </span>
        <span className="text-base md:text-lg font-mono flex items-center gap-1">
          <LayersIcon size={14} /> {settings.wordBankCategory}
        </span>
        <span className="text-base md:text-lg font-mono flex items-center gap-1"
              style={{ color: isRunning ? '#2563EB' : '#64748B' }}>
          <PlayCircleIcon size={15} /> {isRunning ? 'Running' : 'Paused'}
        </span>
      </div>
      <div className="flex items-center gap-6 font-mono">
        <span className="text-lg flex items-center gap-1">
          <ZapIcon size={15} /> WPM: <strong>{stats.wpm}</strong>
        </span>
        <span className="text-lg flex items-center gap-1">
          <CheckCircleIcon size={15} /> Accuracy: <strong>{stats.accuracy}%</strong>
        </span>
        <span className="text-xs text-[var(--text-secondary)] ml-4">
          <span className="px-2 py-1 rounded bg-[var(--border-color)] mr-1">{settings.caseSensitive ? 'Case' : 'No case'}</span>
          <span className="px-2 py-1 rounded bg-[var(--border-color)]">{settings.strictMode ? 'Strict' : 'Easy'}</span>
        </span>
      </div>
    </div>
  );
}

export default StatsBar;

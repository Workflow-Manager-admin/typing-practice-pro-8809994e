import React, { useContext } from 'react';
import { TypingTestContext } from './TypingTestContext';

/**
 * PUBLIC_INTERFACE
 * StatsBar component displays live typing statistics:
 * WPM, accuracy, timer, wordbank info, and test mode indicators.
 */
function StatsBar() {
  const {
    stats: { wpm, accuracy, timer, totalChars, charsTyped },
    settings: { caseSensitive, strictMode, wordBankCategory, timerLength },
    isRunning
  } = useContext(TypingTestContext);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 p-3 mb-4 bg-[var(--bg-secondary)] rounded-xl shadow transition-all"
         aria-label="Typing statistics">
      <div className="flex items-center gap-6">
        <span className="text-base md:text-lg font-mono">
          <span role="img" aria-label="timer">⏱️</span> {timerLength}s
        </span>
        <span className="text-base md:text-lg font-mono">
          <span role="img" aria-label="category">🗂️</span> {wordBankCategory}
        </span>
        <span className="text-base md:text-lg font-mono"
              style={{ color: isRunning ? '#2563EB' : '#64748B' }}>
          <span role="img" aria-label="test running">🟢</span> {isRunning ? 'Running' : 'Paused'}
        </span>
      </div>
      <div className="flex items-center gap-6 font-mono">
        <span className="text-lg">
          <span role="img" aria-label="speed">🔤</span> WPM: <strong>{wpm}</strong>
        </span>
        <span className="text-lg">
          <span role="img" aria-label="accuracy">✅</span> Accuracy: <strong>{accuracy}%</strong>
        </span>
        <span className="text-xs text-[var(--text-secondary)] ml-4">
          <span className="px-2 py-1 rounded bg-[var(--border-color)] mr-1">{caseSensitive ? 'Case' : 'No case'}</span>
          <span className="px-2 py-1 rounded bg-[var(--border-color)]">{strictMode ? 'Strict' : 'Easy'}</span>
        </span>
      </div>
    </div>
  );
}

export default StatsBar;

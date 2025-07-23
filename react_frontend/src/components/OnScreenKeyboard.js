import React, { useEffect, useState, useContext } from 'react';
import { TypingTestContext } from './TypingTestContext';

/**
 * PUBLIC_INTERFACE
 * OnScreenKeyboard displays a keyboard visualization, highlighting current/next char.
 */
function OnScreenKeyboard() {
  const [pressedKey, setPressedKey] = useState(null);
  const ctx = useContext(TypingTestContext) || {};
  const { prompt = '', typed = '' } = ctx;

  // Listen for real typing
  useEffect(() => {
    function down(e) { setPressedKey(e.key); }
    function up() { setPressedKey(null); }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Next key to type
  const nextChar = prompt?.[typed?.length] || '';

  // Simple QWERTY rows, add your own keys here
  const rows = [
    `1234567890-=`.split(''),
    `qwertyuiop[]\\`.split(''),
    `asdfghjkl;'`.split(''),
    `zxcvbnm,./`.split(''),
  ];

  // Helper to check highlight
  function isHighlight(key) {
    // Highlight either pressed key, or nextChar (case-insensitive)
    if (!nextChar || key.length !== 1) return false;
    return nextChar.toLowerCase() === key.toLowerCase();
  }

  return (
    <nav className="w-full max-w-2xl mx-auto mt-6 mb-2 flex flex-col items-center transition-all"
         aria-label="On-screen keyboard for visualization">
      {rows.map((row, ridx) => (
        <div key={ridx} className="flex gap-1 justify-center mb-1">
          {row.map((key) => {
            const highlight = isHighlight(key);
            const pressed = pressedKey?.toLowerCase() === key.toLowerCase();
            return (
              <kbd
                key={key}
                className={`w-8 h-8 flex items-center justify-center border border-[var(--border-color)] rounded text-base font-mono bg-[var(--bg-secondary)] transition-colors 
                  ${highlight ? 'bg-[var(--text-secondary)] text-[var(--bg-primary)] font-extrabold' : ''} 
                  ${pressed ? 'ring-2 ring-[var(--button-bg)]' : ''} select-none`}
                aria-label={key}
              >
                {key}
              </kbd>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
export default OnScreenKeyboard;

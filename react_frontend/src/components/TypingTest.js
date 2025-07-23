import React, { useState, useEffect, useRef } from 'react';
import { TypingTestContext } from './TypingTestContext';
import { wordBanks, getRandomPrompt } from '../utils/wordBanks';

/**
 * PUBLIC_INTERFACE
 * TypingTest is the main interactive component for typing practice.
 * Displays prompt, tracks input, calculates real-time stats and handles all typing logic.
 */
function TypingTest() {
  // Settings state
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [wordBankCategory, setWordBankCategory] = useState('easy');
  const [timerLength, setTimerLength] = useState(60);

  // Test state
  const [prompt, setPrompt] = useState(getRandomPrompt(wordBankCategory));
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(timerLength);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // For smooth focus management
  const inputRef = useRef();

  // Timer effect: countdown from timerLength
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    if (timer === 0 && isRunning) {
      finishTest();
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // On category or length change, reset test
  useEffect(() => {
    resetTest();
    // eslint-disable-next-line
  }, [wordBankCategory, timerLength]);

  // Accuracy and WPM update
  useEffect(() => {
    if (!isRunning || !startTime) return;
    const correctChars = countCorrectChars(typed, prompt, caseSensitive);
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const wpmCalc = elapsed > 0 ? Math.round((typed.length / 5) / elapsed) : 0;
    const accuracyCalc = typed.length > 0 ? Math.max(0, Math.round((correctChars / typed.length) * 100)) : 100;
    setWpm(wpmCalc);
    setAccuracy(accuracyCalc);
    // eslint-disable-next-line
  }, [typed, startTime, caseSensitive, prompt, isRunning]);

  // Input handler
  const handleInputChange = (e) => {
    let val = e.target.value;
    // Block pasting
    if (e.nativeEvent.inputType === 'insertFromPaste') return;

    // Prevent typing over the prompt
    if (val.length > prompt.length) return;

    // Start timer on first input
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now());
    }
    // Strict mode: only allow correct next char
    if (strictMode && val.length > 0) {
      const nextChar = prompt[val.length - 1];
      const inputChar = val[val.length - 1];
      if (inputChar !== undefined && (!charEqual(inputChar, nextChar, caseSensitive))) {
        setErrors(e => e + 1);
        return; // ignore wrong char
      }
    }
    setTyped(val);
    // Mark error if non-strict and wrong char
    if (!strictMode && val.length > 0) {
      const i = val.length - 1;
      if (!charEqual(val[i], prompt[i], caseSensitive)) {
        setErrors(e => e + 1);
      }
    }
    // Test done if user types exactly the prompt
    if (val === prompt) {
      finishTest();
    }
  };

  // End of test logic
  const finishTest = () => {
    setIsRunning(false);
    setShowResults(true);
  };

  // Reset test
  const resetTest = () => {
    setPrompt(getRandomPrompt(wordBankCategory));
    setTyped('');
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    setTimer(timerLength);
    setIsRunning(false);
    setShowResults(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Helpers
  function charEqual(a, b, caseSensitive) {
    return caseSensitive ? a === b : a?.toLowerCase() === b?.toLowerCase();
  }
  function countCorrectChars(input, expected, caseSensitive) {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
      if (charEqual(input[i], expected[i], caseSensitive)) {
        count++;
      }
    }
    return count;
  }

  // Handle excessive backspace: allow, but do not decrement errors, just prevent negative progress
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // keep focus in input
    }
  };

  // Settings for context
  const settings = {
    caseSensitive, strictMode, wordBankCategory, timerLength,
    setCaseSensitive, setStrictMode, setWordBankCategory, setTimerLength,
  };

  // Stats for context
  const stats = {
    wpm, accuracy, timer, errors, totalChars: prompt.length, charsTyped: typed.length,
  };

  return (
    <TypingTestContext.Provider value={{
      stats, settings, isRunning, prompt, typed, errors,
      setTyped, setPrompt, resetTest
    }}>
      <section className="w-full max-w-xl mx-auto flex flex-col gap-4 items-center justify-center"
               aria-label="Typing practice area">
        {showResults &&
          <TestResults
            wpm={wpm}
            accuracy={accuracy}
            timerLength={timerLength}
            errors={errors}
            onRestart={resetTest}
          />
        }
        {!showResults &&
          <>
            <PromptDisplay prompt={prompt} input={typed} caseSensitive={caseSensitive} />
            <input
              ref={inputRef}
              className="w-full md:w-3/4 border-b-2 border-[var(--border-color)] text-xl md:text-2xl outline-none focus:border-[var(--text-secondary)] bg-transparent px-2 py-2 mt-2 font-mono transition-shadow"
              type="text"
              spellCheck={false}
              aria-label="Typing test input"
              aria-describedby="prompt-desc"
              autoComplete="off"
              value={typed}
              maxLength={prompt.length}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={timer === 0}
              style={{caretColor: "var(--text-secondary)"}}
              autoFocus
              tabIndex={0}
            />
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <button
                className="px-3 py-1 bg-[var(--button-bg)] text-[var(--button-text)] rounded-md font-medium shadow"
                onClick={resetTest}>
                Restart
              </button>
            </div>
          </>
        }
      </section>
    </TypingTestContext.Provider>
  );
}

// Text display with colored cues
function PromptDisplay({ prompt, input, caseSensitive }) {
  return (
    <div
      id="prompt-desc"
      className="w-full bg-[var(--bg-secondary)] p-3 rounded-lg text-lg font-mono whitespace-pre-wrap text-left selection:bg-[var(--text-secondary)]"
      tabIndex={-1}
      aria-label="Prompt for typing"
      aria-live="polite"
    >
      {prompt.split('').map((ch, idx) => {
        let className = '';
        if (input[idx] === undefined) className = '';
        else if (input[idx] === ch || (!caseSensitive && input[idx]?.toLowerCase() === ch?.toLowerCase()))
          className = 'text-green-600 font-bold';
        else
          className = 'text-red-500 underline';
        return (
          <span key={idx} className={className} aria-live="off">{ch}</span>
        );
      })}
    </div>
  );
}

// Final results
function TestResults({ wpm, accuracy, timerLength, errors, onRestart }) {
  return (
    <div
      className="w-full bg-[var(--bg-secondary)] p-4 rounded shadow flex flex-col items-center animate-fade-down"
      tabIndex={0}
      aria-label="Test results"
    >
      <h2 className="text-xl font-bold mb-2">Results</h2>
      <div className="flex gap-6 text-lg font-mono mb-2">
        <span><span role="img" aria-label="stopwatch">⏲️</span> {timerLength}s</span>
        <span><span role="img" aria-label="speed">🔤</span> WPM: <strong>{wpm}</strong></span>
        <span><span role="img" aria-label="accuracy">✅</span> {accuracy}%</span>
        <span><span role="img" aria-label="errors">❌</span> {errors} mistakes</span>
      </div>
      <button
        onClick={onRestart}
        className="mt-2 px-4 py-2 rounded bg-[var(--button-bg)] text-[var(--button-text)] font-semibold transition-shadow hover:shadow-lg"
        aria-label="Restart typing test">
        Restart Test
      </button>
    </div>
  );
}

export default TypingTest;

import React, { useState, useEffect, useRef } from "react";
import { TypingTestContext } from "./TypingTestContext";
import { wordBanks, getRandomPrompt } from "../utils/wordBanks";
import Confetti from "react-confetti";
import useWindowSize from "../utils/useWindowSize";
/**
 * PUBLIC_INTERFACE
 * TypingTest is the main interactive component for typing practice.
 * Displays prompt, tracks input, calculates real-time stats and handles all typing logic.
 */
function TypingTest() {
  // Settings state
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [wordBankCategory, setWordBankCategory] = useState("easy");
  const [timerLength, setTimerLength] = useState(60);

  // Test state
  const [prompt, setPrompt] = useState(getRandomPrompt(wordBankCategory));
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(timerLength);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // For confetti animation on finish
  const [confettiActive, setConfettiActive] = useState(false);
  // Get dimensions for Confetti
  const { width, height } = useWindowSize();
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
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 2200);
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
    <TypingTestContext.Provider
      value={{
        stats,
        settings,
        isRunning,
        prompt,
        typed,
        errors,
        setTyped,
        setPrompt,
        resetTest,
      }}
    >
      <section
        className="w-full max-w-xl mx-auto flex flex-col gap-4 items-center justify-center"
        aria-label="Typing practice area"
        style={{ position: "relative" }}
      >
        {confettiActive && width && height && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={250}
            gravity={0.19}
            className="pointer-events-none"
            colors={
              document.documentElement.getAttribute("data-theme") === "dark"
                ? ["#f9f871", "#15e0e0", "#ff7e26", "#fff", "#cc48b0"]
                : ["#007bff", "#2563eb", "#64748b", "#f59e42", "#68fd91"]
            }
            style={{ zIndex: 44 }}
          />
        )}

        {showResults && (
          <TestResults
            wpm={wpm}
            accuracy={accuracy}
            timerLength={timerLength}
            errors={errors}
            onRestart={resetTest}
          />
        )}
        {!showResults && (
          <>
            <PromptDisplay
              prompt={prompt}
              input={typed}
              caseSensitive={caseSensitive}
            />
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
              style={{ caretColor: "var(--text-secondary)" }}
              autoFocus
              tabIndex={0}
            />
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <button
                className="px-3 py-1 bg-[var(--button-bg)] text-[var(--button-text)] rounded-md font-medium shadow"
                onClick={resetTest}
              >
                Restart
              </button>
            </div>
          </>
        )}
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

/**
 * TestResults - visually polished result panel (shows confetti externally).
 */
function TestResults({ wpm, accuracy, timerLength, errors, onRestart }) {
  return (
    <div
      className="w-full bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-lg flex flex-col items-center animate-fade-down border border-[var(--border-color)]"
      tabIndex={0}
      aria-label="Test results"
      style={{
        maxWidth: 420,
        margin: "0 auto",
        background:
          "linear-gradient(120deg, var(--bg-secondary) 60%, var(--border-color) 100%)",
      }}
    >
      <h2
        className="text-2xl font-extrabold mb-1"
        style={{ letterSpacing: 2, color: "var(--text-secondary)" }}
      >
        🎉 Great job!
      </h2>
      <div className="flex flex-col items-center font-mono mb-2 text-lg w-full gap-1">
        <div>
          <span role="img" aria-label="stopwatch">
            ⏲️
          </span>{" "}
          <b>{timerLength}s</b>
        </div>
        <div>
          <span role="img" aria-label="speed">
            🔤
          </span>{" "}
          WPM: <strong>{wpm}</strong>
        </div>
        <div>
          <span role="img" aria-label="accuracy">
            ✅
          </span>{" "}
          Accuracy: <strong>{accuracy}%</strong>
        </div>
        <div>
          <span role="img" aria-label="errors">
            ❌
          </span>{" "}
          <strong>{errors}</strong> mistakes
        </div>
      </div>
      <button
        onClick={onRestart}
        className="mt-2 px-5 py-2 rounded-xl bg-[var(--button-bg)] text-[var(--button-text)] font-semibold shadow hover:brightness-110 transition-all"
        aria-label="Restart typing test"
      >
        Restart Test
      </button>
    </div>
  );
}

export default TypingTest;

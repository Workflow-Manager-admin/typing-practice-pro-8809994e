import React, { useEffect, useState, useContext } from "react";
import { TypingTestContext } from "./TypingTestContext";

/**
 * PUBLIC_INTERFACE
 * OnScreenKeyboard displays a full PC keyboard layout (QWERTY, function keys, modifiers, etc.),
 * with responsive, full-width, theme-aware styling. Highlights next char and pressed key.
 */
function OnScreenKeyboard() {
  const [pressedKey, setPressedKey] = useState(null);
  const ctx = useContext(TypingTestContext) || {};
  const { prompt = "", typed = "" } = ctx;

  // Keyboard layout specification
  const keyboardRows = [
    [
      { code: "Escape", label: "Esc", width: 2 },
      ...[...Array(12)].map((_, i) => ({
        code: `F${i + 1}`,
        label: `F${i + 1}`,
        width: 1,
      })),
      { code: "Delete", label: "Del", width: 2 },
    ],
    [
      { code: "Backquote", label: "`", width: 1 },
      ...[
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
      ].map((key, i) => ({ code: `Digit${key}`, label: key, width: 1 })),
      { code: "Backspace", label: "Backspace", width: 3 },
    ],
    [
      { code: "Tab", label: "Tab", width: 2 },
      ...["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"].map(
        (key) => ({
          code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
          label: key,
          width: 1,
        })
      ),
    ],
    [
      { code: "CapsLock", label: "Caps", width: 2.5 },
      ...["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"].map((key) => ({
        code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
        label: key,
        width: 1,
      })),
      { code: "Enter", label: "Enter", width: 2.5 },
    ],
    [
      { code: "ShiftLeft", label: "Shift", width: 3 },
      ...["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"].map((key) => ({
        code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
        label: key,
        width: 1,
      })),
      { code: "ShiftRight", label: "Shift", width: 3 },
    ],
    [
      { code: "ControlLeft", label: "Ctrl", width: 1.5 },
      { code: "MetaLeft", label: "Win", width: 1.5 },
      { code: "AltLeft", label: "Alt", width: 1.5 },
      { code: "Space", label: "", width: 7 },
      { code: "AltRight", label: "Alt", width: 1.5 },
      { code: "MetaRight", label: "Win", width: 1.5 },
      { code: "ContextMenu", label: "Menu", width: 1.5 },
      { code: "ControlRight", label: "Ctrl", width: 1.5 },
    ],
  ];

  // Listen for real typing and highlight pressed key in UI
  useEffect(() => {
    function down(e) {
      setPressedKey(e.code || e.key);
    }
    function up() {
      setPressedKey(null);
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Determine next character for highlight
  const nextChar = prompt?.[typed?.length] || "";

  // Helper: find primary UI label for given char to map highlight
  function charToKeyLabel(ch) {
    if (!ch) return "";
    if ("abcdefghijklmnopqrstuvwxyz".includes(ch.toLowerCase())) {
      return ch.toLowerCase();
    }
    if ("1234567890".includes(ch)) {
      return ch;
    }
    if (ch === " ") return "";
    return ch; // fallback for symbols
  }

  // Highlight if this key is the next to type (by label) or is pressed
  function getKeyHighlight(keyObj) {
    const label = keyObj.label;
    // Space key: highlight on nextChar === " "
    if (keyObj.code === "Space" && nextChar === " ") return "next";
    // Letters/numbers/symbols: strict match
    if (
      label &&
      label.length === 1 &&
      charToKeyLabel(nextChar) === label.toLowerCase()
    )
      return "next";
    // Pressed effect by physical key
    if (
      pressedKey &&
      (pressedKey === keyObj.code ||
        pressedKey.toLowerCase() === label.toLowerCase())
    )
      return "pressed";
    return "";
  }

  // Compute CSS grid col-template for each row (align to full width)
  function getGridTemplate(row) {
    // Each key defines its own width (default 1)
    const totalUnits = row.reduce((sum, key) => sum + (key.width || 1), 0);
    return row
      .map((key) => `minmax(0, ${(key.width || 1) / totalUnits * 100}%)`)
      .join(" ");
  }

  return (
    <nav
      className="on-screen-keyboard w-full max-w-4xl mx-auto mt-8 px-2 select-none"
      aria-label="On-screen PC keyboard"
      style={{
        userSelect: "none",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
      }}
    >
      {keyboardRows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="osk-row"
          style={{
            display: "grid",
            gridTemplateColumns: getGridTemplate(row),
            gap: "7px",
            width: "100%",
            marginBottom: rowIdx === keyboardRows.length - 1 ? 0 : 8,
          }}
        >
          {row.map((key, colIdx) => {
            const highlight = getKeyHighlight(key);
            let bg = "var(--bg-secondary)";
            let color = "var(--text-primary)";
            let styleBox = {};
            if (highlight === "next") {
              bg = "var(--text-secondary)";
              color = "var(--bg-primary)";
              styleBox = {
                fontWeight: "bold",
                boxShadow:
                  "0 0 0 3px var(--button-bg),0 2px 10px rgba(0,0,0,0.13)",
                zIndex: 2,
              };
            } else if (highlight === "pressed") {
              bg = "var(--button-bg)";
              color = "var(--button-text)";
              styleBox = { fontWeight: "bold", boxShadow: "0 0 0 2px var(--button-bg)" };
            }
            // Space shows icon
            const display =
              key.code === "Space" ? (
                <span aria-label="space" style={{ fontSize: "20px" }}>
                  ⎵
                </span>
              ) : (
                key.label || ""
              );
            return (
              <kbd
                key={key.code + "_" + colIdx}
                role="presentation"
                aria-label={key.label || key.code}
                tabIndex={-1}
                className="osk-key"
                style={{
                  background: bg,
                  color,
                  border: "1px solid var(--border-color)",
                  borderRadius: 7,
                  fontSize:
                    key.label?.length >= 5
                      ? "0.85rem"
                      : "1.01rem",
                  minHeight: 40,
                  height: "3.15vw",
                  minWidth: 0,
                  maxWidth: "none",
                  padding: "0 0.5em",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  justifySelf: "stretch",
                  alignSelf: "center",
                  transition:
                    "background 0.12s, color 0.12s, box-shadow 0.14s",
                  ...styleBox,
                  borderBottom:
                    highlight === "pressed"
                      ? "3px solid var(--button-bg)"
                      : "2px solid var(--border-color)",
                  outline: highlight ? "none" : undefined,
                }}
              >
                {display}
              </kbd>
            );
          })}
        </div>
      ))}
      {/* Styling for mobile full width */}
      <style>{`
        @media (max-width: 600px) {
          .on-screen-keyboard {
            font-size: 11px;
            max-width: 100vw;
            padding: 2vw;
          }
          .osk-key {
            min-height: 26px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default OnScreenKeyboard;

"use client";
import React, { type CSSProperties, useState, useRef, useEffect } from "react";
import { safeHex, hexToRgb } from "@/lib/color";

const DEFAULT_PRESETS = [
  "#876cff", "#6366f1", "#8b5cf6",
  "#ec4899", "#f43f5e", "#f87171",
  "#f59e0b", "#fbbf24", "#84cc16",
  "#10b981", "#4ade80", "#0ea5e9",
  "#60a5fa", "#06b6d4", "#9a96b4",
];

interface ColorPickerProps {
  value:      string;
  onChange:   (color: string) => void;
  label?:     string;
  presets?:   string[];
  showInput?: boolean;
  style?:     CSSProperties;
}

export function ColorPicker({
  value, onChange, label, presets = DEFAULT_PRESETS,
  showInput = true, style,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validColor = safeHex(value);
  const [cr, cg, cb] = hexToRgb(validColor);

  // Sync inputValue when value prop changes externally (e.g. swatch click)
  useEffect(() => {
    if (!focused) setInputValue(value);
  }, [value, focused]);

  function handleInputChange(raw: string) {
    setInputValue(raw);
    // Try to validate and fire onChange in real time
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    const safe = safeHex(normalized, "");
    if (safe) {
      onChange(safe);
    }
  }

  function commitInput(raw: string) {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    const safe = safeHex(normalized, "");
    if (safe) {
      onChange(safe);
      setInputValue(safe);
    } else {
      // revert to current valid value
      setInputValue(validColor);
    }
  }

  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      gap:           "12px",
      ...style,
    }}>
      {/* Label */}
      {label && (
        <label style={{
          fontSize:      "12px",
          fontWeight:    600,
          color:         "var(--text-muted)",
          letterSpacing: "-0.01em",
        }}>
          {label}
        </label>
      )}

      {/* Current color preview */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width:        "32px",
          height:       "32px",
          borderRadius: "50%",
          background:   validColor,
          boxShadow: [
            `0 0 0 2px var(--surface, #111)`,
            `0 0 0 3px rgba(255,255,255,0.12)`,
            `0 2px 8px rgba(0,0,0,0.3)`,
          ].join(", "),
          flexShrink:  0,
          transition:  "background 0.15s",
        }} />
        <span style={{
          fontSize:      "13px",
          color:         "var(--text-sub)",
          fontFamily:    "var(--mono, monospace)",
          letterSpacing: "0.02em",
          transition:    "color 0.15s",
        }}>
          {validColor}
        </span>
      </div>

      {/* Preset swatches grid */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap:                 "8px",
      }}>
        {presets.map((hex) => {
          const safe = safeHex(hex);
          const isSelected = safe.toLowerCase() === validColor.toLowerCase();
          return (
            <SwatchButton
              key={hex}
              color={safe}
              selected={isSelected}
              onClick={() => { onChange(safe); setInputValue(safe); }}
            />
          );
        })}
      </div>

      {/* Hex input */}
      {showInput && (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); commitInput(inputValue); }}
            onKeyDown={(e) => { if (e.key === "Enter") { commitInput(inputValue); inputRef.current?.blur(); } }}
            spellCheck={false}
            autoComplete="off"
            maxLength={9}
            style={{
              width:        "100%",
              height:       "34px",
              padding:      "0 12px",
              fontSize:     "13px",
              fontFamily:   "var(--mono, monospace)",
              color:        "var(--text)",
              background:   focused
                ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
                : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
              border:       focused
                ? `1px solid rgba(${cr},${cg},${cb},0.53)`
                : "1px solid rgba(255,255,255,0.09)",
              borderRadius: "var(--radius-sm, 9px)",
              outline:      "none",
              boxShadow:    focused
                ? `0 0 0 3px rgba(${cr},${cg},${cb},0.12), 0 1px 0 rgba(255,255,255,0.04) inset`
                : "0 1px 0 rgba(255,255,255,0.04) inset, 0 2px 8px rgba(0,0,0,0.2)",
              transition:   "border-color 0.15s, box-shadow 0.15s, background 0.15s",
            }}
          />
        </div>
      )}
    </div>
  );
}

function SwatchButton({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Select color ${color}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          "24px",
        height:         "24px",
        borderRadius:   "50%",
        border:         selected ? "2px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.1)",
        background:     color,
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        0,
        transform:      hovered ? "scale(1.15)" : "scale(1)",
        transition:     "transform 0.12s cubic-bezier(0.34,1.4,0.64,1), border-color 0.15s",
        boxShadow:      selected
          ? `0 0 0 2px var(--surface, #111), 0 0 0 3px ${color}`
          : `0 2px 6px rgba(0,0,0,0.3)`,
        outline:        "none",
        justifySelf:    "center",
      }}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      )}
    </button>
  );
}

"use client";
import { type CSSProperties, useState } from "react";
import { safeHex, hexToRgb } from "@/lib/color";

interface NumberInputProps {
  value:     number;
  onChange:  (value: number) => void;
  min?:      number;
  max?:      number;
  step?:     number;
  label?:    string;
  disabled?: boolean;
  color?:    string;
  style?:    CSSProperties;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  disabled = false,
  color = "#876cff",
  style,
}: NumberInputProps) {
  const validColor = safeHex(color);
  const [r, g, b] = hexToRgb(validColor);
  const [focused, setFocused]   = useState(false);
  const [hoverDec, setHoverDec] = useState(false);
  const [hoverInc, setHoverInc] = useState(false);

  function decrement() {
    if (disabled) return;
    const next = value - step;
    if (min !== undefined && next < min) return;
    onChange(next);
  }

  function increment() {
    if (disabled) return;
    const next = value + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseFloat(e.target.value);
    if (isNaN(parsed)) return;
    if (min !== undefined && parsed < min) return;
    if (max !== undefined && parsed > max) return;
    onChange(parsed);
  }

  const atMin = min !== undefined && value <= min;
  const atMax = max !== undefined && value >= max;

  const btnBase: CSSProperties = {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    width:          "36px",
    height:         "38px",
    border:         "none",
    background:     "transparent",
    color:          "var(--text-sub)",
    cursor:         disabled ? "not-allowed" : "pointer",
    flexShrink:     0,
    transition:     "background 0.12s, color 0.12s",
    fontSize:       "18px",
    fontWeight:     300,
    userSelect:     "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label style={{
          fontSize:      "12px",
          fontWeight:    700,
          color:         "var(--text-sub)",
          letterSpacing: "0.02em",
        }}>
          {label}
        </label>
      )}
      <div style={{
        display:      "flex",
        alignItems:   "center",
        height:       "40px",
        borderRadius: "var(--radius, 10px)",
        border:       `1px solid ${focused ? `rgba(${r},${g},${b},0.5)` : "rgba(255,255,255,0.08)"}`,
        background:   focused
          ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
          : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
        boxShadow:    focused
          ? `0 0 0 3px rgba(${r},${g},${b},0.12), 0 2px 0 rgba(255,255,255,0.03) inset`
          : "0 2px 0 rgba(255,255,255,0.03) inset, 0 4px 10px rgba(0,0,0,0.25)",
        transition:   "border-color 0.15s, box-shadow 0.15s",
        opacity:      disabled ? 0.5 : 1,
        overflow:     "hidden",
      }}>
        {/* Decrement */}
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || atMin}
          onMouseEnter={() => setHoverDec(true)}
          onMouseLeave={() => setHoverDec(false)}
          style={{
            ...btnBase,
            borderRight:  "1px solid rgba(255,255,255,0.06)",
            background:   hoverDec && !disabled && !atMin ? "rgba(255,255,255,0.05)" : "transparent",
            color:        atMin ? "var(--text-muted)" : hoverDec ? "var(--text)" : "var(--text-sub)",
            opacity:      atMin ? 0.4 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        {/* Input */}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          style={{
            flex:       1,
            height:     "100%",
            border:     "none",
            background: "transparent",
            outline:    "none",
            textAlign:  "center",
            fontSize:   "14px",
            fontFamily: "var(--mono)",
            fontWeight: 700,
            color:      "var(--text)",
            cursor:     disabled ? "not-allowed" : "text",
            // Hide arrows in Firefox
            MozAppearance: "textfield",
          } as CSSProperties}
        />

        {/* Increment */}
        <button
          type="button"
          onClick={increment}
          disabled={disabled || atMax}
          onMouseEnter={() => setHoverInc(true)}
          onMouseLeave={() => setHoverInc(false)}
          style={{
            ...btnBase,
            borderLeft:   "1px solid rgba(255,255,255,0.06)",
            background:   hoverInc && !disabled && !atMax ? "rgba(255,255,255,0.05)" : "transparent",
            color:        atMax ? "var(--text-muted)" : hoverInc ? "var(--text)" : "var(--text-sub)",
            opacity:      atMax ? 0.4 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
      {min !== undefined && max !== undefined && (
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Range: {min} – {max}
        </span>
      )}
    </div>
  );
}

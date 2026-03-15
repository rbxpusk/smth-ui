"use client";
import { useState, useRef, useEffect, type CSSProperties } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options:      SelectOption[];
  value?:       string;
  onChange?:    (value: string) => void;
  placeholder?: string;
  label?:       string;
  error?:       string;
  disabled?:    boolean;
  color?:       string;  // hex accent for focus ring/active state
  style?:       CSSProperties;
}

function hexToRgb(hex: string): [number,number,number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

export function Select({
  options, value, onChange, placeholder = "Select…",
  label, error, disabled = false, color = "#876cff", style,
}: SelectProps) {
  const [open, setOpen]   = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const ref               = useRef<HTMLDivElement>(null);
  const hasError          = !!error;
  const [r,g,b]           = hexToRgb(color);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSelect(val: string) {
    onChange?.(val);
    setOpen(false);
  }

  const borderColor = hasError
    ? "rgba(248,113,113,0.5)"
    : open ? `rgba(${r},${g},${b},0.5)` : "rgba(255,255,255,0.08)";

  const ringColor = hasError
    ? "0 0 0 3px rgba(248,113,113,0.12)"
    : open ? `0 0 0 3px rgba(${r},${g},${b},0.12)` : "";

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative", ...style }}>
      {label && (
        <label style={{ fontSize: "12px", fontWeight: 600, color: open ? "var(--text-sub)" : "var(--text-muted)", letterSpacing: "-0.01em", transition: "color 0.15s" }}>
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          width:          "100%",
          height:         "42px",
          padding:        "0 14px",
          fontSize:       "14px",
          fontFamily:     "var(--sans)",
          fontWeight:     400,
          color:          selected ? "var(--text)" : "var(--text-muted)",
          background:     open
            ? "linear-gradient(170deg, #18162280 0%, #0f0d1a80 100%)"
            : "linear-gradient(170deg, #141220 0%, #0f0d1a 100%)",
          border:         `1px solid ${borderColor}`,
          borderRadius:   "var(--radius, 11px)",
          outline:        "none",
          cursor:         disabled ? "not-allowed" : "pointer",
          opacity:        disabled ? 0.5 : 1,
          boxShadow:      ringColor
            ? `${ringColor}, 0 1px 0 rgba(255,255,255,0.04) inset`
            : "0 2px 0 rgba(255,255,255,0.03) inset, 0 4px 10px rgba(0,0,0,0.25)",
          transition:     "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          textAlign:      "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? selected.label : placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position:     "absolute",
          top:          "calc(100% + 6px)",
          left:         0,
          right:        0,
          zIndex:       200,
          background:   "linear-gradient(170deg, #1c1a28 0%, #131122 100%)",
          border:       `1px solid rgba(${r},${g},${b},0.22)`,
          borderRadius: "12px",
          boxShadow:    "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
          overflow:     "hidden",
          padding:      "4px",
        }}>
          {options.length === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
              No options
            </div>
          ) : options.map(opt => {
            const isSelected = opt.value === value;
            const isHover    = hover === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseEnter={() => setHover(opt.value)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleSelect(opt.value)}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  width:          "100%",
                  padding:        "9px 12px",
                  fontSize:       "13px",
                  fontFamily:     "var(--sans)",
                  fontWeight:     isSelected ? 700 : 400,
                  color:          isSelected ? color : isHover ? "var(--text)" : "var(--text-sub)",
                  background:     isSelected
                    ? `rgba(${r},${g},${b},0.14)`
                    : isHover ? "rgba(255,255,255,0.05)" : "transparent",
                  border:         "none",
                  borderRadius:   "8px",
                  cursor:         "pointer",
                  textAlign:      "left",
                  transition:     "background 0.12s, color 0.12s",
                }}
              >
                {opt.label}
                {isSelected && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--red)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

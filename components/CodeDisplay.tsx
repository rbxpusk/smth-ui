"use client";
import { useState, type CSSProperties } from "react";

interface CodeDisplayProps {
  code:       string;
  label?:     string;
  color?:     string;
  maxWidth?:  string | number;
  style?:     CSSProperties;
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export function CodeDisplay({ code, label, color = "#876cff", maxWidth, style }: CodeDisplayProps) {
  const [copied, setCopied]     = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);

  const rgb = hexToRgb(color);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth, ...style }}>
      {label && (
        <span style={{
          fontSize:      "11px",
          fontWeight:    700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "var(--text-muted)",
        }}>
          {label}
        </span>
      )}
      <div style={{
        display:      "flex",
        alignItems:   "center",
        borderRadius: "12px",
        border:       `1px solid rgba(${rgb},0.28)`,
        background:   "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)",
        boxShadow:    `0 0 0 1px rgba(255,255,255,0.03) inset, 0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(${rgb},0.06)`,
        overflow:     "hidden",
        position:     "relative",
      }}>
        {/* Left accent bar */}
        <div style={{
          width:      "3px",
          alignSelf:  "stretch",
          background: `linear-gradient(180deg, ${color}, rgba(${rgb},0.3))`,
          flexShrink: 0,
        }} />
        <span style={{
          flex:          1,
          padding:       "14px 16px",
          fontFamily:    "var(--mono)",
          fontSize:      "15px",
          fontWeight:    700,
          letterSpacing: "0.12em",
          color:         color,
          userSelect:    "all",
          textShadow:    `0 0 24px rgba(${rgb},0.4)`,
          whiteSpace:    "nowrap",
          overflowX:     "auto",
          scrollbarWidth: "none",
        } as CSSProperties}>
          {code}
        </span>
        <button
          onClick={handleCopy}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          title={copied ? "Copied!" : "Copy to clipboard"}
          aria-label={copied ? "Copied!" : "Copy to clipboard"}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "48px",
            height:         "48px",
            border:         "none",
            borderLeft:     `1px solid rgba(${rgb},0.15)`,
            background:     hoverBtn ? `rgba(${rgb},0.12)` : "transparent",
            color:          copied ? "#4ade80" : color,
            cursor:         "pointer",
            flexShrink:     0,
            transition:     "background 0.15s, color 0.2s",
          }}
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

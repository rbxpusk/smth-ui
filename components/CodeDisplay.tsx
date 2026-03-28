"use client";
import { useState, type CSSProperties } from "react";
import { safeHex, hexToRgbString } from "@/lib/color";

interface CodeDisplayProps {
  code:      string;
  label?:    string;
  color?:    string;
  maxWidth?: string | number;
  style?:    CSSProperties;
}

export function CodeDisplay({ code, label, color = "#876cff", maxWidth, style }: CodeDisplayProps) {
  const [copied, setCopied]       = useState(false);
  const [hoverCopy, setHoverCopy] = useState(false);

  const validColor = safeHex(color);
  const rgb        = hexToRgbString(validColor);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth, ...style }}>
      {label && (
        <span style={{
          fontSize:      "11px",
          fontWeight:    600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "var(--text-muted)",
        }}>
          {label}
        </span>
      )}

      <div style={{
        borderRadius: "8px",
        border:       "1px solid rgba(255,255,255,0.08)",
        background:   "rgba(255,255,255,0.03)",
        overflow:     "hidden",
      }}>
        {/* Window chrome */}
        <div style={{
          display:      "flex",
          alignItems:   "center",
          justifyContent: "space-between",
          padding:      "8px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background:   "rgba(255,255,255,0.02)",
        }}>
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "5px" }}>
            {[0.18, 0.12, 0.12].map((op, i) => (
              <div key={i} style={{
                width:        "9px",
                height:       "9px",
                borderRadius: "50%",
                background:   `rgba(255,255,255,${op})`,
              }} />
            ))}
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            onMouseEnter={() => setHoverCopy(true)}
            onMouseLeave={() => setHoverCopy(false)}
            title={copied ? "Copied!" : "Copy"}
            aria-label={copied ? "Copied!" : "Copy to clipboard"}
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         "5px",
              padding:     "3px 8px",
              fontSize:    "11px",
              fontWeight:  500,
              color:       copied
                ? "#4ade80"
                : hoverCopy
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(255,255,255,0.3)",
              background:  hoverCopy && !copied ? "rgba(255,255,255,0.06)" : "transparent",
              border:      "1px solid",
              borderColor: copied
                ? "rgba(74,222,128,0.3)"
                : hoverCopy
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.07)",
              borderRadius: "5px",
              cursor:       "pointer",
              transition:   "all 0.15s",
              lineHeight:   1,
            }}
          >
            {copied ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Code body */}
        <div style={{ padding: "14px 16px" }}>
          <span style={{
            fontFamily:     "var(--mono)",
            fontSize:       "14px",
            fontWeight:     500,
            letterSpacing:  "0.04em",
            color:          validColor,
            userSelect:     "all",
            textShadow:     `0 0 18px rgba(${rgb},0.35)`,
            whiteSpace:     "nowrap",
            overflowX:      "auto",
            scrollbarWidth: "none",
            display:        "block",
          } as CSSProperties}>
            {code}
          </span>
        </div>
      </div>
    </div>
  );
}

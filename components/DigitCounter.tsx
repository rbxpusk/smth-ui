"use client";
import { type ReactNode, useEffect, useState } from "react";

interface DigitCounterProps {
  value:   number;
  label?:  string;
  icon?:   ReactNode;
  digits?: number;
  color?:  string;
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

const REEL_H = 52;

function DigitReel({ digit, color, delay = 0 }: { digit: string; color: string; delay?: number }) {
  const [current, setCurrent] = useState(digit);
  const rgb = hexToRgb(color);

  useEffect(() => {
    const t = setTimeout(() => setCurrent(digit), delay);
    return () => clearTimeout(t);
  }, [digit, delay]);

  const num = parseInt(current, 10);
  const offset = isNaN(num) ? 0 : num * REEL_H;

  return (
    <div style={{ position: "relative", width: "44px", height: `${REEL_H}px`, overflow: "hidden" }}>
      {/* Top fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "14px",
        background: "linear-gradient(to bottom, var(--surface, #111), transparent)",
        zIndex: 1, pointerEvents: "none",
      }} />
      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "14px",
        background: "linear-gradient(to top, var(--surface, #111), transparent)",
        zIndex: 1, pointerEvents: "none",
      }} />

      <div style={{
        transform: `translateY(-${offset}px)`,
        transition: `transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)`,
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div
            key={n}
            style={{
              height:         `${REEL_H}px`,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       "28px",
              fontWeight:     700,
              fontFamily:     "var(--mono)",
              letterSpacing:  "-1px",
              color:          n === num
                ? color
                : `rgba(${rgb},0.2)`,
              transition: "color 0.3s",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DigitCounter({
  value,
  label,
  icon,
  digits = 4,
  color = "#876cff",
}: DigitCounterProps) {
  const clamped  = Math.max(0, Math.floor(value));
  const str      = String(clamped).padStart(digits, "0");
  const digitStr = str.length > digits ? str : str.slice(-digits);
  const rgb      = hexToRgb(color);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div style={{
        display:      "flex",
        alignItems:   "center",
        background:   "var(--surface, rgba(255,255,255,0.04))",
        border:       "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        overflow:     "hidden",
      }}>
        {icon && (
          <div style={{
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            width:        "52px",
            height:       `${REEL_H}px`,
            borderRight:  "1px solid rgba(255,255,255,0.07)",
            color,
            flexShrink:   0,
          }}>
            {icon}
          </div>
        )}
        {Array.from(digitStr).map((d, i) => (
          <div key={i} style={{ display: "flex" }}>
            {i > 0 && (
              <div style={{
                width:      "1px",
                height:     `${REEL_H}px`,
                background: "rgba(255,255,255,0.06)",
                flexShrink: 0,
              }} />
            )}
            <DigitReel digit={d} color={color} delay={i * 55} />
          </div>
        ))}
      </div>

      {label && (
        <span style={{
          fontSize:      "10px",
          fontWeight:    600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "var(--text-muted)",
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

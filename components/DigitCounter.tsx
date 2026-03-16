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

interface DigitTileProps {
  digit:       string;
  color:       string;
  delay:       number;
  isIcon?:     boolean;
  iconNode?:   ReactNode;
}

function DigitTile({ digit, color, delay, isIcon = false, iconNode }: DigitTileProps) {
  const [displayed, setDisplayed] = useState("0");
  const [animating, setAnimating]  = useState(false);
  const rgb = hexToRgb(color);

  useEffect(() => {
    if (isIcon) return;
    const timer = setTimeout(() => {
      setAnimating(true);
      // Rapid roll effect: cycle through digits quickly then land
      let count = 0;
      const totalSteps = 8 + Math.floor(Math.random() * 6);
      const interval = setInterval(() => {
        setDisplayed(String(Math.floor(Math.random() * 10)));
        count++;
        if (count >= totalSteps) {
          clearInterval(interval);
          setDisplayed(digit);
          setAnimating(false);
        }
      }, 60);
    }, delay);
    return () => clearTimeout(timer);
  }, [digit, delay, isIcon]);

  return (
    <div style={{
      width:          "52px",
      height:         "64px",
      borderRadius:   "var(--radius, 12px)",
      background:     `linear-gradient(180deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)`,
      border:         `1px solid rgba(${rgb},0.28)`,
      boxShadow:      `0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 16px rgba(0,0,0,0.5), 0 0 20px rgba(${rgb},0.08)`,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      position:       "relative",
      overflow:       "hidden",
      flexShrink:     0,
    }}>
      {/* Inner top highlight */}
      <div style={{
        position:   "absolute",
        top:        0,
        left:       "20%",
        right:      "20%",
        height:     "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        pointerEvents: "none",
      }} />
      {/* Subtle bottom shadow line */}
      <div style={{
        position:   "absolute",
        bottom:     0,
        left:       "10%",
        right:      "10%",
        height:     "1px",
        background: `rgba(${rgb},0.15)`,
        pointerEvents: "none",
      }} />
      {isIcon ? (
        <span style={{ color, display: "flex", alignItems: "center" }}>
          {iconNode}
        </span>
      ) : (
        <span style={{
          fontSize:       "26px",
          fontWeight:     900,
          fontFamily:     "var(--mono)",
          color:          animating ? `rgba(${rgb},0.7)` : color,
          letterSpacing:  "-1px",
          lineHeight:     1,
          transition:     animating ? "none" : "color 0.2s",
          textShadow:     `0 0 20px rgba(${rgb},0.5)`,
        }}>
          {displayed}
        </span>
      )}
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
  // If the number is longer than digits, show all digits
  const digitStr = str.length > digits ? str : str.slice(-digits);

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            "14px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        {icon && (
          <DigitTile
            digit=""
            color={color}
            delay={0}
            isIcon
            iconNode={icon}
          />
        )}
        {Array.from(digitStr).map((d, i) => (
          <DigitTile
            key={i}
            digit={d}
            color={color}
            delay={i * 80}
          />
        ))}
      </div>
      {label && (
        <span style={{
          fontSize:      "11px",
          fontWeight:    700,
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

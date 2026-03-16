"use client";
import React, { useState, useRef, useCallback, type CSSProperties } from "react";
import { safeHex, hexToRgb, darken } from "@/lib/color";

interface SliderProps {
  value:      number;
  onChange:   (value: number) => void;
  min?:       number;
  max?:       number;
  step?:      number;
  label?:     string;
  showValue?: boolean;
  disabled?:  boolean;
  color?:     string;
  style?:     CSSProperties;
}

export function Slider({
  value, onChange, min = 0, max = 100, step = 1,
  label, showValue = false, disabled = false, color = "#876cff", style,
}: SliderProps) {
  const validColor    = safeHex(color);
  const [r, g, b]     = hexToRgb(validColor);
  const darkColor     = darken(validColor, 40);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef      = useRef<HTMLDivElement>(null);

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const clampedPct = Math.min(100, Math.max(0, pct));

  const computeValue = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    const clamped = Math.min(max, Math.max(min, stepped));
    // Round to avoid floating-point drift
    const decimals = (step.toString().split(".")[1] || "").length;
    onChange(Number(clamped.toFixed(decimals)));
  }, [min, max, step, onChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    computeValue(e.clientX);
  }, [disabled, computeValue]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || disabled) return;
    computeValue(e.clientX);
  }, [dragging, disabled, computeValue]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && (
            <label style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "-0.01em",
            }}>
              {label}
            </label>
          )}
          {showValue && (
            <span style={{
              fontSize:     "11px",
              fontWeight:   700,
              color:        validColor,
              fontFamily:   "var(--mono)",
              background:   `rgba(${r},${g},${b},0.08)`,
              border:       `1px solid rgba(${r},${g},${b},0.15)`,
              borderRadius: "var(--radius-sm, 5px)",
              padding:      "1px 6px",
            }}>
              {value}
            </span>
          )}
        </div>
      )}

      {/* Interactive track area */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          height:   "20px",
          display:  "flex",
          alignItems: "center",
          cursor:   disabled ? "not-allowed" : "pointer",
          opacity:  disabled ? 0.5 : 1,
          touchAction: "none",
        }}
      >
        {/* Track background */}
        <div style={{
          position:     "absolute",
          left:         0,
          right:        0,
          height:       "4px",
          borderRadius: "999px",
          background:   "rgba(255,255,255,0.06)",
          boxShadow:    "0 1px 0 rgba(0,0,0,0.3) inset",
        }} />

        {/* Fill */}
        <div style={{
          position:     "absolute",
          left:         0,
          width:        `${clampedPct}%`,
          height:       "4px",
          borderRadius: "999px",
          background:   `linear-gradient(90deg, ${darkColor}, ${validColor})`,
          boxShadow:    `0 1px 0 rgba(255,255,255,0.12) inset, 0 0 6px rgba(${r},${g},${b},0.15)`,
          transition:   dragging ? undefined : "width 0.15s ease-out",
        }} />

        {/* Thumb */}
        <div style={{
          position:     "absolute",
          left:         `${clampedPct}%`,
          top:          "50%",
          width:        "16px",
          height:       "16px",
          borderRadius: "50%",
          background:   "#fff",
          boxShadow: (hovered || dragging) && !disabled
            ? `0 1px 4px rgba(0,0,0,0.35), 0 0 0 2px ${validColor}44, 0 0 12px rgba(${r},${g},${b},0.4)`
            : `0 1px 4px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08), 0 0 8px rgba(${r},${g},${b},0.25)`,
          transform:    `translate(-50%, -50%) scale(${(hovered || dragging) && !disabled ? 1.15 : 1})`,
          transition:   dragging
            ? "transform 0.1s ease-out, box-shadow 0.15s"
            : "left 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s",
          pointerEvents: "none",
        }} />
      </div>

      {/* Hidden native input for accessibility */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          position: "absolute",
          width:    "1px",
          height:   "1px",
          margin:   "-1px",
          padding:  0,
          overflow: "hidden",
          clip:     "rect(0,0,0,0)",
          border:   0,
        }}
      />
    </div>
  );
}

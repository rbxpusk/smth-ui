"use client";
import { type ReactNode, type CSSProperties, useState } from "react";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children:   ReactNode;
  size?:      BadgeSize;
  dot?:       boolean;
  icon?:      ReactNode;
  removable?: boolean;
  onRemove?:  () => void;
  color?:     string;  // hex like #876cff — derives all colors from this
  style?:     CSSProperties;
}

const sizes: Record<BadgeSize, { fontSize: string; padding: string; height: string; gap: string; radius: string }> = {
  sm: { fontSize: "10px", padding: "0 8px",  height: "22px", gap: "4px", radius: "var(--radius-sm, 6px)" },
  md: { fontSize: "11px", padding: "0 10px", height: "26px", gap: "5px", radius: "var(--radius-sm, 7px)" },
  lg: { fontSize: "12px", padding: "0 13px", height: "30px", gap: "6px", radius: "var(--radius-sm, 8px)" },
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0,2),16),
    parseInt(h.slice(2,4),16),
    parseInt(h.slice(4,6),16),
  ];
}

export function Badge({ children, size = "md", dot, icon, removable, onRemove, color = "#876cff", style }: BadgeProps) {
  const s = sizes[size];
  const [r,g,b] = hexToRgb(color);
  const [hoverRemove, setHoverRemove] = useState(false);

  return (
    <span style={{
      display:       "inline-flex",
      alignItems:    "center",
      gap:           s.gap,
      height:        s.height,
      padding:       s.padding,
      fontSize:      s.fontSize,
      fontWeight:    700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      borderRadius:  s.radius,
      color:         color,
      background:    `linear-gradient(170deg, rgba(${r},${g},${b},0.16) 0%, rgba(${r},${g},${b},0.1) 100%)`,
      border:        `1px solid rgba(${r},${g},${b},0.35)`,
      boxShadow:     `0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset`,
      whiteSpace:    "nowrap",
      userSelect:    "none",
      flexShrink:    0,
      ...style,
    }}>
      {dot && (
        <span style={{
          width: "5px", height: "5px", borderRadius: "50%",
          background: color, flexShrink: 0,
          boxShadow: `0 0 6px ${color}`,
        }} />
      )}
      {icon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0, opacity: 0.85 }}>{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          onMouseEnter={() => setHoverRemove(true)}
          onMouseLeave={() => setHoverRemove(false)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "14px", height: "14px", borderRadius: "4px",
            border: "none",
            background: hoverRemove ? `rgba(${r},${g},${b},0.2)` : "transparent",
            color, cursor: "pointer", padding: 0, marginLeft: "2px",
            flexShrink: 0, transition: "background 0.12s",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M1 1l8 8M9 1L1 9"/>
          </svg>
        </button>
      )}
    </span>
  );
}

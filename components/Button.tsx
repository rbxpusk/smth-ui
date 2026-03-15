"use client";
import { type ReactNode, type ButtonHTMLAttributes, useState } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size    = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  iconLeft?:  ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  pill?:      boolean;
  color?:     string;  // hex — overrides primary gradient with this color
}

const sizes: Record<Size, { padding: string; fontSize: string; height: string; gap: string; radius: string }> = {
  xs: { padding: "0 12px",  fontSize: "11px", height: "28px", gap: "5px",  radius: "var(--radius, 8px)"  },
  sm: { padding: "0 16px",  fontSize: "12px", height: "34px", gap: "6px",  radius: "var(--radius, 9px)"  },
  md: { padding: "0 22px",  fontSize: "14px", height: "42px", gap: "7px",  radius: "var(--radius, 11px)" },
  lg: { padding: "0 30px",  fontSize: "15px", height: "50px", gap: "8px",  radius: "var(--radius, 13px)" },
  xl: { padding: "0 40px",  fontSize: "16px", height: "58px", gap: "9px",  radius: "var(--radius, 15px)" },
};

function parseHex(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0,2), 16),
    g: parseInt(h.slice(2,4), 16),
    b: parseInt(h.slice(4,6), 16),
  };
}

function lighten(hex: string, amt = 40) {
  const { r, g, b } = parseHex(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}

function darken(hex: string, amt = 30) {
  const { r, g, b } = parseHex(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

function isLight(hex: string) {
  const { r, g, b } = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function buildPrimaryStyle(color: string, hovered: boolean, pressed: boolean) {
  const { r, g, b } = parseHex(color);
  const light = lighten(color, 38);
  const dark  = darken(color, 32);
  return {
    background: `linear-gradient(180deg, ${light} 0%, ${color} 55%, ${dark} 100%)`,
    color:      isLight(color) ? "#111" : "#fff",
    border:     "none",
    boxShadow: [
      "0 1px 0 rgba(255,255,255,0.24) inset",
      "0 -1px 0 rgba(0,0,0,0.28) inset",
      `0 8px 28px rgba(${r},${g},${b},0.42)`,
      `0 2px 8px  rgba(${r},${g},${b},0.28)`,
    ].join(", "),
    filter:    hovered && !pressed ? "brightness(1.1)"  : pressed ? "brightness(0.92)" : undefined,
    transform: pressed ? "translateY(1px) scale(0.98)" : hovered ? "translateY(-1px)" : "translateY(0)",
  } as React.CSSProperties;
}

export function Button({
  variant   = "primary",
  size      = "md",
  loading   = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  pill      = false,
  color,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const s          = sizes[size];
  const isDisabled = disabled || loading;
  const [hovered, setHovered]   = useState(false);
  const [pressed, setPressed]   = useState(false);
  const radius = pill ? "999px" : s.radius;

  const primaryColor = color ?? "#876cff";

  /* ── Per-variant base + hover/press styles ─────────────────────────────── */
  let variantStyle: React.CSSProperties;

  if (variant === "primary" || color) {
    variantStyle = buildPrimaryStyle(primaryColor, hovered && !isDisabled, pressed && !isDisabled);
  } else if (variant === "secondary") {
    variantStyle = {
      background: hovered
        ? "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.07) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
      color:     "var(--text)",
      border:    "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 -1px 0 rgba(0,0,0,0.22) inset",
      transform: pressed ? "translateY(1px) scale(0.98)" : hovered ? "translateY(-1px)" : "translateY(0)",
    };
  } else if (variant === "ghost") {
    variantStyle = {
      background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      color:      hovered ? "var(--text)" : "var(--text-sub)",
      border:     "1px solid transparent",
      boxShadow:  "none",
      transform:  "none",
    };
  } else if (variant === "danger") {
    variantStyle = buildPrimaryStyle("#dc2626", hovered && !isDisabled, pressed && !isDisabled);
  } else {
    // outline
    variantStyle = {
      background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
      color:      "var(--text)",
      border:     hovered ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--border-hi)",
      boxShadow:  "none",
      transform:  pressed ? "translateY(1px)" : hovered ? "translateY(-1px)" : "translateY(0)",
    };
  }

  return (
    <button
      disabled={isDisabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            s.gap,
        padding:        s.padding,
        fontSize:       s.fontSize,
        height:         s.height,
        fontWeight:     600,
        letterSpacing:  "-0.01em",
        borderRadius:   radius,
        cursor:         isDisabled ? "not-allowed" : "pointer",
        opacity:        isDisabled && !loading ? 0.4 : 1,
        transition:     "opacity 0.15s, box-shadow 0.15s, transform 0.12s cubic-bezier(0.34,1.4,0.64,1), filter 0.15s, background 0.13s, border-color 0.13s, color 0.13s",
        width:          fullWidth ? "100%" : undefined,
        whiteSpace:     "nowrap",
        userSelect:     "none",
        outline:        "none",
        flexShrink:     0,
        ...variantStyle,
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      ) : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

"use client";
import React, { type ReactNode, type ButtonHTMLAttributes, useState } from "react";
import { safeHex, parseHex, lighten, darken, isLight } from "@/lib/color";

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

function buildPrimaryStyle(color: string, hovered: boolean, pressed: boolean) {
  const { r, g, b } = parseHex(color);
  const light = lighten(color, 38);
  const dark  = darken(color, 32);
  return {
    background: `linear-gradient(180deg, ${light} 0%, ${color} 55%, ${dark} 100%)`,
    color:      isLight(color) ? "#111" : "#fff",
    border:     "none",
    boxShadow: [
      "0 1px 0 rgba(255,255,255,0.15) inset",
      "0 -1px 0 rgba(0,0,0,0.25) inset",
      `0 6px 20px rgba(${r},${g},${b},0.35)`,
      `0 2px 6px  rgba(${r},${g},${b},0.22)`,
    ].join(", "),
    filter:    hovered && !pressed ? "brightness(1.06)"  : pressed ? "brightness(0.93)" : undefined,
    transform: pressed ? "translateY(1px) scale(0.98)" : hovered ? "translateY(-1px)" : "translateY(0)",
  } as React.CSSProperties;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
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
}, ref) {
  const s          = sizes[size];
  const isDisabled = disabled || loading;
  const [hovered, setHovered]   = useState(false);
  const [pressed, setPressed]   = useState(false);
  const [focused, setFocused]   = useState(false);
  const radius = pill ? "999px" : s.radius;

  const primaryColor = safeHex(color ?? "#876cff");

  /* ── Per-variant base + hover/press styles ─────────────────────────────── */
  let variantStyle: React.CSSProperties;

  if (variant === "primary" || color) {
    variantStyle = buildPrimaryStyle(primaryColor, hovered && !isDisabled, pressed && !isDisabled);
  } else if (variant === "secondary") {
    variantStyle = {
      background: hovered
        ? "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 100%)",
      color:     "var(--text)",
      border:    "1px solid rgba(255,255,255,0.09)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.18) inset",
      transform: pressed ? "translateY(1px) scale(0.98)" : hovered ? "translateY(-1px)" : "translateY(0)",
    };
  } else if (variant === "ghost") {
    variantStyle = {
      background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
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
      border:     hovered ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--border-hi)",
      boxShadow:  "none",
      transform:  pressed ? "translateY(1px)" : hovered ? "translateY(-1px)" : "translateY(0)",
    };
  }

  // focus ring color — use accent for primary, white for others
  const focusRingColor = (variant === "primary" || color)
    ? (color ?? "#876cff")
    : "rgba(255,255,255,0.5)";

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setPressed(true); }}
      onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") setPressed(false); }}
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
        ...(focused && !isDisabled ? { outline: `2px solid ${focusRingColor}`, outlineOffset: "2px" } : {}),
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
});

Button.displayName = "Button";

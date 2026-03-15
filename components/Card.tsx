"use client";
import { type ReactNode, type CSSProperties, useState } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// All variants are based on the elevated treatment — just different border/glow
type CardVariant = "default" | "elevated" | "flat" | "outlined" | "danger" | "success";

interface CardProps {
  children:     ReactNode;
  variant?:     CardVariant;
  padding?:     string;
  radius?:      string;
  style?:       CSSProperties;
  noise?:       boolean;
  specular?:    boolean;
  onClick?:     () => void;
  borderColor?: string;   // hex or rgba override
  glowColor?:   string;   // rgba override for outer glow
  accentTop?:   string;   // css gradient string for top border stripe
}

// Base elevated surface — uses CSS vars so playground theme injection works
const BASE_BG   = "linear-gradient(170deg, var(--surface, #1c1a28) 0%, var(--surface-lo, #131122) 100%)";
const BASE_SHADOW = "0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.6)";

const variantOverrides: Record<CardVariant, { borderRgba: string; glowRgba?: string }> = {
  default:  { borderRgba: "rgba(255,255,255,0.09)" },
  elevated: { borderRgba: "rgba(255,255,255,0.11)" },
  flat:     { borderRgba: "rgba(255,255,255,0.07)" },
  outlined: { borderRgba: "rgba(255,255,255,0.15)" },
  danger:   { borderRgba: "rgba(248,113,113,0.28)",  glowRgba: "rgba(248,113,113,0.08)" },
  success:  { borderRgba: "rgba(74,222,128,0.28)",   glowRgba: "rgba(74,222,128,0.08)" },
};

export function Card({
  children,
  variant = "default",
  padding = "20px",
  radius = "16px",
  style,
  noise = true,
  specular = true,
  onClick,
  borderColor,
  glowColor,
  accentTop,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const ov = variantOverrides[variant];

  const resolvedBorder = borderColor ? borderColor : ov.borderRgba;
  const resolvedGlow   = glowColor   ? glowColor   : ov.glowRgba;

  const shadow = [
    `0 0 0 1px ${resolvedBorder}`,
    "0 2px 0 rgba(255,255,255,0.05) inset",
    "0 -1px 0 rgba(0,0,0,0.5) inset",
    variant === "flat" ? "0 4px 12px rgba(0,0,0,0.3)" : "0 20px 60px rgba(0,0,0,0.55)",
    resolvedGlow ? `0 0 40px ${resolvedGlow}` : null,
  ].filter(Boolean).join(", ");

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHovered(true)}
      onMouseLeave={() => onClick && setHovered(false)}
      style={{
        position:   "relative",
        overflow:   "hidden",
        borderRadius: radius,
        padding,
        background: variant === "flat" ? "#111019" : BASE_BG,
        boxShadow:  shadow,
        cursor:     onClick ? "pointer" : undefined,
        transform:  onClick && hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.2s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.2s",
        ...style,
      }}
    >
      {accentTop && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px", background: accentTop, zIndex: 1,
        }} />
      )}
      {noise && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          backgroundImage: NOISE, backgroundSize: "128px 128px",
          opacity: 0.025, pointerEvents: "none", mixBlendMode: "overlay",
        }} />
      )}
      {specular && (
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          pointerEvents: "none",
        }} />
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

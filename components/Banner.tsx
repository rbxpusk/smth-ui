"use client";
import { type ReactNode, type CSSProperties, useState } from "react";
import { safeHex, hexToRgbString } from "@/lib/color";

type BannerVariant = "info" | "success" | "warning" | "error";

interface BannerProps {
  children: ReactNode;
  variant?: BannerVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
  color?: string;
  style?: CSSProperties;
}

const variantColors: Record<BannerVariant, { color: string; rgb: string; icon: ReactNode }> = {
  info: {
    color: "#60a5fa",
    rgb: "96,165,250",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  success: {
    color: "#4ade80",
    rgb: "74,222,128",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
  warning: {
    color: "#fbbf24",
    rgb: "251,191,36",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  error: {
    color: "#f87171",
    rgb: "248,113,113",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
};

export function Banner({
  children,
  variant = "info",
  dismissible = false,
  onDismiss,
  icon,
  action,
  color,
  style,
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [hoverDismiss, setHoverDismiss] = useState(false);

  if (dismissed) return null;

  const v = variantColors[variant];
  const validColor = safeHex(color ?? v.color);
  const rgb = color ? hexToRgbString(validColor) : v.rgb;
  const accentColor = color ? validColor : v.color;
  const defaultIcon = v.icon;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      role="banner"
      style={{
        display:    "flex",
        alignItems: "center",
        width:      "100%",
        background: `linear-gradient(90deg, rgba(${rgb},0.1) 0%, rgba(${rgb},0.04) 100%)`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: "var(--radius-sm, 6px)",
        overflow:   "hidden",
        position:   "relative",
        ...style,
      }}
    >
      {/* Icon */}
      <div style={{
        padding:    "12px 0 12px 14px",
        color:      accentColor,
        flexShrink: 0,
        display:    "flex",
        alignItems: "center",
      }}>
        {icon || defaultIcon}
      </div>

      {/* Content */}
      <div style={{
        flex:        1,
        padding:     "12px 14px 12px 10px",
        fontSize:    "13px",
        fontWeight:  500,
        color:       "var(--text)",
        lineHeight:  1.5,
      }}>
        {children}
      </div>

      {/* Action */}
      {action && (
        <div style={{
          flexShrink:  0,
          paddingRight: dismissible ? "4px" : "14px",
          display:     "flex",
          alignItems:  "center",
        }}>
          {action}
        </div>
      )}

      {/* Dismiss button */}
      {dismissible && (
        <button
          aria-label="Close"
          onClick={handleDismiss}
          onMouseEnter={() => setHoverDismiss(true)}
          onMouseLeave={() => setHoverDismiss(false)}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "32px",
            height:         "32px",
            margin:         "0 8px 0 0",
            borderRadius:   "var(--radius-sm, 6px)",
            border:         "none",
            background:     hoverDismiss ? "rgba(255,255,255,0.04)" : "transparent",
            color:          "var(--text-muted)",
            cursor:         "pointer",
            flexShrink:     0,
            transition:     "background 0.15s",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l8 8M9 1L1 9" />
          </svg>
        </button>
      )}
    </div>
  );
}

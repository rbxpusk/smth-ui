"use client";
import { type ReactNode, type CSSProperties, type HTMLAttributes, useState } from "react";
import { safeHex, hexToRgbString } from "@/lib/color";

type AlertVariant = "success" | "error" | "warning" | "info" | "neutral";

interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?:  AlertVariant;
  title:     string;
  message?:  string;
  icon?:     ReactNode;
  dismissible?: boolean;
  onDismiss?:   () => void;
  color?:    string;
}

const variantMap: Record<AlertVariant, { color: string; rgb: string; icon: ReactNode }> = {
  success: {
    color: "#4ade80",
    rgb:   "74,222,128",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="M22 4L12 14.01l-3-3"/>
      </svg>
    ),
  },
  error: {
    color: "#f87171",
    rgb:   "248,113,113",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M15 9l-6 6M9 9l6 6"/>
      </svg>
    ),
  },
  warning: {
    color: "#fbbf24",
    rgb:   "251,191,36",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  info: {
    color: "#60a5fa",
    rgb:   "96,165,250",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  neutral: {
    color: "#9a96b4",
    rgb:   "154,150,180",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
};

export function Alert({
  variant = "info",
  title,
  message,
  icon,
  dismissible = false,
  onDismiss,
  color,
  style,
  ...rest
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const [hoverDismiss, setHoverDismiss] = useState(false);

  if (dismissed) return null;

  const validColor = safeHex(color ?? variantMap[variant].color);

  let accentColor: string;
  let rgb: string;
  let defaultIcon: ReactNode;

  if (color) {
    accentColor  = validColor;
    rgb          = hexToRgbString(validColor);
    defaultIcon  = variantMap.info.icon;
  } else {
    const v      = variantMap[variant];
    accentColor  = v.color;
    rgb          = v.rgb;
    defaultIcon  = v.icon;
  }

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div role="alert" {...rest} style={{
      display:      "flex",
      alignItems:   "flex-start",
      gap:          "0",
      borderRadius: "var(--radius, 12px)",
      border:       `1px solid rgba(${rgb},0.22)`,
      background:   `linear-gradient(135deg, rgba(${rgb},0.07) 0%, rgba(${rgb},0.03) 100%)`,
      boxShadow:    `0 0 0 1px rgba(255,255,255,0.03) inset, 0 4px 16px rgba(0,0,0,0.3)`,
      overflow:     "hidden",
      position:     "relative",
      ...style,
    }}>
      {/* Left colored bar */}
      <div style={{
        width:      "3px",
        alignSelf:  "stretch",
        background: `linear-gradient(180deg, ${accentColor}, rgba(${rgb},0.25))`,
        flexShrink: 0,
      }} />

      {/* Icon */}
      <div style={{
        padding:        "14px 0 14px 14px",
        color:          accentColor,
        flexShrink:     0,
        display:        "flex",
        alignItems:     "flex-start",
        paddingTop:     "16px",
      }}>
        {icon || defaultIcon}
      </div>

      {/* Content */}
      <div style={{
        flex:          1,
        padding:       "14px 14px 14px 10px",
        display:       "flex",
        flexDirection: "column",
        gap:           "3px",
      }}>
        <span style={{
          fontSize:   "13px",
          fontWeight: 700,
          color:      "var(--text)",
        }}>
          {title}
        </span>
        {message && (
          <span style={{
            fontSize:   "13px",
            color:      "var(--text-sub)",
            lineHeight: 1.6,
          }}>
            {message}
          </span>
        )}
      </div>

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
            width:          "36px",
            height:         "36px",
            margin:         "8px 8px 0 0",
            borderRadius:   "8px",
            border:         "none",
            background:     hoverDismiss ? "rgba(255,255,255,0.07)" : "transparent",
            color:          "var(--text-muted)",
            cursor:         "pointer",
            flexShrink:     0,
            transition:     "background 0.15s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l8 8M9 1L1 9"/>
          </svg>
        </button>
      )}
    </div>
  );
}

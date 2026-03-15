"use client";
import { type InputHTMLAttributes, type ReactNode, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  hint?:      string;
  error?:     string;
  iconLeft?:  ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  color?:     string;
}

export function Input({
  label, hint, error, iconLeft, iconRight, fullWidth, color = "#876cff", style, ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  const accentColor = hasError ? "#f87171" : color;
  const borderColor = hasError
    ? "rgba(248,113,113,0.5)"
    : focused
    ? `${accentColor}88`
    : "rgba(255,255,255,0.09)";
  const ringColor = hasError ? "rgba(248,113,113,0.12)" : `${accentColor}20`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: fullWidth ? "100%" : undefined }}>
      {label && (
        <label style={{
          fontSize:      "12px",
          fontWeight:    600,
          color:         focused ? "var(--text-sub)" : "var(--text-muted)",
          letterSpacing: "-0.01em",
          transition:    "color 0.15s",
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {iconLeft && (
          <span style={{
            position:      "absolute",
            left:          "13px",
            color:         focused ? accentColor : "var(--text-muted)",
            display:       "flex",
            alignItems:    "center",
            pointerEvents: "none",
            transition:    "color 0.15s",
          }}>
            {iconLeft}
          </span>
        )}
        <input
          onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
          style={{
            width:        "100%",
            height:       "42px",
            padding:      `0 ${iconRight ? "40px" : "14px"} 0 ${iconLeft ? "40px" : "14px"}`,
            fontSize:     "14px",
            fontFamily:   "var(--sans)",
            color:        "var(--text)",
            background:   focused
              ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
              : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
            border:       `1px solid ${borderColor}`,
            borderRadius: "var(--radius, 11px)",
            outline:      "none",
            boxShadow:    focused
              ? `0 0 0 3px ${ringColor}, 0 1px 0 rgba(255,255,255,0.04) inset`
              : "0 1px 0 rgba(255,255,255,0.04) inset, 0 2px 8px rgba(0,0,0,0.2)",
            transition:   "border-color 0.15s, box-shadow 0.15s, background 0.15s",
            opacity:      props.disabled ? 0.45 : 1,
            cursor:       props.disabled ? "not-allowed" : undefined,
            ...style,
          }}
          {...props}
        />
        {iconRight && (
          <span style={{
            position:      "absolute",
            right:         "13px",
            color:         "var(--text-muted)",
            display:       "flex",
            alignItems:    "center",
            pointerEvents: "none",
          }}>
            {iconRight}
          </span>
        )}
      </div>
      {(hint || error) && (
        <span style={{
          display:    "flex",
          alignItems: "center",
          gap:        "5px",
          fontSize:   "12px",
          color:      error ? "var(--red)" : "var(--text-muted)",
        }}>
          {error && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {error || hint}
        </span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:     string;
  hint?:      string;
  error?:     string;
  fullWidth?: boolean;
  color?:     string;
}

export function Textarea({ label, hint, error, fullWidth, color = "#876cff", style, ...props }: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const hasError  = !!error;
  const accentColor = hasError ? "#f87171" : color;
  const borderColor = hasError ? "rgba(248,113,113,0.5)" : focused ? `${accentColor}88` : "rgba(255,255,255,0.09)";
  const ringColor   = hasError ? "rgba(248,113,113,0.12)" : `${accentColor}20`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: fullWidth ? "100%" : undefined }}>
      {label && (
        <label style={{
          fontSize:   "12px",
          fontWeight: 600,
          color:      focused ? "var(--text-sub)" : "var(--text-muted)",
          transition: "color 0.15s",
        }}>
          {label}
        </label>
      )}
      <textarea
        onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        style={{
          width:        "100%",
          minHeight:    "100px",
          padding:      "12px 14px",
          fontSize:     "14px",
          fontFamily:   "var(--sans)",
          color:        "var(--text)",
          background:   "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
          border:       `1px solid ${borderColor}`,
          borderRadius: "var(--radius, 11px)",
          outline:      "none",
          resize:       "vertical",
          boxShadow:    focused
            ? `0 0 0 3px ${ringColor}, 0 1px 0 rgba(255,255,255,0.04) inset`
            : "0 1px 0 rgba(255,255,255,0.04) inset, 0 2px 8px rgba(0,0,0,0.2)",
          transition:   "border-color 0.15s, box-shadow 0.15s",
          lineHeight:   1.65,
          ...style,
        }}
        {...props}
      />
      {(hint || error) && (
        <span style={{ fontSize: "12px", color: error ? "var(--red)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

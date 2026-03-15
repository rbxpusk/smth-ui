"use client";
import { type InputHTMLAttributes, type ReactNode, useState, useId } from "react";

type InputSize = "sm" | "md" | "lg";

const inputSizes: Record<InputSize, { height: string; fontSize: string; padding: string; radius: string }> = {
  sm: { height: "34px", fontSize: "13px", padding: "0 12px", radius: "var(--radius-sm, 9px)"  },
  md: { height: "42px", fontSize: "14px", padding: "0 14px", radius: "var(--radius, 11px)"    },
  lg: { height: "50px", fontSize: "15px", padding: "0 16px", radius: "var(--radius, 13px)"    },
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  hint?:      string;
  error?:     string;
  success?:   string | boolean;
  iconLeft?:  ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  clearable?:  boolean;
  onClear?:   () => void;
  inputSize?:  InputSize;
  color?:      string;
}

export function Input({
  label, hint, error, success, iconLeft, iconRight, fullWidth,
  clearable, onClear, inputSize = "md", color = "#876cff", style, ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const hintId = useId();
  const hasError   = !!error;
  const hasSuccess = !!success && !hasError;
  const s          = inputSizes[inputSize];

  const accentColor = hasError ? "#f87171" : hasSuccess ? "#4ade80" : color;
  const borderColor = hasError
    ? "rgba(248,113,113,0.5)"
    : hasSuccess
    ? "rgba(74,222,128,0.5)"
    : focused
    ? `${accentColor}88`
    : "rgba(255,255,255,0.09)";
  const ringColor = hasError
    ? "rgba(248,113,113,0.12)"
    : hasSuccess
    ? "rgba(74,222,128,0.12)"
    : `${accentColor}20`;

  const iconPad = (side: "left" | "right") =>
    side === "left"
      ? (iconLeft ? "40px" : s.padding.split(" ")[1] ?? "14px")
      : (iconRight || (clearable && props.value) ? "40px" : s.padding.split(" ")[1] ?? "14px");

  const showClear = clearable && props.value !== undefined && String(props.value).length > 0;

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
          aria-invalid={hasError || undefined}
          aria-describedby={(hint || error || (success && typeof success === "string")) ? hintId : undefined}
          onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
          style={{
            width:        "100%",
            height:       s.height,
            padding:      `0 ${iconPad("right")} 0 ${iconLeft ? "40px" : s.padding.split(" ")[1] ?? "14px"}`,
            fontSize:     s.fontSize,
            fontFamily:   "var(--sans)",
            color:        "var(--text)",
            background:   focused
              ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
              : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
            border:       `1px solid ${borderColor}`,
            borderRadius: s.radius,
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
        {showClear ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => { onClear?.(); }}
            aria-label="Clear"
            style={{
              position:       "absolute",
              right:          "12px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          "18px",
              height:         "18px",
              borderRadius:   "50%",
              border:         "none",
              background:     "rgba(255,255,255,0.1)",
              color:          "var(--text-muted)",
              cursor:         "pointer",
              padding:        0,
              flexShrink:     0,
              transition:     "background 0.12s",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M1 1l8 8M9 1L1 9"/>
            </svg>
          </button>
        ) : iconRight ? (
          <span style={{
            position:      "absolute",
            right:         "13px",
            color:         hasSuccess ? "#4ade80" : "var(--text-muted)",
            display:       "flex",
            alignItems:    "center",
            pointerEvents: "none",
          }}>
            {iconRight}
          </span>
        ) : hasSuccess ? (
          <span style={{ position: "absolute", right: "13px", color: "#4ade80", display: "flex", alignItems: "center", pointerEvents: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </span>
        ) : null}
      </div>
      {(hint || error || (success && typeof success === "string")) && (
        <span
          id={hintId}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "5px",
            fontSize:   "12px",
            color:      error ? "var(--red, #f87171)" : hasSuccess ? "#4ade80" : "var(--text-muted)",
          }}
        >
          {error && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {error || (typeof success === "string" ? success : hint)}
        </span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:     string;
  hint?:      string;
  error?:     string;
  success?:   string | boolean;
  fullWidth?: boolean;
  color?:     string;
}

export function Textarea({ label, hint, error, success, fullWidth, color = "#876cff", style, ...props }: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const hintId    = useId();
  const hasError  = !!error;
  const hasSuccess = !!success && !hasError;

  const accentColor = hasError ? "#f87171" : hasSuccess ? "#4ade80" : color;
  const borderColor = hasError
    ? "rgba(248,113,113,0.5)"
    : hasSuccess
    ? "rgba(74,222,128,0.5)"
    : focused
    ? `${accentColor}88`
    : "rgba(255,255,255,0.09)";
  const ringColor = hasError
    ? "rgba(248,113,113,0.12)"
    : hasSuccess
    ? "rgba(74,222,128,0.12)"
    : `${accentColor}20`;

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
        aria-invalid={hasError || undefined}
        aria-describedby={(hint || error || (success && typeof success === "string")) ? hintId : undefined}
        onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        style={{
          width:        "100%",
          minHeight:    "100px",
          padding:      "12px 14px",
          fontSize:     "14px",
          fontFamily:   "var(--sans)",
          color:        "var(--text)",
          background:   focused
            ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
            : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
          border:       `1px solid ${borderColor}`,
          borderRadius: "var(--radius, 11px)",
          outline:      "none",
          resize:       "vertical",
          boxShadow:    focused
            ? `0 0 0 3px ${ringColor}, 0 1px 0 rgba(255,255,255,0.04) inset`
            : "0 1px 0 rgba(255,255,255,0.04) inset, 0 2px 8px rgba(0,0,0,0.2)",
          transition:   "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          lineHeight:   1.65,
          ...style,
        }}
        {...props}
      />
      {(hint || error || (success && typeof success === "string")) && (
        <span
          id={hintId}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "5px",
            fontSize:   "12px",
            color:      error ? "var(--red, #f87171)" : hasSuccess ? "#4ade80" : "var(--text-muted)",
          }}
        >
          {error || (typeof success === "string" ? success : hint)}
        </span>
      )}
    </div>
  );
}

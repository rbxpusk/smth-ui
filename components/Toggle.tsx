"use client";
import React, { useState, type CSSProperties, useId } from "react";
import { safeHex } from "@/lib/color";

const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
  padding: 0,
  margin: -1,
};

interface ToggleProps {
  checked:   boolean;
  onChange:  (v: boolean) => void;
  label?:    string;
  disabled?: boolean;
  size?:     "sm" | "md";
  color?:    string;
  style?:    CSSProperties;
  id?:       string;
  "data-testid"?: string;
  [key: `data-${string}`]: string | undefined;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(function Toggle({ checked, onChange, label, disabled, size = "md", color = "#876cff", style, id, ...dataProps }, ref) {
  const validColor = safeHex(color);
  const sm = size === "sm";
  const [hovered, setHovered] = useState(false);
  const w  = sm ? "32px" : "42px";
  const h  = sm ? "18px" : "24px";
  const knobSz = sm ? 12 : 16;
  const knobOff = 2;
  const knobOn  = sm ? 16 : 22;

  return (
    <label id={id} {...dataProps as Record<string, string>} style={{
      display:    "inline-flex",
      alignItems: "center",
      gap:        sm ? "8px" : "10px",
      cursor:     disabled ? "not-allowed" : "pointer",
      opacity:    disabled ? 0.45 : 1,
      userSelect: "none",
      ...style,
    }}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(!checked)}
        aria-label={label}
        style={visuallyHidden}
      />
      <div
        role="switch"
        aria-checked={checked}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position:     "relative",
          width:        w,
          height:       h,
          borderRadius: "999px",
          background:   checked
            ? `linear-gradient(90deg, ${validColor}cc, ${validColor})`
            : "rgba(255,255,255,0.08)",
          border:       `1px solid ${checked ? `${validColor}66` : "rgba(255,255,255,0.1)"}`,
          boxShadow: checked
            ? `0 0 0 3px ${validColor}22, 0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.2) inset`
            : "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.2) inset",
          transition:   "background 0.2s, border-color 0.2s, box-shadow 0.2s",
          flexShrink:   0,
        }}
      >
        <div style={{
          position:     "absolute",
          top:          "50%",
          left:         checked ? `${knobOn}px` : `${knobOff}px`,
          transform:    `translateY(-50%) scale(${hovered && !disabled ? 1.08 : 1})`,
          width:        knobSz,
          height:       knobSz,
          borderRadius: "50%",
          background:   checked ? "#fff" : "rgba(255,255,255,0.7)",
          boxShadow:    checked
            ? "0 1px 6px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)"
            : "0 1px 4px rgba(0,0,0,0.4)",
          transition:   "left 0.22s cubic-bezier(0.34,1.4,0.64,1), background 0.15s, transform 0.12s",
        }} />
      </div>
      {label && (
        <span style={{
          fontSize:   sm ? "12px" : "13px",
          fontWeight: 500,
          color:      checked ? "var(--text)" : "var(--text-sub)",
          transition: "color 0.15s",
        }}>
          {label}
        </span>
      )}
    </label>
  );
});

Toggle.displayName = "Toggle";

interface CheckboxProps {
  checked:   boolean;
  onChange:  (v: boolean) => void;
  label?:    string;
  disabled?: boolean;
  color?:    string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ checked, onChange, label, disabled, color = "#876cff" }, ref) {
  const validColor = safeHex(color);
  const [hovered, setHovered] = useState(false);
  const uid = useId();

  return (
    <>
      <style>{`
        @keyframes smth-check-pop-${uid.replace(/:/g,"")} {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          50%  { transform: scale(1.2) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes smth-box-pop-${uid.replace(/:/g,"")} {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
      `}</style>
      <label style={{
        display:    "inline-flex",
        alignItems: "center",
        gap:        "9px",
        cursor:     disabled ? "not-allowed" : "pointer",
        opacity:    disabled ? 0.45 : 1,
        userSelect: "none",
      }}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={() => onChange(!checked)}
          aria-label={label}
          style={visuallyHidden}
        />
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width:          "18px",
            height:         "18px",
            borderRadius:   "5px",
            background:     checked
              ? `linear-gradient(180deg, ${validColor}cc 0%, ${validColor} 100%)`
              : hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
            border:         `1px solid ${checked ? `${validColor}88` : "rgba(255,255,255,0.12)"}`,
            boxShadow:      checked
              ? `0 0 0 3px ${validColor}22, 0 1px 0 rgba(255,255,255,0.18) inset, 0 -1px 0 rgba(0,0,0,0.2) inset`
              : "0 1px 0 rgba(255,255,255,0.05) inset",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
            transition:     "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            animation:      checked ? `smth-box-pop-${uid.replace(/:/g,"")} 0.25s cubic-bezier(0.34,1.4,0.64,1)` : undefined,
          }}
        >
          {checked && (
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{
                animation: `smth-check-pop-${uid.replace(/:/g,"")} 0.3s cubic-bezier(0.34,1.4,0.64,1) both`,
              }}
            >
              <path d="m1.5 5 2.5 2.5 4.5-4.5"/>
            </svg>
          )}
        </div>
        {label && (
          <span style={{
            fontSize:   "13px",
            fontWeight: 500,
            color:      checked ? "var(--text)" : "var(--text-sub)",
            transition: "color 0.15s",
          }}>
            {label}
          </span>
        )}
      </label>
    </>
  );
});

Checkbox.displayName = "Checkbox";

interface RadioProps {
  checked:   boolean;
  onChange:  () => void;
  label?:    string;
  disabled?: boolean;
  color?:    string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio({ checked, onChange, label, disabled, color = "#876cff" }, ref) {
  const validColor = safeHex(color);
  const [hovered, setHovered] = useState(false);
  const uid = useId();

  return (
    <>
      <style>{`
        @keyframes smth-radio-dot-${uid.replace(/:/g,"")} {
          0%   { transform: scale(0); opacity: 0; }
          50%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes smth-radio-ring-${uid.replace(/:/g,"")} {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
      <label style={{
        display:    "inline-flex",
        alignItems: "center",
        gap:        "9px",
        cursor:     disabled ? "not-allowed" : "pointer",
        opacity:    disabled ? 0.45 : 1,
        userSelect: "none",
      }}>
        <input
          ref={ref}
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={() => onChange()}
          aria-label={label}
          style={visuallyHidden}
        />
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width:          "18px",
            height:         "18px",
            borderRadius:   "50%",
            background:     checked ? `${validColor}22` : hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
            border:         `1.5px solid ${checked ? validColor : "rgba(255,255,255,0.14)"}`,
            boxShadow:      checked ? `0 0 0 3px ${validColor}22` : "none",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
            transition:     "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            animation:      checked ? `smth-radio-ring-${uid.replace(/:/g,"")} 0.25s cubic-bezier(0.34,1.4,0.64,1)` : undefined,
          }}
        >
          {checked && (
            <div style={{
              width:        "8px",
              height:       "8px",
              borderRadius: "50%",
              background:   validColor,
              boxShadow:    `0 0 8px ${validColor}88`,
              animation:    `smth-radio-dot-${uid.replace(/:/g,"")} 0.3s cubic-bezier(0.34,1.4,0.64,1) both`,
            }} />
          )}
        </div>
        {label && (
          <span style={{
            fontSize:   "13px",
            fontWeight: 500,
            color:      checked ? "var(--text)" : "var(--text-sub)",
            transition: "color 0.15s",
          }}>
            {label}
          </span>
        )}
      </label>
    </>
  );
});

Radio.displayName = "Radio";

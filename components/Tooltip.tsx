"use client";
import { type ReactNode, useRef, useState, useId } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content:    ReactNode;
  children:   ReactNode;
  placement?: TooltipPlacement;
  delay?:     number;
  disabled?:  boolean;
}

const posStyles: Record<TooltipPlacement, React.CSSProperties> = {
  top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
  bottom: { top:    "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
  left:   { right:  "calc(100% + 8px)", top:  "50%", transform: "translateY(-50%)" },
  right:  { left:   "calc(100% + 8px)", top:  "50%", transform: "translateY(-50%)" },
};

const fadeOffset: Record<TooltipPlacement, string> = {
  top:    "translateY(4px)",
  bottom: "translateY(-4px)",
  left:   "translateX(4px)",
  right:  "translateX(-4px)",
};

export function Tooltip({ content, children, placement = "top", delay = 0, disabled = false }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timer = useRef<any>(null);
  const id    = useId();

  const show = () => {
    if (disabled) return;
    timer.current = setTimeout(() => { setVisible(true); setEntered(true); }, delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
    setEntered(false);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Wrap children to add aria-describedby when visible */}
      <span
        aria-describedby={visible ? id : undefined}
        style={{ display: "contents" }}
      >
        {children}
      </span>
      {visible && (
        <div style={{ position: "absolute", ...posStyles[placement], zIndex: 1000, pointerEvents: "none" }}>
          <div
            id={id}
            role="tooltip"
            style={{
              whiteSpace:   "nowrap",
              padding:      "7px 11px",
              borderRadius: "var(--radius-sm, 9px)",
              fontSize:     "12px",
              fontWeight:   600,
              color:        "var(--text, #e8e8e8)",
              background:   "linear-gradient(170deg, var(--surface-hi, #1c1c1c) 0%, var(--surface, #111111) 100%)",
              boxShadow:    "0 0 0 1px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.35) inset, 0 8px 24px rgba(0,0,0,0.6)",
              animation:    entered ? `tooltip-fade-in 0.15s cubic-bezier(0.22,1,0.36,1) both` : undefined,
            }}
          >
            {content}
          </div>
        </div>
      )}
      <style>{`
        @keyframes tooltip-fade-in {
          from { opacity: 0; transform: ${fadeOffset[placement]}; }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

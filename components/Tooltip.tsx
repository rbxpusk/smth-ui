"use client";
import { type ReactNode, useRef, useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content:    ReactNode;
  children:   ReactNode;
  placement?: TooltipPlacement;
  delay?:     number;
  disabled?:  boolean;
}

const fadeOffset: Record<TooltipPlacement, string> = {
  top:    "translateY(4px)",
  bottom: "translateY(-4px)",
  left:   "translateX(4px)",
  right:  "translateX(-4px)",
};

export function Tooltip({ content, children, placement = "top", delay = 0, disabled = false }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timer = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const id    = useId();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    return () => { clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    if (!visible || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // We need a frame to measure the tooltip
    requestAnimationFrame(() => {
      const tooltipEl = tooltipRef.current;
      const tw = tooltipEl?.offsetWidth ?? 0;
      const th = tooltipEl?.offsetHeight ?? 0;
      let top = 0;
      let left = 0;
      switch (placement) {
        case "top":
          top = rect.top - th - 8;
          left = rect.left + rect.width / 2 - tw / 2;
          break;
        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tw / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - th / 2;
          left = rect.left - tw - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2 - th / 2;
          left = rect.right + 8;
          break;
      }
      setPos({ top, left });
    });
  }, [visible, placement]);

  const show = () => {
    if (disabled) return;
    timer.current = setTimeout(() => { setVisible(true); setEntered(true); }, delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
    setEntered(false);
  };

  const tooltipNode = visible ? (
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 1200,
        pointerEvents: "none",
      }}
    >
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
          background:   "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
          boxShadow:    "0 0 0 1px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.35) inset, 0 8px 24px rgba(0,0,0,0.6)",
          animation:    entered ? `tooltip-fade-in 0.15s cubic-bezier(0.22,1,0.36,1) both` : undefined,
        }}
      >
        {content}
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={wrapperRef}
      style={{ display: "inline-flex" }}
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
      {mounted && tooltipNode ? createPortal(tooltipNode, document.body) : null}
      <style>{`
        @keyframes tooltip-fade-in {
          from { opacity: 0; transform: ${fadeOffset[placement]}; }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

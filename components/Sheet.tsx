"use client";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { safeHex, hexToRgbString } from "@/lib/color";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type SheetHeight = "sm" | "md" | "lg" | "full";

interface SheetProps {
  open:      boolean;
  onClose:   () => void;
  title?:    string;
  children:  ReactNode;
  footer?:   ReactNode;
  height?:   SheetHeight;
  color?:    string;
}

const heights: Record<SheetHeight, string> = {
  sm:   "30vh",
  md:   "50vh",
  lg:   "75vh",
  full: "90vh",
};

const DISMISS_THRESHOLD = 80;
const SPRING = "cubic-bezier(0.22,1,0.36,1)";
const SPRING_BOUNCY = "cubic-bezier(0.34,1.56,0.64,1)";

export function Sheet({
  open, onClose, title, children, footer, height = "md", color = "#876cff",
}: SheetProps) {
  const accent = safeHex(color);
  const accentRgb = hexToRgbString(accent);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Drag via refs — no re-renders during drag
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const isDragging = useRef(false);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Reset animDone when sheet opens
  useEffect(() => {
    if (open) setAnimDone(false);
  }, [open]);

  // Clear animation after entry completes so drag transform works
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open || closing) return;
    function onEnd(e: AnimationEvent) {
      if (e.animationName === "sheet-in") {
        setAnimDone(true);
      }
    }
    panel.addEventListener("animationend", onEnd);
    return () => panel.removeEventListener("animationend", onEnd);
  }, [open, closing]);

  useEffect(() => {
    if (!open) return;
    setClosing(false);
    document.body.style.overflow = "hidden";

    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open || !sheetRef.current) return;
    const sheet = sheetRef.current;
    const focusable = sheet.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    sheet.addEventListener("keydown", onKeyDown);
    return () => sheet.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    return () => { clearTimeout(closeTimerRef.current); };
  }, []);

  function handleClose() {
    setClosing(true);
    closeTimerRef.current = setTimeout(() => { setClosing(false); onClose(); }, 320);
  }

  // Ref to always get latest handleClose
  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  // Drag-to-dismiss with document-level pointer tracking
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle || !open) return;

    function onDown(e: PointerEvent) {
      e.preventDefault();
      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragCurrentY.current = 0;

      // Set grab cursor
      if (handleRef.current) handleRef.current.style.cursor = "grabbing";

      function onMove(ev: PointerEvent) {
        if (!isDragging.current) return;
        const delta = Math.max(0, ev.clientY - dragStartY.current);
        dragCurrentY.current = delta;

        // Apply rubber-band resistance after threshold
        const resistance = delta > DISMISS_THRESHOLD ? 0.4 : 1;
        const displayDelta = delta > DISMISS_THRESHOLD
          ? DISMISS_THRESHOLD + (delta - DISMISS_THRESHOLD) * resistance
          : delta;

        if (panelRef.current) {
          panelRef.current.style.transform = `translateY(${displayDelta}px)`;
          panelRef.current.style.transition = "none";
        }
        if (backdropRef.current) {
          const opacity = Math.max(0, 1 - displayDelta / 400);
          backdropRef.current.style.opacity = String(opacity);
          backdropRef.current.style.transition = "none";
        }
      }

      function onUp() {
        isDragging.current = false;
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);

        if (handleRef.current) handleRef.current.style.cursor = "grab";

        if (dragCurrentY.current >= DISMISS_THRESHOLD) {
          // Dismiss: slide all the way down
          if (panelRef.current) {
            panelRef.current.style.transition = `transform 0.32s ${SPRING}`;
            panelRef.current.style.transform = "translateY(100%)";
          }
          if (backdropRef.current) {
            backdropRef.current.style.transition = "opacity 0.28s ease-out";
            backdropRef.current.style.opacity = "0";
          }
          // Call close after the slide-down finishes
          setTimeout(() => {
            handleCloseRef.current();
          }, 50);
        } else {
          // Snap back with a bouncy spring
          if (panelRef.current) {
            panelRef.current.style.transition = `transform 0.45s ${SPRING_BOUNCY}`;
            panelRef.current.style.transform = "translateY(0px)";
          }
          if (backdropRef.current) {
            backdropRef.current.style.transition = "opacity 0.35s ease-out";
            backdropRef.current.style.opacity = "1";
          }
        }
        dragCurrentY.current = 0;
      }

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    }

    handle.addEventListener("pointerdown", onDown);
    return () => handle.removeEventListener("pointerdown", onDown);
  }, [open]);

  if (!open || !mounted) return null;

  const sheetNode = (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position:             "fixed",
        inset:                0,
        zIndex:               1000,
        display:              "flex",
        alignItems:           "flex-end",
        justifyContent:       "center",
      }}
    >
      <style>{`
        @keyframes sheet-bg-in {
          from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        }
        @keyframes sheet-bg-out {
          from { opacity: 1; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
          to   { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
        }
        @keyframes sheet-in {
          0%   { transform: translateY(100%); opacity: 0; }
          40%  { opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes sheet-out {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes sheet-handle-glow {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 0.45; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        style={{
          position:             "absolute",
          inset:                0,
          background:           "color-mix(in srgb, var(--bg, #08070d) 85%, transparent)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          animation: closing
            ? "sheet-bg-out 0.28s ease-out both"
            : "sheet-bg-in 0.3s ease-out both",
        }}
      />

      <div
        ref={panelRef}
        style={{
          position:      "relative",
          overflow:      "hidden",
          width:         "100%",
          maxWidth:      "600px",
          maxHeight:     heights[height],
          display:       "flex",
          flexDirection: "column",
          borderRadius:  "var(--radius-lg, 24px) var(--radius-lg, 24px) 0 0",
          background:    "linear-gradient(175deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 60%, var(--surface-lo, var(--bg, #0a0a0a)) 100%)",
          boxShadow: [
            `0 0 0 1px rgba(${accentRgb},0.12)`,
            "0 2px 0 rgba(255,255,255,0.07) inset",
            `0 -32px 80px rgba(0,0,0,0.8)`,
            `0 -8px 32px rgba(0,0,0,0.5)`,
            `0 0 60px rgba(${accentRgb},0.06)`,
          ].join(", "),
          animation: closing
            ? "sheet-out 0.3s cubic-bezier(0.4,0,1,1) both"
            : animDone
              ? "none"
              : `sheet-in 0.4s ${SPRING} both`,
          zIndex: 1,
          willChange: "transform",
        }}
      >
        {/* Noise overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "128px", opacity: 0.028, pointerEvents: "none", zIndex: 0 }} />

        {/* Top specular line */}
        <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(90deg,transparent,rgba(${accentRgb},0.2),transparent)`, pointerEvents: "none", zIndex: 1 }} />

        {/* Drag handle */}
        <div
          ref={handleRef}
          style={{
            position:       "relative",
            zIndex:         2,
            display:        "flex",
            justifyContent: "center",
            padding:        "14px 0 6px",
            cursor:         "grab",
            touchAction:    "none",
          }}
        >
          <div style={{
            width:        "36px",
            height:       "4px",
            borderRadius: "9999px",
            background:   `rgba(${accentRgb},0.4)`,
            boxShadow:    `0 0 8px rgba(${accentRgb},0.15)`,
            animation:    "sheet-handle-glow 3s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        </div>

        {/* Header */}
        {title && (
          <>
            <div style={{
              position:       "relative",
              zIndex:         2,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "8px 24px 16px",
            }}>
              <h2 style={{
                fontSize:      "15px",
                fontWeight:    800,
                color:         "var(--text)",
                letterSpacing: "-0.025em",
                lineHeight:    1.2,
              }}>
                {title}
              </h2>
              <SheetCloseBtn onClick={handleClose} accentRgb={accentRgb} />
            </div>

            <div style={{
              position:   "relative",
              zIndex:     2,
              height:     "1px",
              margin:     "0 1px",
              background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.12) 20%, rgba(${accentRgb},0.12) 80%, transparent)`,
            }} />
          </>
        )}

        {/* Scrollable body */}
        <div style={{
          flex:      1,
          overflowY: "auto",
          padding:   "24px",
          position:  "relative",
          zIndex:    2,
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <>
            <div style={{
              position:   "relative",
              zIndex:     2,
              height:     "1px",
              margin:     "0 1px",
              background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.1) 20%, rgba(${accentRgb},0.1) 80%, transparent)`,
            }} />
            <div style={{
              position:       "relative",
              zIndex:         2,
              padding:        "16px 24px",
              display:        "flex",
              justifyContent: "flex-end",
              gap:            "8px",
              background:     "rgba(0,0,0,0.15)",
            }}>
              {footer}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(sheetNode, document.body);
}

function SheetCloseBtn({ onClick, accentRgb }: { onClick: () => void; accentRgb: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      aria-label="Close"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          "30px",
        height:         "30px",
        borderRadius:   "var(--radius-sm, 8px)",
        flexShrink:     0,
        background:     hovered ? `rgba(${accentRgb},0.1)` : "rgba(255,255,255,0.04)",
        border:         `1px solid ${hovered ? `rgba(${accentRgb},0.2)` : "rgba(255,255,255,0.08)"}`,
        color:          hovered ? "var(--text)" : "var(--text-sub)",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "background 0.15s, color 0.15s, transform 0.15s, border-color 0.15s",
        transform:      hovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  );
}

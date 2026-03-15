"use client";
import { type ReactNode, useEffect, useState } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface DrawerProps {
  open:      boolean;
  onClose:   () => void;
  title?:    string;
  side?:     "right" | "left";
  width?:    string;
  children:  ReactNode;
  footer?:   ReactNode;
}

export function Drawer({
  open, onClose, title, side = "right", width = "400px", children, footer,
}: DrawerProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setClosing(false);
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function handleClose() {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 220);
  }

  if (!open) return null;

  const slideIn  = side === "right" ? "drawer-in-right"  : "drawer-in-left";
  const slideOut = side === "right" ? "drawer-out-right" : "drawer-out-left";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position:         "fixed", inset: 0, zIndex: 300,
        background:       "rgba(4,3,9,0.7)",
        backdropFilter:   "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation:        closing ? "modal-bg-out 0.22s ease both" : "modal-bg-in 0.2s ease both",
      }}
    >
      <style>{`
        @keyframes modal-bg-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes modal-bg-out { from { opacity:1 } to { opacity:0 } }
        @keyframes drawer-in-right  { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes drawer-out-right { from { transform:translateX(0) }    to { transform:translateX(100%) } }
        @keyframes drawer-in-left   { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        @keyframes drawer-out-left  { from { transform:translateX(0) }    to { transform:translateX(-100%) } }
      `}</style>

      <div style={{
        position:   "absolute",
        top:        0,
        bottom:     0,
        [side]:     0,
        width,
        maxWidth:   "100vw",
        borderRadius: side === "right" ? "var(--radius-lg, 20px) 0 0 var(--radius-lg, 20px)" : "0 var(--radius-lg, 20px) var(--radius-lg, 20px) 0",
        display:    "flex",
        flexDirection: "column",
        overflow:   "hidden",
        background: "linear-gradient(180deg, #1e1c2e 0%, #131122 100%)",
        boxShadow:  side === "right"
          ? "-1px 0 0 rgba(255,255,255,0.07), -20px 0 60px rgba(0,0,0,0.6)"
          : "1px 0 0 rgba(255,255,255,0.07), 20px 0 60px rgba(0,0,0,0.6)",
        animation:  closing
          ? `${slideOut} 0.22s cubic-bezier(0.4,0,1,1) both`
          : `${slideIn}  0.28s cubic-bezier(0.22,1,0.36,1) both`,
      }}>
        {/* Noise */}
        <div style={{ position:"absolute", inset:0, backgroundImage:NOISE, backgroundSize:"128px", opacity:0.02, pointerEvents:"none" }} />

        {/* Header */}
        {title && (
          <>
            <div style={{
              position:       "relative",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "20px 24px",
              borderBottom:   "1px solid rgba(255,255,255,0.07)",
            }}>
              <h2 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.025em" }}>
                {title}
              </h2>
              <DrawerCloseBtn onClick={handleClose} />
            </div>
          </>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", position: "relative" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            position:       "relative",
            padding:        "16px 24px",
            borderTop:      "1px solid rgba(255,255,255,0.06)",
            display:        "flex",
            justifyContent: "flex-end",
            gap:            "8px",
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function DrawerCloseBtn({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "30px", height: "30px", borderRadius: "8px",
        background: hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: hovered ? "var(--text)" : "var(--text-sub)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  );
}

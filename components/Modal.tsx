"use client";
import { type ReactNode, useEffect, useState } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  subtitle?:  string;
  children:   ReactNode;
  footer?:    ReactNode;
  size?:      "sm" | "md" | "lg";
  icon?:      ReactNode;
  iconColor?: string;
}

const modalWidths = { sm: "400px", md: "520px", lg: "680px" };

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

export function Modal({
  open, onClose, title, subtitle, children, footer,
  size = "md", icon, iconColor = "#876cff",
}: ModalProps) {
  const [closing, setClosing] = useState(false);
  const [r,g,b] = hexToRgb(iconColor);

  useEffect(() => {
    if (!open) return;
    setClosing(false);
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function handleClose() {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 180);
  }

  if (!open) return null;

  const hasHeader = title || icon;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position:             "fixed", inset: 0, zIndex: 1000,
        display:              "flex", alignItems: "center", justifyContent: "center",
        padding:              "20px",
        background:           "rgba(4,3,9,0.75)",
        backdropFilter:       "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation:            closing ? "mbg-out 0.18s ease both" : "mbg-in 0.2s ease both",
      }}
    >
      <style>{`
        @keyframes mbg-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes mbg-out { from { opacity:1 } to { opacity:0 } }
        @keyframes m-in  { from { opacity:0; transform:translateY(20px) scale(0.96) } to { opacity:1; transform:none } }
        @keyframes m-out { from { opacity:1; transform:none } to { opacity:0; transform:translateY(10px) scale(0.97) } }
      `}</style>

      <div style={{
        position:   "relative",
        overflow:   "hidden",
        width:      "100%",
        maxWidth:   modalWidths[size],
        borderRadius: "var(--radius-lg, 24px)",
        background: "linear-gradient(175deg, var(--surface-hi, #1c1c1c) 0%, var(--surface, #111111) 60%, var(--surface-lo, #0a0a0a) 100%)",
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.1)",
          "0 2px 0 rgba(255,255,255,0.07) inset",
          "0 -1px 0 rgba(0,0,0,0.6) inset",
          "0 32px 80px rgba(0,0,0,0.8)",
          "0 8px 32px rgba(0,0,0,0.5)",
          icon ? `0 0 80px rgba(${r},${g},${b},0.08)` : "",
        ].filter(Boolean).join(", "),
        animation:  closing
          ? "m-out 0.18s cubic-bezier(0.4,0,1,1) both"
          : "m-in  0.26s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        {/* Noise overlay */}
        <div style={{ position:"absolute", inset:0, backgroundImage:NOISE, backgroundSize:"128px", opacity:0.028, pointerEvents:"none", zIndex:0 }} />

        {/* Top specular line */}
        <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent)", pointerEvents:"none", zIndex:1 }} />

        {/* Ambient color wash behind icon */}
        {icon && (
          <div style={{
            position:   "absolute",
            top:        "-60px",
            left:       "50%",
            transform:  "translateX(-50%)",
            width:      "280px",
            height:     "220px",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(${r},${g},${b},0.14) 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex:     0,
          }} />
        )}

        {/* ── Header ── */}
        {hasHeader && (
          <>
            <div style={{
              position:       "relative",
              zIndex:         2,
              display:        "flex",
              flexDirection:  icon ? "column" : "row",
              alignItems:     icon ? "center" : "flex-start",
              gap:            icon ? "14px" : "12px",
              padding:        icon ? "32px 28px 24px" : "22px 22px 18px",
              textAlign:      icon ? "center" : "left",
            }}>
              {/* Icon */}
              {icon && (
                <div style={{
                  width:          "52px",
                  height:         "52px",
                  borderRadius:   "16px",
                  flexShrink:     0,
                  background:     `linear-gradient(170deg, rgba(${r},${g},${b},0.22) 0%, rgba(${r},${g},${b},0.12) 100%)`,
                  border:         `1px solid rgba(${r},${g},${b},0.35)`,
                  boxShadow: [
                    "0 1px 0 rgba(255,255,255,0.08) inset",
                    "0 -1px 0 rgba(0,0,0,0.3) inset",
                    `0 6px 20px rgba(${r},${g},${b},0.22)`,
                  ].join(", "),
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  color:          iconColor,
                }} >
                  {icon}
                </div>
              )}

              {/* Title + subtitle */}
              <div style={{ flex: icon ? undefined : 1, minWidth: 0 }}>
                {title && (
                  <h2 style={{
                    fontSize:      "16px",
                    fontWeight:    800,
                    color:         "var(--text)",
                    letterSpacing: "-0.03em",
                    lineHeight:    1.2,
                  }}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p style={{
                    fontSize:   "13px",
                    color:      "var(--text-sub)",
                    marginTop:  "5px",
                    lineHeight: 1.6,
                    maxWidth:   icon ? "340px" : undefined,
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Close button — top-right absolute when icon-centered layout */}
              {icon ? (
                <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                  <ModalCloseButton onClick={handleClose} />
                </div>
              ) : (
                <ModalCloseButton onClick={handleClose} />
              )}
            </div>

            {/* Gradient divider */}
            <div style={{
              position:   "relative",
              zIndex:     2,
              height:     "1px",
              margin:     "0 1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
            }} />
          </>
        )}

        {/* ── Body ── */}
        <div style={{ padding: "24px 28px", position: "relative", zIndex: 2 }}>
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <>
            <div style={{
              position:   "relative",
              zIndex:     2,
              height:     "1px",
              margin:     "0 1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
            }} />
            <div style={{
              position:       "relative",
              zIndex:         2,
              padding:        "16px 28px",
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
}

function ModalCloseButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          "30px",
        height:         "30px",
        borderRadius:   "9px",
        flexShrink:     0,
        background:     hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
        border:         "1px solid rgba(255,255,255,0.08)",
        color:          hovered ? "var(--text)" : "var(--text-muted)",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "background 0.15s, color 0.15s",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  );
}

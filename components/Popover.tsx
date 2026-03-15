"use client";
import { type ReactNode, useRef, useState, useEffect } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type PopoverPlacement = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  trigger:    ReactNode;
  content:    ReactNode;
  placement?: PopoverPlacement;
  title?:     string;
  width?:     string;
}

const pos: Record<PopoverPlacement, React.CSSProperties> = {
  bottom: { top:    "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
  top:    { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" },
  right:  { left:   "calc(100% + 10px)", top:  "50%", transform: "translateY(-50%)" },
  left:   { right:  "calc(100% + 10px)", top:  "50%", transform: "translateY(-50%)" },
};

export function Popover({ trigger, content, placement = "bottom", title, width = "260px" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function key(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", key); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={() => setOpen(v => !v)} style={{ cursor: "pointer" }}>
        {trigger}
      </div>

      {open && (
        <div style={{
          position: "absolute",
          ...pos[placement],
          zIndex:   150,
          width,
        }}>
          <div style={{
            position:     "relative",
            overflow:     "hidden",
            borderRadius: "var(--radius, 14px)",
            background:   "linear-gradient(170deg, #222036 0%, #161328 100%)",
            boxShadow:    "0 0 0 1px rgba(255,255,255,0.1), 0 2px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 16px 48px rgba(0,0,0,0.7)",
            animation:    "popover-in 0.18s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            <style>{`
              @keyframes popover-in { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
            `}</style>
            {/* Noise */}
            <div style={{ position:"absolute", inset:0, backgroundImage:NOISE, backgroundSize:"128px", opacity:0.022, pointerEvents:"none" }} />
            {/* Specular */}
            <div style={{ position:"absolute", top:0, left:"12%", right:"12%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)", pointerEvents:"none" }} />

            <div style={{ position: "relative", padding: "14px 16px" }}>
              {title && (
                <p style={{
                  fontSize:     "12px",
                  fontWeight:   800,
                  color:        "var(--text)",
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}>
                  {title}
                </p>
              )}
              <div style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: 1.65 }}>
                {content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

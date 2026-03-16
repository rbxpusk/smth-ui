"use client";
import { type ReactNode, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type PopoverPlacement = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  trigger:    ReactNode;
  content:    ReactNode;
  placement?: PopoverPlacement;
  title?:     string;
  width?:     string;
}

export function Popover({ trigger, content, placement = "bottom", title, width = "260px" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function key(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", key); };
  }, [open]);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const s: React.CSSProperties = { position: "fixed", zIndex: 1100 };
    switch (placement) {
      case "bottom":
        s.top = rect.bottom + 10;
        s.left = rect.left + rect.width / 2;
        s.transform = "translateX(-50%)";
        break;
      case "top":
        s.bottom = window.innerHeight - rect.top + 10;
        s.left = rect.left + rect.width / 2;
        s.transform = "translateX(-50%)";
        break;
      case "right":
        s.left = rect.right + 10;
        s.top = rect.top + rect.height / 2;
        s.transform = "translateY(-50%)";
        break;
      case "left":
        s.right = window.innerWidth - rect.left + 10;
        s.top = rect.top + rect.height / 2;
        s.transform = "translateY(-50%)";
        break;
    }
    setPos(s);
    setOpen(true);
  }

  const popoverNode = open ? (
    <div ref={popoverRef} style={{ ...pos, width }}>
      <div style={{
        position:     "relative",
        overflow:     "hidden",
        borderRadius: "var(--radius, 14px)",
        background:   "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
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
  ) : null;

  return (
    <div ref={triggerRef} style={{ display: "inline-flex" }}>
      <div onClick={toggle} style={{ cursor: "pointer" }}>
        {trigger}
      </div>
      {mounted && popoverNode ? createPortal(popoverNode, document.body) : null}
    </div>
  );
}

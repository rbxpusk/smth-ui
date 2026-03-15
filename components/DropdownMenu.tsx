"use client";
import { type ReactNode, useState, useRef, useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export interface MenuItem {
  id:        string;
  label:     ReactNode;
  icon?:     ReactNode;
  shortcut?: string;
  danger?:   boolean;
  disabled?: boolean;
  divider?:  boolean;  // renders a hairline separator BEFORE this item
}

interface DropdownMenuProps {
  trigger:   ReactNode;
  items:     MenuItem[];
  onSelect?: (id: string) => void;
  align?:    "left" | "right";
}

export function DropdownMenu({ trigger, items, onSelect, align = "left" }: DropdownMenuProps) {
  const [open,    setOpen]    = useState(false);
  const [style,   setStyle]   = useState<CSSProperties>({});
  const [dir,     setDir]     = useState<"down" | "up">("down");
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  function openMenu() {
    if (!triggerRef.current) return;
    if (open) { setOpen(false); return; }

    const rect  = triggerRef.current.getBoundingClientRect();
    // Estimate menu height: ~38px per item + dividers at ~5px + 16px padding
    const estH  = items.reduce((n, i) => n + (i.divider ? 5 : 38), 16);
    const below = window.innerHeight - rect.bottom;
    const goUp  = below < estH + 16 && rect.top > estH + 16;

    const s: CSSProperties = { position: "fixed", zIndex: 9999 };
    if (goUp) {
      s.bottom = window.innerHeight - rect.top + 6;
    } else {
      s.top = rect.bottom + 6;
    }
    if (align === "right") {
      s.right = window.innerWidth - rect.right;
    } else {
      s.left = rect.left;
    }

    setStyle(s);
    setDir(goUp ? "up" : "down");
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (
        menuRef.current    && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onScroll(e: Event) {
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown",   onKey);
    window.addEventListener("scroll",      onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown",   onKey);
      window.removeEventListener("scroll",      onScroll, true);
    };
  }, [open]);

  const menuNode = open ? (
    <div
      ref={menuRef}
      style={{
        ...style,
        minWidth:     "200px",
        borderRadius: "var(--radius, 14px)",
        overflow:     "hidden",
        background:   "linear-gradient(170deg, var(--surface-hi, #1c1c1c) 0%, var(--surface, #111111) 100%)",
        boxShadow:    "0 0 0 1px rgba(255,255,255,0.1), 0 2px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 16px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)",
        animation:    `smth-menu-${dir} 0.16s cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      <style>{`
        @keyframes smth-menu-down { from { opacity:0; transform:translateY(-6px) scale(0.97) } to { opacity:1; transform:none } }
        @keyframes smth-menu-up   { from { opacity:0; transform:translateY(6px)  scale(0.97) } to { opacity:1; transform:none } }
      `}</style>
      <div style={{ position:"absolute", inset:0, backgroundImage:NOISE, backgroundSize:"128px", opacity:0.02, pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)", pointerEvents:"none" }} />
      <div style={{ padding: "5px", position: "relative" }}>
        {items.map(item => (
          <div key={item.id}>
            {item.divider && (
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
            )}
            <MenuRow
              item={item}
              onSelect={() => {
                if (item.disabled) return;
                setOpen(false);
                onSelect?.(item.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div ref={triggerRef} style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={openMenu} style={{ cursor: "pointer" }}>
        {trigger}
      </div>
      {mounted && menuNode ? createPortal(menuNode, document.body) : null}
    </div>
  );
}

function MenuRow({ item, onSelect }: { item: MenuItem; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      disabled={item.disabled}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          "100%",
        display:        "flex",
        alignItems:     "center",
        gap:            "9px",
        padding:        "8px 10px",
        borderRadius:   "var(--radius-sm, 9px)",
        background:     hovered && !item.disabled
          ? item.danger ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.07)"
          : "transparent",
        border:         "none",
        cursor:         item.disabled ? "not-allowed" : "pointer",
        opacity:        item.disabled ? 0.4 : 1,
        textAlign:      "left",
        transition:     "background 0.12s",
      }}
    >
      {item.icon && (
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "18px", height: "18px", flexShrink: 0,
          color: item.danger ? "#f87171" : "var(--text-muted)",
        }}>
          {item.icon}
        </span>
      )}
      <span style={{
        flex: 1, fontSize: "13px", fontWeight: 500,
        color: item.danger ? "#f87171" : "var(--text)",
        whiteSpace: "nowrap",
      }}>
        {item.label}
      </span>
      {item.shortcut && (
        <span style={{
          fontSize: "10px", fontFamily: "var(--mono)", fontWeight: 600,
          color: "var(--text-muted)", letterSpacing: "0.05em", whiteSpace: "nowrap",
        }}>
          {item.shortcut}
        </span>
      )}
    </button>
  );
}

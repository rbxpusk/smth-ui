"use client";
import React, { useState, useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "./Avatar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationItem {
  id:      string;
  title:   string;
  body?:   string;
  time:    string;
  read?:   boolean;
  type?:   "info" | "success" | "warning" | "error";
  avatar?: string;   // name → Avatar initials
  icon?:   ReactNode;
}

interface NotificationsProps {
  items:       NotificationItem[];
  onRead?:     (id: string) => void;
  onReadAll?:  () => void;
  onDismiss?:  (id: string) => void;
  color?:      string;
  align?:      "left" | "right";
  trigger?:    ReactNode;   // custom trigger; default = bell button
  maxHeight?:  number;
  emptyText?:  string;
}

// ─── Type colors ──────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<NonNullable<NotificationItem["type"]>, string> = {
  info:    "#60a5fa",
  success: "#4ade80",
  warning: "#fbbf24",
  error:   "#f87171",
};

const TYPE_ICON: Record<NonNullable<NotificationItem["type"]>, ReactNode> = {
  info: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
  success: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="M22 4 12 14.01l-3-3"/>
    </svg>
  ),
  warning: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  error: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M15 9l-6 6M9 9l6 6"/>
    </svg>
  ),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export function Notifications({
  items,
  onRead,
  onReadAll,
  onDismiss,
  color    = "#876cff",
  align    = "right",
  trigger,
  maxHeight = 380,
  emptyText = "You're all caught up.",
}: NotificationsProps) {
  const [open,    setOpen]    = useState(false);
  const [style,   setStyle]   = useState<CSSProperties>({});
  const [dir,     setDir]     = useState<"down" | "up">("down");
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const unread = items.filter(n => !n.read).length;

  function openPanel() {
    if (!triggerRef.current) return;
    if (open) { setOpen(false); return; }

    const rect  = triggerRef.current.getBoundingClientRect();
    const estH  = Math.min(maxHeight + 60, items.length * 72 + 120);
    const below = window.innerHeight - rect.bottom;
    const goUp  = below < estH + 16 && rect.top > estH + 16;

    const s: CSSProperties = { position: "fixed", zIndex: 9999 };
    if (goUp) { s.bottom = window.innerHeight - rect.top + 6; }
    else      { s.top    = rect.bottom + 6; }
    if (align === "right") { s.right = window.innerWidth - rect.right; }
    else                   { s.left  = rect.left; }

    setStyle(s);
    setDir(goUp ? "up" : "down");
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (
        panelRef.current   && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onScroll(e: Event) {
      if (panelRef.current?.contains(e.target as Node)) return;
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

  // ── Default bell trigger ──
  const defaultTrigger = (
    <BellButton unread={unread} color={color} />
  );

  // ── Panel ──
  const panel = open ? (
    <div
      ref={panelRef}
      style={{
        ...style,
        width:        "340px",
        borderRadius: "var(--radius-lg, 14px)",
        overflow:     "hidden",
        background:   "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
        boxShadow:    "0 0 0 1px rgba(255,255,255,0.09), 0 -1px 0 rgba(0,0,0,0.4) inset, 0 24px 60px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.5)",
        animation:    `smth-notif-${dir} 0.18s cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      <style>{`
        @keyframes smth-notif-down { from { opacity:0; transform:translateY(-8px) scale(0.97) } to { opacity:1; transform:none } }
        @keyframes smth-notif-up   { from { opacity:0; transform:translateY(8px)  scale(0.97) } to { opacity:1; transform:none } }
      `}</style>

      {/* Header */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "14px 16px 12px",
        borderBottom:   "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text, #fff)", letterSpacing: "-0.01em" }}>
            Notifications
          </span>
          {unread > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: 18, height: 18, padding: "0 5px",
              borderRadius: 5, fontSize: 10, fontWeight: 800,
              background: `rgba(255,255,255,0.12)`,
              color: "var(--text, #fff)",
              fontFamily: "var(--mono)",
            }}>
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && onReadAll && (
          <button
            onClick={() => { onReadAll(); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, color: "var(--text-muted, #444)",
              padding: "3px 6px", borderRadius: 5, transition: "color 0.12s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#aaa")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted, #444)")}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: "auto", maxHeight, scrollbarWidth: "none" } as React.CSSProperties}>
        {items.length === 0 ? (
          <div style={{
            padding: "32px 16px",
            textAlign: "center",
            color: "var(--text-muted, #444)",
            fontSize: 13,
          }}>
            {emptyText}
          </div>
        ) : (
          items.map((item, i) => (
            <NotificationRow
              key={item.id}
              item={item}
              isLast={i === items.length - 1}
              onRead={() => onRead?.(item.id)}
              onDismiss={() => onDismiss?.(item.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div style={{
          padding:    "10px 16px",
          borderTop:  "1px solid rgba(255,255,255,0.06)",
          textAlign:  "center",
        }}>
          <button
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600,
              color: "var(--text-muted, #444)", padding: "2px 8px",
              borderRadius: 5, transition: "color 0.12s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#aaa")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted, #444)")}
          >
            View all notifications →
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div ref={triggerRef} style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={openPanel} style={{ cursor: "pointer" }}>
        {trigger ?? defaultTrigger}
      </div>
      {mounted && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}

// ─── Bell button ──────────────────────────────────────────────────────────────

function BellButton({ unread, color }: { unread: number; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       "relative",
        width:          34,
        height:         34,
        borderRadius:   9,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        background:     hovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
        border:         "1px solid rgba(255,255,255,0.08)",
        cursor:         "pointer",
        color:          hovered ? "var(--text, #fff)" : "var(--text-muted, #555)",
        transition:     "all 0.12s",
        flexShrink:     0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      {unread > 0 && (
        <span style={{
          position:     "absolute",
          top:          6,
          right:        7,
          width:        7,
          height:       7,
          borderRadius: "50%",
          background:   color,
          border:       "1.5px solid var(--bg, #000)",
        }} />
      )}
    </div>
  );
}

// ─── Notification row ──────────────────────────────────────────────────────────

function NotificationRow({
  item, isLast, onRead, onDismiss,
}: {
  item:      NotificationItem;
  isLast:    boolean;
  onRead:    () => void;
  onDismiss: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const typeColor = item.type ? TYPE_COLOR[item.type] : "var(--text-muted, #555)";
  const typeIcon  = item.type ? TYPE_ICON[item.type] : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!item.read ? onRead : undefined}
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          12,
        padding:      "12px 16px",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.045)",
        background:   hovered ? "rgba(255,255,255,0.03)" : "transparent",
        cursor:       !item.read ? "pointer" : "default",
        transition:   "background 0.12s",
        position:     "relative",
      }}
    >
      {/* Unread dot */}
      {!item.read && (
        <span style={{
          position:     "absolute",
          left:         6,
          top:          "50%",
          transform:    "translateY(-50%)",
          width:        5,
          height:       5,
          borderRadius: "50%",
          background:   "var(--text, #fff)",
          flexShrink:   0,
        }} />
      )}

      {/* Avatar or type icon */}
      {item.avatar ? (
        <div style={{
          width: 28, height: 28, flexShrink: 0, marginTop: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Avatar name={item.avatar} size="xs" />
        </div>
      ) : (
        <div style={{
          width:          28,
          height:         28,
          borderRadius:   8,
          flexShrink:     0,
          marginTop:      1,
          background:     `${typeColor}18`,
          border:         `1px solid ${typeColor}30`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          color:          typeColor,
        }}>
          {item.icon ?? typeIcon}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize:   13,
          fontWeight: item.read ? 400 : 600,
          color:      item.read ? "var(--text-sub, #888)" : "var(--text, #fff)",
          lineHeight: 1.4,
          marginBottom: item.body ? 3 : 0,
        }}>
          {item.title}
        </p>
        {item.body && (
          <p style={{
            fontSize:   12,
            color:      "var(--text-muted, #555)",
            lineHeight: 1.45,
            marginBottom: 4,
            overflow:   "hidden",
            display:    "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}>
            {item.body}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {item.type && (
            <span style={{
              display: "inline-flex", alignItems: "center",
              color: typeColor, width: 10, height: 10, overflow: "hidden",
            }}>
              {typeIcon}
            </span>
          )}
          <span style={{ fontSize: 10, color: "var(--text-muted, #444)", fontFamily: "var(--mono)" }}>
            {item.time}
          </span>
        </div>
      </div>

      {/* Dismiss */}
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted, #444)", padding: "2px 4px",
            borderRadius: 5, display: "flex", alignItems: "center",
            transition: "color 0.12s", flexShrink: 0,
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted, #444)")}
        >
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l8 8M9 1L1 9"/>
          </svg>
        </button>
      )}
    </div>
  );
}

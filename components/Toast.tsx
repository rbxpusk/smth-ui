"use client";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "warning" | "info" | "default";

export interface ToastOptions {
  description?: string;
  duration?:    number;
  color?:       string;   // override accent color for this toast
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id:      string;
  variant: ToastVariant;
  title:   string;
}

// ─── Module-level store (no provider needed) ─────────────────────────────────

const listeners = new Set<(item: ToastItem) => void>();

function emit(variant: ToastVariant, title: string, opts: ToastOptions = {}) {
  const item: ToastItem = {
    id: Math.random().toString(36).slice(2, 9),
    variant, title, ...opts,
  };
  listeners.forEach(fn => fn(item));
}

// ─── Public API ───────────────────────────────────────────────────────────────
//
//   import { toast } from "@/components/Toast"
//   toast("Hello")
//   toast.success("Saved!", { description: "All changes were written." })
//   toast.error("Failed")
//   toast.warning("Low storage")
//   toast.info("Update available")

export const toast = Object.assign(
  (title: string, opts?: ToastOptions) => emit("default", title, opts),
  {
    success: (title: string, opts?: ToastOptions) => emit("success", title, opts),
    error:   (title: string, opts?: ToastOptions) => emit("error",   title, opts),
    warning: (title: string, opts?: ToastOptions) => emit("warning", title, opts),
    info:    (title: string, opts?: ToastOptions) => emit("info",    title, opts),
  },
);

// ─── Toaster ─────────────────────────────────────────────────────────────────
//   Place once in your layout:  <Toaster />

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const variantConfig: Record<ToastVariant, { color: string; border: string; bar: string; icon: React.ReactNode }> = {
  success: {
    color: "#4ade80", bar: "#4ade80", border: "rgba(74,222,128,0.22)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  },
  error: {
    color: "#f87171", bar: "#f87171", border: "rgba(248,113,113,0.22)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>,
  },
  warning: {
    color: "#fbbf24", bar: "#fbbf24", border: "rgba(251,191,36,0.22)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>,
  },
  info: {
    color: "#60a5fa", bar: "#60a5fa", border: "rgba(96,165,250,0.22)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  },
  default: {
    color: "#9a96b4", bar: "rgba(255,255,255,0.2)", border: "rgba(255,255,255,0.1)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  },
};

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [leaving, setLeaving] = useState(false);
  const base = variantConfig[item.variant];
  // Allow per-toast color override
  const accent = item.color ?? base.color;
  const cfg = item.color
    ? { ...base, color: accent, bar: accent, border: `${accent}38` }
    : base;

  function handleDismiss() {
    setLeaving(true);
    setTimeout(() => onDismiss(item.id), 180);
  }

  return (
    <div
      className={leaving ? "toast-out" : "toast-in"}
      onClick={handleDismiss}
      style={{
        position:     "relative",
        overflow:     "hidden",
        display:      "flex",
        alignItems:   "flex-start",
        gap:          "12px",
        padding:      "14px 16px 14px 19px",
        borderRadius: "var(--radius, 14px)",
        background:   "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
        boxShadow: [
          `0 0 0 1px ${cfg.border}`,
          "0 2px 0 rgba(255,255,255,0.04) inset",
          "0 -1px 0 rgba(0,0,0,0.4) inset",
          "0 12px 40px rgba(0,0,0,0.5)",
        ].join(", "),
        minWidth:  "300px",
        maxWidth:  "380px",
        cursor:    "pointer",
        userSelect: "none",
      }}
    >
      {/* Noise */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "128px", opacity: 0.025, pointerEvents: "none" }} />
      {/* Left bar */}
      <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: "3px", borderRadius: "0 3px 3px 0", background: cfg.bar }} />
      {/* Icon */}
      <div style={{ color: cfg.color, flexShrink: 0, marginTop: "1px", position: "relative" }}>{cfg.icon}</div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text, #e8e8e8)", lineHeight: 1.3, marginBottom: item.description ? "3px" : 0 }}>
          {item.title}
        </p>
        {item.description && (
          <p style={{ fontSize: "12px", color: "var(--text-sub, #777)", lineHeight: 1.5 }}>{item.description}</p>
        )}
        {item.action && (
          <button
            onClick={e => { e.stopPropagation(); item.action!.onClick(); handleDismiss(); }}
            style={{
              marginTop:    "8px",
              fontSize:     "11px",
              fontWeight:   700,
              color:        cfg.color,
              background:   "transparent",
              border:       `1px solid ${cfg.border}`,
              borderRadius: "var(--radius-sm, 6px)",
              padding:      "3px 9px",
              cursor:       "pointer",
            }}
          >
            {item.action.label}
          </button>
        )}
      </div>
      {/* Close */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #444)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "2px", position: "relative" }}>
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function handler(item: ToastItem) {
      setToasts(t => [...t, item]);
      const dur = item.duration ?? 4200;
      setTimeout(() => setToasts(t => t.filter(x => x.id !== item.id)), dur);
    }
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  function dismiss(id: string) {
    setToasts(t => t.filter(x => x.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" role="status" style={{
      position:      "fixed",
      bottom:        "24px",
      right:         "24px",
      display:       "flex",
      flexDirection: "column",
      gap:           "8px",
      zIndex:        9999,
      alignItems:    "flex-end",
    }}>
      {toasts.map(t => <ToastItem key={t.id} item={t} onDismiss={dismiss} />)}
    </div>
  );
}

// ─── Legacy compat (kept for smooth migration) ────────────────────────────────

/** @deprecated Use `<Toaster />` in your layout instead */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

/** @deprecated Import `toast` directly instead of using this hook */
export function useToast() {
  return {
    toast: (opts: { type?: string; title: string; message?: string }) => {
      const variant = (opts.type ?? "default") as ToastVariant;
      emit(variant, opts.title, { description: opts.message });
    },
  };
}

"use client";
import { type ReactNode, useState, useId } from "react";

interface AccordionItem {
  id:       string;
  label:    ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items:        AccordionItem[];
  multiple?:    boolean;
  defaultOpen?: string[];
  color?:       string;
}

function AccordionRow({
  item, open, onToggle, color, headingId, panelId,
}: {
  item:      AccordionItem;
  open:      boolean;
  onToggle:  () => void;
  color:     string;
  headingId: string;
  panelId:   string;
}) {
  const isDisabled = item.disabled ?? false;

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        id={headingId}
        aria-expanded={open}
        aria-controls={panelId}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onClick={onToggle}
        style={{
          width:          "100%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "12px",
          padding:        "16px 20px",
          background:     "none",
          border:         "none",
          cursor:         isDisabled ? "not-allowed" : "pointer",
          textAlign:      "left",
          color:          open ? "var(--text)" : "var(--text-sub)",
          fontSize:       "14px",
          fontWeight:     600,
          letterSpacing:  "-0.01em",
          opacity:        isDisabled ? 0.4 : 1,
          transition:     "color 0.18s",
        }}
      >
        <span style={{ flex: 1 }}>{item.label}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            color:      open ? color : "var(--text-muted)",
            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1), color 0.18s",
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/*
        CSS grid-template-rows trick — no JS height measurement.
        Outer grid transitions from 0fr → 1fr, inner div catches overflow.
        Width is never constrained so wide content doesn't shift layout.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        style={{
          display:         "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition:       "grid-template-rows 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div style={{
            padding:    "0 20px 18px",
            fontSize:   "13px",
            color:      "var(--text-sub)",
            lineHeight: 1.7,
          }}>
            {item.children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items, multiple = false, defaultOpen = [], color = "#876cff" }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));
  const uid = useId();

  function toggle(id: string) {
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div style={{
      position:     "relative",
      borderRadius: "16px",
      overflow:     "hidden",
      background:   "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
      boxShadow:    "0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55)",
    }}>
      {items.map((item, i) => (
        <div key={item.id} style={{ borderBottom: i < items.length - 1 ? undefined : "none" }}>
          <AccordionRow
            item={item}
            open={open.has(item.id)}
            onToggle={() => toggle(item.id)}
            color={color}
            headingId={`${uid}-heading-${item.id}`}
            panelId={`${uid}-panel-${item.id}`}
          />
        </div>
      ))}
    </div>
  );
}

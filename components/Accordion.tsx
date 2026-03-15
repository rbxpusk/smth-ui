"use client";
import { type ReactNode, useState, useRef, useEffect } from "react";

interface AccordionItem {
  id:       string;
  label:    ReactNode;
  children: ReactNode;
}

interface AccordionProps {
  items:    AccordionItem[];
  multiple?: boolean;  // allow multiple open at once
  defaultOpen?: string[];
}

function AccordionRow({
  item, open, onToggle,
}: { item: AccordionItem; open: boolean; onToggle: () => void }) {
  const bodyRef  = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(bodyRef.current.scrollHeight);
  }, [item.children]);

  return (
    <div style={{
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <button
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
          cursor:         "pointer",
          textAlign:      "left",
          color:          "var(--text)",
          fontSize:       "14px",
          fontWeight:     600,
          letterSpacing:  "-0.01em",
          transition:     "color 0.15s",
        }}
      >
        <span style={{ flex: 1 }}>{item.label}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
          style={{
            flexShrink: 0,
            color:      open ? "var(--purple)" : "var(--text-muted)",
            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1), color 0.15s",
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Animated body */}
      <div style={{
        overflow:   "hidden",
        maxHeight:  open ? `${height}px` : "0px",
        transition: "max-height 0.28s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div ref={bodyRef} style={{
          padding:    "0 20px 18px",
          fontSize:   "13px",
          color:      "var(--text-sub)",
          lineHeight: 1.7,
        }}>
          {item.children}
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items, multiple = false, defaultOpen = [] }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

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
      overflow:     "hidden",
      borderRadius: "16px",
      background:   "linear-gradient(170deg, var(--surface, #1c1a28) 0%, var(--surface-lo, #131122) 100%)",
      boxShadow:    "0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55)",
    }}>
      {items.map((item, i) => (
        <div key={item.id} style={{ borderBottom: i < items.length - 1 ? undefined : "none" }}>
          <AccordionRow
            item={item}
            open={open.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        </div>
      ))}
    </div>
  );
}

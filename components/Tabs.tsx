"use client";
import { type ReactNode, useState, useRef } from "react";
import { safeHex, hexToRgb } from "@/lib/color";

interface Tab {
  id:       string;
  label:    string;
  icon?:    ReactNode;
  badge?:   string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs:       Tab[];
  children:   (activeId: string) => ReactNode;
  defaultId?: string;
  color?:     string;
  onChange?:  (id: string) => void;
}

export function Tabs({ tabs, children, defaultId, color = "#876cff", onChange }: TabsProps) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  const validColor = safeHex(color);
  const [r,g,b] = hexToRgb(validColor);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(id: string) {
    setActive(id);
    onChange?.(id);
  }

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    const enabled = tabs.filter(t => !t.disabled);
    const enabledIdx = enabled.findIndex(t => t.id === tabs[idx].id);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = enabled[(enabledIdx + 1) % enabled.length];
      if (next) { select(next.id); tabRefs.current[tabs.findIndex(t => t.id === next.id)]?.focus(); }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = enabled[(enabledIdx - 1 + enabled.length) % enabled.length];
      if (prev) { select(prev.id); tabRefs.current[tabs.findIndex(t => t.id === prev.id)]?.focus(); }
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = enabled[0];
      if (first) { select(first.id); tabRefs.current[tabs.findIndex(t => t.id === first.id)]?.focus(); }
    } else if (e.key === "End") {
      e.preventDefault();
      const last = enabled[enabled.length - 1];
      if (last) { select(last.id); tabRefs.current[tabs.findIndex(t => t.id === last.id)]?.focus(); }
    }
  }

  return (
    <div>
      {/* Tab strip */}
      <div
        role="tablist"
        aria-label="Tabs"
        style={{
          display:      "inline-flex",
          alignItems:   "center",
          gap:          "2px",
          padding:      "3px",
          background:   "var(--surface-lo, rgba(255,255,255,0.03))",
          border:       "1px solid var(--border, rgba(255,255,255,0.06))",
          borderRadius: "var(--radius, 12px)",
          marginBottom: "18px",
          boxShadow:    "0 1px 3px rgba(0,0,0,0.2) inset",
        }}
      >
        {tabs.map((tab, idx) => {
          const isActive   = active === tab.id;
          const isDisabled = tab.disabled ?? false;
          return (
            <button
              key={tab.id}
              ref={el => { tabRefs.current[idx] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => !isDisabled && select(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{
                position:       "relative",
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "6px",
                padding:        "7px 16px",
                fontSize:       "13px",
                fontWeight:     isActive ? 700 : 500,
                borderRadius:   "var(--radius-sm, 9px)",
                border:         isActive
                  ? `1px solid rgba(${r},${g},${b},0.18)`
                  : "1px solid transparent",
                cursor:         isDisabled ? "not-allowed" : "pointer",
                opacity:        isDisabled ? 0.4 : 1,
                transition:     "all 0.18s cubic-bezier(0.22,1,0.36,1)",
                background:     isActive
                  ? `rgba(${r},${g},${b},0.1)`
                  : "transparent",
                color:          isActive ? validColor : "var(--text-muted)",
                boxShadow:      isActive
                  ? `0 1px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(${r},${g},${b},0.08)`
                  : "none",
                whiteSpace:     "nowrap",
                userSelect:     "none",
                outline:        "none",
              }}
            >
              {tab.icon && (
                <span style={{ display: "flex", alignItems: "center", opacity: isActive ? 1 : 0.6 }}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge !== undefined && (
                <span style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  minWidth:       "18px",
                  height:         "16px",
                  padding:        "0 5px",
                  borderRadius:   "5px",
                  fontSize:       "10px",
                  fontWeight:     800,
                  background:     isActive ? `rgba(${r},${g},${b},0.2)` : "rgba(255,255,255,0.07)",
                  color:          isActive ? validColor : "var(--text-muted)",
                  border:         isActive ? `1px solid rgba(${r},${g},${b},0.2)` : "1px solid rgba(255,255,255,0.06)",
                  fontFamily:     "var(--mono)",
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          style={{ display: active === tab.id ? "block" : "none" }}
        >
          {active === tab.id ? children(tab.id) : null}
        </div>
      ))}
    </div>
  );
}

"use client";
import { type ReactNode, useState, useRef } from "react";
import { safeHex, hexToRgb } from "@/lib/color";

interface Tab {
  id:        string;
  label:     string;
  icon?:     ReactNode;
  badge?:    string | number;
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
  const [r, g, b] = hexToRgb(validColor);
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
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Tabs"
        style={{
          display:      "flex",
          alignItems:   "flex-end",
          gap:          "0",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "20px",
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
              onKeyDown={e => handleKeyDown(e, idx)}
              style={{
                position:      "relative",
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "6px",
                padding:       "8px 14px",
                paddingBottom: "10px",
                fontSize:      "13px",
                fontWeight:    isActive ? 500 : 400,
                color:         isActive
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.38)",
                background:    "none",
                border:        "none",
                borderBottom:  isActive
                  ? `2px solid ${validColor}`
                  : "2px solid transparent",
                marginBottom:  "-1px",
                cursor:        isDisabled ? "not-allowed" : "pointer",
                opacity:       isDisabled ? 0.35 : 1,
                transition:    "color 0.15s, border-color 0.15s",
                outline:       "none",
                whiteSpace:    "nowrap",
                userSelect:    "none",
              }}
            >
              {tab.icon && (
                <span style={{ display: "flex", alignItems: "center", opacity: isActive ? 0.9 : 0.45 }}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge !== undefined && (
                <span style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  minWidth:       "17px",
                  height:         "15px",
                  padding:        "0 4px",
                  borderRadius:   "4px",
                  fontSize:       "10px",
                  fontWeight:     700,
                  background:     isActive
                    ? `rgba(${r},${g},${b},0.18)`
                    : "rgba(255,255,255,0.07)",
                  color:          isActive ? validColor : "rgba(255,255,255,0.35)",
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

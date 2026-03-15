"use client";
import { type ReactNode, useState } from "react";

interface Tab { id: string; label: string; icon?: ReactNode; badge?: string | number; }

interface TabsProps {
  tabs:       Tab[];
  children:   (activeId: string) => ReactNode;
  defaultId?: string;
  color?:     string;
}

function hexToRgb(hex: string): [number,number,number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

export function Tabs({ tabs, children, defaultId, color = "#876cff" }: TabsProps) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  const [r,g,b] = hexToRgb(color);

  return (
    <div>
      {/* Tab strip */}
      <div style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          "2px",
        padding:      "4px",
        background:   "linear-gradient(170deg, var(--surface, #1a1828) 0%, var(--surface-lo, #131020) 100%)",
        border:       "1px solid var(--border, rgba(255,255,255,0.08))",
        borderRadius: "var(--radius, 13px)",
        marginBottom: "18px",
        boxShadow:    "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 4px 16px rgba(0,0,0,0.3)",
      }}>
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                position:       "relative",
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "6px",
                padding:        "7px 16px",
                fontSize:       "13px",
                fontWeight:     isActive ? 700 : 500,
                borderRadius:   "var(--radius-sm, 10px)",
                border:         isActive
                  ? `1px solid rgba(${r},${g},${b},0.25)`
                  : "1px solid transparent",
                cursor:         "pointer",
                transition:     "all 0.18s cubic-bezier(0.22,1,0.36,1)",
                background:     isActive
                  ? "linear-gradient(170deg, var(--surface-hi, #201e30) 0%, var(--surface, #161328) 100%)"
                  : "transparent",
                color:          isActive ? color : "var(--text-muted)",
                boxShadow:      isActive
                  ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 4px 12px rgba(0,0,0,0.3)"
                  : "none",
                whiteSpace:     "nowrap",
                userSelect:     "none",
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
                  color:          isActive ? color : "var(--text-muted)",
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

      {/* Panel */}
      <div>{children(active!)}</div>
    </div>
  );
}

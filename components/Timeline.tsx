"use client";
import { type ReactNode, type CSSProperties } from "react";
import { safeHex, hexToRgbString } from "@/lib/color";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  icon?: ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  color?: string;
  style?: CSSProperties;
}

export function Timeline({ items, color, style }: TimelineProps) {
  const defaultAccent = safeHex(color ?? "#876cff");

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const dotColor = item.color
          ? safeHex(item.color)
          : isFirst
            ? defaultAccent
            : "var(--text-muted)";
        const dotRgb = item.color
          ? hexToRgbString(safeHex(item.color))
          : isFirst
            ? hexToRgbString(defaultAccent)
            : undefined;

        return (
          <div
            key={item.id}
            style={{
              display:  "flex",
              gap:      "14px",
              position: "relative",
              paddingBottom: isLast ? 0 : "24px",
            }}
          >
            {/* Left column: dot + line */}
            <div style={{
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              flexShrink:    0,
              width:         "16px",
              position:      "relative",
            }}>
              {/* Dot */}
              {item.icon ? (
                <div style={{
                  width:          "16px",
                  height:         "16px",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  color:          dotColor,
                  flexShrink:     0,
                  marginTop:      "2px",
                }}>
                  {item.icon}
                </div>
              ) : (
                <div style={{
                  width:        "8px",
                  height:       "8px",
                  borderRadius: "50%",
                  background:   dotColor,
                  flexShrink:   0,
                  marginTop:    "6px",
                  boxShadow:    dotRgb
                    ? `0 0 8px rgba(${dotRgb},0.35)`
                    : undefined,
                }} />
              )}

              {/* Connecting line */}
              {!isLast && (
                <div style={{
                  flex:       1,
                  width:      "1px",
                  background: "rgba(255,255,255,0.06)",
                  marginTop:  "6px",
                }} />
              )}
            </div>

            {/* Right column: content */}
            <div style={{
              flex:          1,
              display:       "flex",
              flexDirection: "column",
              gap:           "2px",
              minWidth:      0,
              paddingTop:    "1px",
            }}>
              <div style={{
                display:        "flex",
                alignItems:     "baseline",
                justifyContent: "space-between",
                gap:            "12px",
              }}>
                <span style={{
                  fontSize:   "13px",
                  fontWeight: 600,
                  color:      "var(--text)",
                  lineHeight: 1.4,
                }}>
                  {item.title}
                </span>
                {item.time && (
                  <span style={{
                    fontSize:   "11px",
                    color:      "var(--text-muted)",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}>
                    {item.time}
                  </span>
                )}
              </div>
              {item.description && (
                <span style={{
                  fontSize:   "12px",
                  color:      "var(--text-sub)",
                  lineHeight: 1.5,
                }}>
                  {item.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

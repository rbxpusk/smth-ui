"use client";
import { type ReactNode, useState } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export interface TableColumn<T = Record<string, unknown>> {
  key:     string;
  label:   string;
  width?:  string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data:    T[];
}

export function Table<T extends Record<string, unknown>>({ columns, data }: TableProps<T>) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gridCols = columns.map(c => c.width || "1fr").join(" ");

  return (
    <div style={{
      position:     "relative",
      overflow:     "hidden",
      borderRadius: "16px",
      background:   "linear-gradient(170deg, var(--surface, #1c1a28) 0%, var(--surface-lo, #131122) 100%)",
      boxShadow:    "0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55)",
    }}>
      {/* Noise */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "128px", opacity: 0.022, pointerEvents: "none", zIndex: 0 }} />
      {/* Specular */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", pointerEvents: "none", zIndex: 1 }} />

      {/* Header */}
      <div style={{
        position:            "relative",
        display:             "grid",
        gridTemplateColumns: gridCols,
        background:          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        borderBottom:        "1px solid rgba(255,255,255,0.07)",
        zIndex:              2,
      }}>
        {columns.map((col, i) => (
          <div key={col.key} style={{
            padding:       "11px 16px",
            fontSize:      "10px",
            fontWeight:    800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         "var(--text-muted)",
            whiteSpace:    "nowrap",
            borderRight:   i < columns.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {data.length === 0 ? (
        <div style={{
          position:  "relative",
          padding:   "40px",
          textAlign: "center",
          fontSize:  "13px",
          color:     "var(--text-muted)",
          zIndex:    2,
        }}>
          No data
        </div>
      ) : data.map((row, rowIdx) => {
        const isHovered = hovered === rowIdx;
        const isLast    = rowIdx === data.length - 1;
        return (
          <div
            key={rowIdx}
            onMouseEnter={() => setHovered(rowIdx)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position:            "relative",
              display:             "grid",
              gridTemplateColumns: gridCols,
              background:          isHovered ? "rgba(255,255,255,0.04)" : "transparent",
              borderBottom:        isLast ? "none" : "1px solid rgba(255,255,255,0.045)",
              transition:          "background 0.12s",
              zIndex:              2,
            }}
          >
            {columns.map((col, i) => (
              <div key={col.key} style={{
                padding:      "13px 16px",
                fontSize:     "13px",
                color:        "var(--text-sub)",
                whiteSpace:   "nowrap",
                overflow:     "hidden",
                textOverflow: "ellipsis",
                display:      "flex",
                alignItems:   "center",
                borderRight:  i < columns.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key] ?? "")}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

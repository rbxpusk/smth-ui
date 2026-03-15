"use client";
import { type ReactNode, useState } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export interface TableColumn<T = Record<string, unknown>> {
  key:       string;
  label:     string;
  width?:    string;
  sortable?: boolean;
  render?:   (value: unknown, row: T) => ReactNode;
}

type Density = "compact" | "normal" | "relaxed";

interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns:      TableColumn<T>[];
  data:         T[];
  onRowClick?:  (row: T) => void;
  emptyText?:   string;
  striped?:     boolean;
  density?:     Density;
  stickyHeader?: boolean;
}

const densityPad: Record<Density, { header: string; cell: string }> = {
  compact:  { header: "8px 14px",  cell: "9px 14px"  },
  normal:   { header: "11px 16px", cell: "13px 16px" },
  relaxed:  { header: "14px 18px", cell: "18px 18px" },
};

export function Table<T extends Record<string, unknown>>({
  columns, data, onRowClick, emptyText = "No data",
  striped = false, density = "normal", stickyHeader = false,
}: TableProps<T>) {
  const [hovered,  setHovered]  = useState<number | null>(null);
  const [sortKey,  setSortKey]  = useState<string | null>(null);
  const [sortDir,  setSortDir]  = useState<"asc" | "desc">("asc");

  const pad = densityPad[density];

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey]; const bv = b[sortKey];
        const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      })
    : data;

  const gridCols = columns.map(c => c.width || "1fr").join(" ");

  return (
    <div style={{
      position:     "relative",
      overflow:     stickyHeader ? "auto" : "hidden",
      borderRadius: "16px",
      background:   "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
      boxShadow:    "0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55)",
    }}>
      {/* Noise */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "128px", opacity: 0.022, pointerEvents: "none", zIndex: 0 }} />
      {/* Specular */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", pointerEvents: "none", zIndex: 1 }} />

      {/* Header */}
      <div
        role="row"
        style={{
          position:            "relative",
          display:             "grid",
          gridTemplateColumns: gridCols,
          background:          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          borderBottom:        "1px solid rgba(255,255,255,0.07)",
          zIndex:              stickyHeader ? 10 : 2,
          ...(stickyHeader ? { position: "sticky", top: 0 } : {}),
        } as React.CSSProperties}
      >
        {columns.map((col, i) => (
          <div
            key={col.key}
            role="columnheader"
            aria-sort={
              col.sortable
                ? sortKey === col.key
                  ? sortDir === "asc" ? "ascending" : "descending"
                  : "none"
                : undefined
            }
            onClick={col.sortable ? () => handleSort(col.key) : undefined}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           "5px",
              padding:       pad.header,
              fontSize:      "10px",
              fontWeight:    800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color:         sortKey === col.key ? "var(--text-sub)" : "var(--text-muted)",
              whiteSpace:    "nowrap",
              borderRight:   i < columns.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              cursor:        col.sortable ? "pointer" : "default",
              userSelect:    "none",
              transition:    "color 0.12s",
            }}
          >
            {col.label}
            {col.sortable && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                aria-hidden="true"
                style={{
                  opacity: sortKey === col.key ? 1 : 0.35,
                  transform: sortKey === col.key && sortDir === "desc" ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s, opacity 0.15s",
                }}>
                <path d="M12 5l0 14M5 12l7-7 7 7"/>
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Rows */}
      {sorted.length === 0 ? (
        <div style={{
          position:  "relative",
          padding:   "40px",
          textAlign: "center",
          fontSize:  "13px",
          color:     "var(--text-muted)",
          zIndex:    2,
        }}>
          {emptyText}
        </div>
      ) : sorted.map((row, rowIdx) => {
        const isHovered = hovered === rowIdx;
        const isLast    = rowIdx === sorted.length - 1;
        const isStriped = striped && rowIdx % 2 === 1;
        return (
          <div
            key={rowIdx}
            role="row"
            tabIndex={onRowClick ? 0 : undefined}
            onMouseEnter={() => setHovered(rowIdx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onRowClick?.(row)}
            onKeyDown={(e) => { if (onRowClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onRowClick(row); } }}
            style={{
              position:            "relative",
              display:             "grid",
              gridTemplateColumns: gridCols,
              background:          isHovered && onRowClick
                ? "rgba(255,255,255,0.06)"
                : isHovered
                ? "rgba(255,255,255,0.03)"
                : isStriped
                ? "rgba(255,255,255,0.02)"
                : "transparent",
              borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.045)",
              cursor:       onRowClick ? "pointer" : "default",
              transition:   "background 0.12s",
              outline:      "none",
              zIndex:       2,
            }}
          >
            {columns.map((col, i) => (
              <div key={col.key} style={{
                padding:      pad.cell,
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

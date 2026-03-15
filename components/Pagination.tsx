"use client";
import { useState } from "react";

interface PaginationProps {
  total:     number;
  pageSize?: number;
  page?:     number;
  onChange?: (page: number) => void;
  siblings?: number;
  color?:    string;  // hex accent color
}

function hexToRgb(hex: string): [number,number,number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(current: number, total: number, siblings: number): (number | "…")[] {
  const left  = Math.max(1, current - siblings);
  const right = Math.min(total, current + siblings);
  const pages: (number | "…")[] = [];
  if (left > 1)     { pages.push(1); if (left > 2) pages.push("…"); }
  range(left, right).forEach(p => pages.push(p));
  if (right < total) { if (right < total - 1) pages.push("…"); pages.push(total); }
  return pages;
}

export function Pagination({
  total, pageSize = 10, page: controlledPage, onChange, siblings = 1, color = "#876cff",
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(1);
  const page   = controlledPage ?? internalPage;
  const pages  = Math.max(1, Math.ceil(total / pageSize));
  const pages_ = buildPages(page, pages, siblings);

  function go(p: number) {
    if (p < 1 || p > pages) return;
    setInternalPage(p);
    onChange?.(p);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <PageBtn onClick={() => go(page - 1)} disabled={page === 1} color={color} aria-label="Previous">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </PageBtn>

      {pages_.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} style={{ padding: "0 4px", fontSize: "13px", color: "var(--text-muted)", userSelect: "none" }}>…</span>
          : <PageBtn key={p} active={p === page} color={color} onClick={() => go(p as number)}>{p}</PageBtn>
      )}

      <PageBtn onClick={() => go(page + 1)} disabled={page === pages} color={color} aria-label="Next">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </PageBtn>
    </div>
  );
}

function PageBtn({
  children, onClick, disabled, active, color, "aria-label": ariaLabel,
}: {
  children:       React.ReactNode;
  onClick:        () => void;
  disabled?:      boolean;
  active?:        boolean;
  color:          string;
  "aria-label"?:  string;
}) {
  const [hovered, setHovered] = useState(false);
  const [r,g,b] = hexToRgb(color);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        minWidth:       "34px",
        height:         "34px",
        padding:        "0 8px",
        fontSize:       "13px",
        fontWeight:     active ? 700 : 500,
        borderRadius:   "var(--radius, 9px)",
        cursor:         disabled ? "not-allowed" : "pointer",
        opacity:        disabled ? 0.35 : 1,
        userSelect:     "none",
        border: active
          ? `1px solid rgba(${r},${g},${b},0.4)`
          : hovered ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        background: active
          ? `linear-gradient(170deg, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.1) 100%)`
          : hovered ? "rgba(255,255,255,0.06)" : "transparent",
        color:      active ? color : "var(--text-sub)",
        transition: "background 0.12s, border-color 0.12s, color 0.12s",
      }}
    >
      {children}
    </button>
  );
}

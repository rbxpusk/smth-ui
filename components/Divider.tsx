import { type CSSProperties } from "react";

interface DividerProps {
  label?:  string;
  style?:  CSSProperties;
  color?:  string;
}

export function Divider({ label, style, color = "rgba(255,255,255,0.07)" }: DividerProps) {
  if (label) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", ...style }}>
        <div style={{ flex: 1, height: "1px", background: color }} />
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          {label}
        </span>
        <div style={{ flex: 1, height: "1px", background: color }} />
      </div>
    );
  }
  return <div style={{ height: "1px", background: color, width: "100%", ...style }} />;
}

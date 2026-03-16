import { type ReactNode, type HTMLAttributes } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label:   string;
  value:   string | number;
  sub?:    string;
  icon?:   ReactNode;
  trend?:  { value: string; positive: boolean };
  color?:  string;  // hex accent — defaults to #876cff
}

function hexToRgb(hex: string) {
  const h = hex.replace("#","");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

export function StatCard({ label, value, sub, icon, trend, color = "#876cff", style, ...rest }: StatCardProps) {
  const [r,g,b] = hexToRgb(color);

  return (
    <div {...rest} style={{
      position: "relative", overflow: "hidden",
      padding: "22px",
      borderRadius: "var(--radius-lg, 18px)",
      background: "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface-lo, var(--bg, #0a0a0a)) 100%)",
      boxShadow: `0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55)`,
      display: "flex", flexDirection: "column", gap: "14px",
      ...style,
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "128px", opacity: 0.025, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

      <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px",
          }}>
            {label}
          </p>
          <p style={{
            fontSize: "30px", fontWeight: 900, color: "var(--text)",
            letterSpacing: "-1.5px", fontFamily: "var(--mono)", lineHeight: 1,
          }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: "12px", color: "var(--text-sub)", marginTop: "5px" }}>{sub}</p>
          )}
        </div>
        {icon && (
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
            background: `linear-gradient(170deg, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.1) 100%)`,
            border: `1px solid rgba(${r},${g},${b},0.3)`,
            boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color,
          }}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "5px", alignSelf: "flex-start" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "4px 9px", borderRadius: "7px",
            background: trend.positive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${trend.positive ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
            boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={trend.positive ? "#4ade80" : "#f87171"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {trend.positive
                ? <path d="M22 7 13.5 15.5 8.5 10.5 2 17M22 7h-5M22 7v5"/>
                : <path d="M22 17 13.5 8.5 8.5 13.5 2 7M22 17h-5M22 17v-5"/>
              }
            </svg>
            <span style={{ fontSize: "11px", fontWeight: 700, color: trend.positive ? "#4ade80" : "#f87171", fontFamily: "var(--mono)" }}>
              {trend.value}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

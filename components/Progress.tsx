import { type CSSProperties } from "react";

type ProgressVariant = "purple" | "green" | "red" | "yellow" | "blue";

interface ProgressProps {
  value:      number;
  variant?:   ProgressVariant;
  size?:      "sm" | "md" | "lg";
  label?:     string;
  showValue?: boolean;
  style?:     CSSProperties;
  animated?:  boolean;
  color?:     string; // hex override
}

const variantGradients: Record<ProgressVariant, { bar: string; glow: string }> = {
  purple: { bar: "linear-gradient(90deg, #6748e8, #9b85ff)",  glow: "rgba(155,133,255,0.55)" },
  green:  { bar: "linear-gradient(90deg, #16a34a, #4ade80)",  glow: "rgba(74,222,128,0.5)"  },
  red:    { bar: "linear-gradient(90deg, #b91c1c, #f87171)",  glow: "rgba(248,113,113,0.5)" },
  yellow: { bar: "linear-gradient(90deg, #b45309, #fbbf24)",  glow: "rgba(251,191,36,0.5)"  },
  blue:   { bar: "linear-gradient(90deg, #1d4ed8, #60a5fa)",  glow: "rgba(96,165,250,0.5)"  },
};

const heights = { sm: "5px", md: "8px", lg: "12px" };

export function Progress({
  value, variant = "purple", size = "md", label, showValue = false, style, animated = true, color,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  const h   = heights[size];
  const { bar, glow } = variantGradients[variant];

  const barBg   = color ? color : bar;
  const glowClr = color ? color : glow;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label    && <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", letterSpacing: "-0.01em" }}>{label}</span>}
          {showValue && (
            <span style={{
              fontSize:      "11px",
              fontWeight:    700,
              color:         "var(--text-muted)",
              fontFamily:    "var(--mono)",
              background:    "rgba(255,255,255,0.06)",
              border:        "1px solid rgba(255,255,255,0.08)",
              borderRadius:  "5px",
              padding:       "1px 6px",
            }}>
              {pct}%
            </span>
          )}
        </div>
      )}
      {/* Track */}
      <div style={{
        position:     "relative",
        width:        "100%",
        height:       h,
        borderRadius: "999px",
        background:   "rgba(255,255,255,0.07)",
        boxShadow:    "0 1px 0 rgba(0,0,0,0.3) inset",
        overflow:     "hidden",
      }}>
        {/* Fill */}
        <div style={{
          position:   "relative",
          height:     "100%",
          width:      `${pct}%`,
          borderRadius: "999px",
          background: barBg,
          boxShadow:  `0 1px 0 rgba(255,255,255,0.18) inset`,
          transition: animated ? "width 0.55s cubic-bezier(0.34,1,0.64,1)" : undefined,
          minWidth:   pct > 0 ? h : 0,
        }}>
          {/* Shimmer sweep */}
          {animated && pct > 0 && (
            <div style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation:  "progress-shimmer 2.2s ease-in-out infinite",
              borderRadius: "999px",
            }} />
          )}
          {/* Tip glow */}
          {pct > 2 && (
            <div style={{
              position:  "absolute",
              right:     0,
              top:       "50%",
              transform: "translateY(-50%)",
              width:     "12px",
              height:    "12px",
              borderRadius: "50%",
              background: glowClr,
              filter:    "blur(4px)",
              opacity:   0.9,
            }} />
          )}
        </div>
        <style>{`
          @keyframes progress-shimmer {
            0%   { background-position: 200% 0 }
            100% { background-position: -200% 0 }
          }
        `}</style>
      </div>
    </div>
  );
}

import { type CSSProperties } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name?:      string;
  src?:       string;
  size?:      AvatarSize;
  ring?:      boolean;
  ringColor?: string;  // hex — overrides default purple ring
  status?:    "online" | "offline" | "away" | "busy";
  style?:     CSSProperties;
  color?:     string;
}

const sizes = {
  xs: { sz: 24, font: 9  },
  sm: { sz: 32, font: 11 },
  md: { sz: 40, font: 14 },
  lg: { sz: 52, font: 18 },
  xl: { sz: 68, font: 24 },
};

const statusColors = {
  online:  { bg: "#4ade80", glow: "rgba(74,222,128,0.55)"   },
  offline: { bg: "#3a3555", glow: "none"                    },
  away:    { bg: "#fbbf24", glow: "rgba(251,191,36,0.45)"   },
  busy:    { bg: "#f87171", glow: "rgba(248,113,113,0.45)"  },
};

// Deterministic color palette from name
const PALETTES = [
  { from: "#7c62e8", to: "#4930b8" },
  { from: "#0ea5e9", to: "#0369a1" },
  { from: "#10b981", to: "#047857" },
  { from: "#f59e0b", to: "#b45309" },
  { from: "#ec4899", to: "#9d174d" },
  { from: "#8b5cf6", to: "#5b21b6" },
  { from: "#ef4444", to: "#991b1b" },
  { from: "#6366f1", to: "#3730a3" },
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const { from, to } = PALETTES[hash % PALETTES.length];
  return `linear-gradient(145deg, ${from} 0%, ${to} 100%)`;
}

function getInitials(name: string) {
  const parts = name.replace(/\*/g, "").trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  const w = parts[0];
  if (!w) return "?";
  return (w[0] + (w.length > 1 ? w[w.length - 1] : "")).toUpperCase();
}

function hexToRgbAvatar(hex: string): [number,number,number] {
  const h = hex.replace("#","");
  return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
}

function isLight(hex: string) {
  const [r,g,b] = hexToRgbAvatar(hex);
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.6;
}

export function Avatar({ name = "", src, size = "md", ring = false, ringColor, status, style, color }: AvatarProps) {
  const { sz, font } = sizes[size];
  const statusSz = Math.max(8, Math.round(sz * 0.22));
  const bg       = color ? color : src ? undefined : getGradient(name);
  const rc       = ringColor ?? "#876cff";
  const [rr,rg,rb] = hexToRgbAvatar(rc);

  return (
    <div style={{ position: "relative", flexShrink: 0, width: sz, height: sz, ...style }}>
      {/* Ring */}
      {ring && (
        <div style={{
          position:   "absolute",
          inset:      "-3px",
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, rgba(${rr},${rg},${rb},0.8), rgba(${rr},${rg},${rb},0.15), rgba(${Math.min(255,rr+40)},${Math.min(255,rg+40)},${Math.min(255,rb+20)},0.6), rgba(${rr},${rg},${rb},0.8))`,
          padding:    "1.5px",
          animation:  "avatar-ring-spin 6s linear infinite",
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#08070d" }} />
        </div>
      )}
      <style>{`@keyframes avatar-ring-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Body */}
      <div style={{
        position:           "absolute",
        inset:              ring ? "2px" : "0",
        borderRadius:       "50%",
        background:         bg,
        backgroundImage:    src ? `url(${src})` : undefined,
        backgroundSize:     "cover",
        backgroundPosition: "center",
        boxShadow:          "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.3)",
        display:            "flex",
        alignItems:         "center",
        justifyContent:     "center",
      }}>
        {!src && (
          <span style={{
            fontSize:    `${font}px`,
            fontWeight:  900,
            color:       color && isLight(color) ? "#111" : "#fff",
            letterSpacing: "-0.5px",
            textShadow:  "0 1px 4px rgba(0,0,0,0.4)",
            userSelect:  "none",
          }}>
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* Status dot */}
      {status && (
        <div style={{
          position:     "absolute",
          bottom:       ring ? "3px" : "0px",
          right:        ring ? "3px" : "0px",
          width:        statusSz,
          height:       statusSz,
          borderRadius: "50%",
          background:   statusColors[status].bg,
          border:       "2px solid #08070d",
          boxShadow:    statusColors[status].glow !== "none" ? `0 0 8px ${statusColors[status].glow}` : undefined,
        }} />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  names: string[];
  max?:  number;
  size?: AvatarSize;
}

export function AvatarGroup({ names, max = 4, size = "sm" }: AvatarGroupProps) {
  const { sz } = sizes[size];
  const visible = names.slice(0, max);
  const rest    = names.length - max;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((name, i) => (
        <div key={i} style={{
          marginLeft: i === 0 ? 0 : `-${Math.round(sz * 0.28)}px`,
          zIndex:     visible.length - i,
          borderRadius: "50%",
          boxShadow:  "0 0 0 2px #08070d",
        }}>
          <Avatar name={name} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div style={{
          marginLeft:     `-${Math.round(sz * 0.28)}px`,
          width:          sz,
          height:         sz,
          borderRadius:   "50%",
          background:     "linear-gradient(170deg, #1e1c2c 0%, #131020 100%)",
          border:         "2px solid #08070d",
          boxShadow:      "0 0 0 1px rgba(255,255,255,0.08)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       `${Math.round(sz * 0.27)}px`,
          fontWeight:     700,
          color:          "var(--text-sub)",
        }}>
          +{rest}
        </div>
      )}
    </div>
  );
}

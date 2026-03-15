import { type ReactNode } from "react";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

interface EmptyStateProps {
  icon?:    ReactNode;
  title:    string;
  message?: string;
  action?:  ReactNode;
  color?:   string;
}

export function EmptyState({ icon, title, message, action, color = "#876cff" }: EmptyStateProps) {
  const [r,g,b] = hexToRgb(color);

  return (
    <div style={{
      position:       "relative",
      overflow:       "hidden",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      gap:            "0",
      padding:        "64px 40px",
      borderRadius:   "18px",
      background:     "linear-gradient(170deg, #1c1a28 0%, #131122 100%)",
      boxShadow:      "0 0 0 1px rgba(255,255,255,0.09), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55)",
      textAlign:      "center",
    }}>
      {/* Noise */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "128px", opacity: 0.025, pointerEvents: "none" }} />
      {/* Specular */}
      <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
      {/* Subtle radial glow behind icon */}
      {icon && (
        <div style={{
          position:   "absolute",
          top:        "50%",
          left:       "50%",
          transform:  "translate(-50%, -80%)",
          width:      "200px",
          height:     "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${r},${g},${b},0.08) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {icon && (
          <div style={{
            width:          "56px",
            height:         "56px",
            borderRadius:   "16px",
            background:     `linear-gradient(170deg, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.1) 100%)`,
            border:         `1px solid rgba(${r},${g},${b},0.3)`,
            boxShadow:      `0 1px 0 rgba(255,255,255,0.07) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 0 28px rgba(${r},${g},${b},0.12)`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color,
          }}>
            {icon}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <p style={{
            fontSize:      "15px",
            fontWeight:    800,
            color:         "var(--text)",
            letterSpacing: "-0.025em",
            lineHeight:    1.2,
          }}>
            {title}
          </p>
          {message && (
            <p style={{
              fontSize:   "13px",
              color:      "var(--text-sub)",
              maxWidth:   "300px",
              lineHeight: 1.65,
            }}>
              {message}
            </p>
          )}
        </div>

        {action && (
          <div style={{ marginTop: "4px" }}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

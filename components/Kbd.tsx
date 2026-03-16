import { type CSSProperties, Fragment } from "react";

interface KbdProps {
  keys:   string[];
  style?: CSSProperties;
}

export function Kbd({ keys, style }: KbdProps) {
  return (
    <span style={{
      display:    "inline-flex",
      alignItems: "center",
      gap:        "4px",
      ...style,
    }}>
      {keys.map((k, i) => (
        <Fragment key={i}>
          <kbd style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            minWidth:       "24px",
            height:         "22px",
            padding:        "0 7px",
            fontSize:       "11px",
            fontFamily:     "var(--mono)",
            fontWeight:     700,
            color:          "var(--text-sub)",
            background:     "linear-gradient(180deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
            border:         "1px solid rgba(255,255,255,0.12)",
            borderBottom:   "2px solid rgba(0,0,0,0.35)",
            borderRadius:   "var(--radius-sm, 8px)",
            boxShadow:      "0 1px 0 rgba(255,255,255,0.06) inset",
            whiteSpace:     "nowrap",
            userSelect:     "none",
          }}>
            {k}
          </kbd>
          {i < keys.length - 1 && (
            <span style={{
              fontSize:   "10px",
              color:      "var(--text-muted)",
              fontWeight: 600,
              userSelect: "none",
              lineHeight:  1,
            }}>
              +
            </span>
          )}
        </Fragment>
      ))}
    </span>
  );
}

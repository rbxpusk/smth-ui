import type { PropDoc } from "@/lib/docs/types";

interface PropsTableProps {
  props: PropDoc[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div style={{
      width: "100%",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "var(--radius, 12px)",
      overflow: "hidden",
      marginBottom: "32px",
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "13px",
      }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.03)" }}>
            {["Prop", "Type", "Default", "Description"].map(col => (
              <th key={col} style={{
                padding: "10px 16px",
                textAlign: "left",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--text-muted, #4a4660)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((prop, idx) => (
            <tr
              key={prop.name}
              style={{
                background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: idx < props.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              {/* Prop name */}
              <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <code style={{
                    fontFamily: "var(--mono, monospace)",
                    fontSize: "12px",
                    color: "#876cff",
                    background: "rgba(135,108,255,0.08)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}>
                    {prop.name}
                  </code>
                  {prop.required && (
                    <span style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: "#f87171",
                      background: "rgba(248,113,113,0.1)",
                      border: "1px solid rgba(248,113,113,0.25)",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}>
                      required
                    </span>
                  )}
                </div>
              </td>
              {/* Type */}
              <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
                <code style={{
                  fontFamily: "var(--mono, monospace)",
                  fontSize: "12px",
                  color: "#4ade80",
                  background: "rgba(74,222,128,0.06)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}>
                  {prop.type}
                </code>
              </td>
              {/* Default */}
              <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
                {prop.default ? (
                  <code style={{
                    fontFamily: "var(--mono, monospace)",
                    fontSize: "12px",
                    color: "var(--text-muted, #4a4660)",
                    background: "rgba(255,255,255,0.04)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}>
                    {prop.default}
                  </code>
                ) : (
                  <span style={{ color: "var(--text-muted, #4a4660)", fontSize: "12px" }}>—</span>
                )}
              </td>
              {/* Description */}
              <td style={{
                padding: "10px 16px",
                verticalAlign: "top",
                color: "var(--text-sub, #7a7596)",
                lineHeight: 1.6,
              }}>
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

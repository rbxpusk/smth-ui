"use client";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { useToc } from "@/components/docs/DocsContext";
import type { TocItem } from "@/lib/docs/types";

const TOC: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "variables", title: "CSS Variables", level: 2 },
  { id: "overriding", title: "Overriding Themes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
];

const FULL_CSS = `:root {
  /* ── Backgrounds ── */
  --bg:           #08070d;   /* Page background */
  --surface:      #111019;   /* Card / panel surface */
  --surface-hi:   #181620;   /* Elevated surface (card top) */
  --surface-lo:   #0d0b18;   /* Depressed surface (card bottom) */
  --surface-2:    #161424;   /* Secondary surface */

  /* ── Borders ── */
  --border:       rgba(255,255,255,0.07);   /* Default border */
  --border-hi:    rgba(255,255,255,0.12);   /* Emphasized border */

  /* ── Purple accent ── */
  --purple:       #876cff;
  --purple-hi:    #a393ff;
  --purple-lo:    #5c48c4;
  --purple-dim:   rgba(135,108,255,0.15);
  --purple-glow:  rgba(135,108,255,0.25);

  /* ── Semantic colors ── */
  --green:        #4ade80;
  --green-dim:    rgba(74,222,128,0.15);
  --red:          #f87171;
  --red-dim:      rgba(248,113,113,0.15);
  --yellow:       #fbbf24;
  --yellow-dim:   rgba(251,191,36,0.15);
  --blue:         #60a5fa;
  --blue-dim:     rgba(96,165,250,0.15);

  /* ── Text ── */
  --text:         #f0eeff;   /* Primary text */
  --text-sub:     #7a7596;   /* Secondary / muted text */
  --text-muted:   #4a4660;   /* Placeholder / disabled text */

  /* ── Typography ── */
  --mono:         ui-monospace, monospace;
  --sans:         ui-sans-serif, system-ui, sans-serif;
}`;

const LIGHT_OVERRIDE = `/* Apply a light theme to a specific section */
.light-section {
  --bg:        #ffffff;
  --surface:   #f8f8fc;
  --surface-hi:#f0f0f8;
  --surface-lo:#ebebf5;
  --text:      #1a1830;
  --text-sub:  #5a567a;
  --text-muted:#9998b0;
  --border:    rgba(0,0,0,0.08);
}`;

const CSS_VARS_TABLE = [
  { name: "--bg", desc: "Page background color", default: "#08070d" },
  { name: "--surface", desc: "Card / panel base surface", default: "#111019" },
  { name: "--surface-hi", desc: "Top gradient stop for cards", default: "#181620" },
  { name: "--surface-lo", desc: "Bottom gradient stop for cards", default: "#0d0b18" },
  { name: "--surface-2", desc: "Secondary panel surface", default: "#161424" },
  { name: "--border", desc: "Default border color", default: "rgba(255,255,255,0.07)" },
  { name: "--border-hi", desc: "Emphasized border color", default: "rgba(255,255,255,0.12)" },
  { name: "--purple", desc: "Primary accent color", default: "#876cff" },
  { name: "--purple-hi", desc: "Lighter purple accent", default: "#a393ff" },
  { name: "--purple-lo", desc: "Darker purple accent", default: "#5c48c4" },
  { name: "--purple-dim", desc: "Semi-transparent purple background", default: "rgba(135,108,255,0.15)" },
  { name: "--purple-glow", desc: "Purple outer glow", default: "rgba(135,108,255,0.25)" },
  { name: "--green", desc: "Success / positive color", default: "#4ade80" },
  { name: "--green-dim", desc: "Semi-transparent green", default: "rgba(74,222,128,0.15)" },
  { name: "--red", desc: "Error / danger color", default: "#f87171" },
  { name: "--red-dim", desc: "Semi-transparent red", default: "rgba(248,113,113,0.15)" },
  { name: "--yellow", desc: "Warning / attention color", default: "#fbbf24" },
  { name: "--yellow-dim", desc: "Semi-transparent yellow", default: "rgba(251,191,36,0.15)" },
  { name: "--blue", desc: "Info / link color", default: "#60a5fa" },
  { name: "--blue-dim", desc: "Semi-transparent blue", default: "rgba(96,165,250,0.15)" },
  { name: "--text", desc: "Primary text color", default: "#f0eeff" },
  { name: "--text-sub", desc: "Secondary / subdued text", default: "#7a7596" },
  { name: "--text-muted", desc: "Placeholder / disabled text", default: "#4a4660" },
  { name: "--mono", desc: "Monospace font stack", default: "ui-monospace, monospace" },
  { name: "--sans", desc: "Sans-serif font stack", default: "ui-sans-serif, system-ui, sans-serif" },
];

export default function ThemingPage() {
  useToc(TOC);

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>DOCS</p>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Theming
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
        smth UI is built entirely on CSS custom properties. Override any variable to instantly retheme the whole library.
      </p>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

      {/* Overview */}
      <h2 id="overview" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Overview
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        Every smth UI component reads its colors, radii, and font stacks from CSS variables defined on{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>:root</code>.
        There is no JavaScript theming layer — just CSS cascading as intended by the web platform.
      </p>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        This means you can scope theme overrides to any element. Wrap a section in a div with a custom
        class and the components inside inherit the overridden values automatically.
      </p>

      {/* CSS Variables */}
      <h2 id="variables" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16, marginTop: 40, letterSpacing: "-0.03em" }}>
        CSS Variables
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 20 }}>
        Below is the full list of variables used by smth UI components, their purpose, and default dark-theme values:
      </p>

      {/* Table */}
      <div style={{
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--radius, 12px)",
        overflow: "hidden",
        marginBottom: 32,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Variable", "Description", "Default"].map(col => (
                <th key={col} style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "var(--text-muted)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CSS_VARS_TABLE.map((row, idx) => (
              <tr key={row.name} style={{
                background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: idx < CSS_VARS_TABLE.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <td style={{ padding: "9px 16px" }}>
                  <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>
                    {row.name}
                  </code>
                </td>
                <td style={{ padding: "9px 16px", color: "var(--text-sub)" }}>{row.desc}</td>
                <td style={{ padding: "9px 16px" }}>
                  <code style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 4 }}>
                    {row.default}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        Copy the full default setup:
      </p>
      <CodeBlock code={FULL_CSS} language="ts" filename="app/globals.css" />

      {/* Overriding */}
      <h2 id="overriding" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Overriding Themes
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        You can scope a different theme to any subtree by overriding variables on a containing element:
      </p>
      <CodeBlock code={LIGHT_OVERRIDE} language="ts" filename="app/globals.css" />

      <div style={{
        background: "rgba(135,108,255,0.08)",
        border: "1px solid rgba(135,108,255,0.2)",
        borderRadius: "var(--radius, 12px)",
        padding: 16,
        marginBottom: 32,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M10 21h4"/>
        </svg>
        <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7, margin: 0 }}>
          You can also set CSS variables inline on a JSX element using{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>
            {"style={{ \"--purple\": \"#ff6b6b\" } as React.CSSProperties}"}
          </code>{" "}
          to temporarily override a single token.
        </p>
      </div>

      {/* Playground */}
      <h2 id="playground" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Playground
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        The{" "}
        <a href="/playground" style={{ color: "var(--purple)", textDecoration: "none" }}>
          Theme Playground
        </a>{" "}
        provides a visual interface for tuning every CSS variable in real time. When you are satisfied, click
        "Copy CSS" to get a ready-to-paste block for your{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>globals.css</code>.
      </p>
    </div>
  );
}

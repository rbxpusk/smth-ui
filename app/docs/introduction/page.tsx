"use client";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { useToc } from "@/components/docs/DocsContext";
import type { TocItem } from "@/lib/docs/types";

const TOC: TocItem[] = [
  { id: "introduction", title: "Introduction", level: 2 },
  { id: "prerequisites", title: "Prerequisites", level: 2 },
  { id: "quick-start", title: "Quick Start", level: 2 },
  { id: "theming", title: "Theming", level: 2 },
  { id: "components", title: "Components", level: 2 },
];

const INSTALL_CODE = `npm install @puskevi/smth-ui
# or
pnpm add @puskevi/smth-ui
# or
yarn add @puskevi/smth-ui`;

const QUICK_START_CODE = `import { Button } from "@puskevi/smth-ui";
import { Card } from "@puskevi/smth-ui";

export default function App() {
  return (
    <Card variant="elevated" padding="24px">
      <h2>Hello, smth UI</h2>
      <p>Your dark-first component library.</p>
      <Button pill variant="default">
        Get started
      </Button>
    </Card>
  );
}`;

const GLOBALS_CSS_CODE = `:root {
  --bg:          #08070d;
  --surface:     #111019;
  --surface-hi:  #181620;
  --surface-lo:  #0d0b18;
  --border:      rgba(255,255,255,0.07);
  --purple:      #876cff;
  --purple-hi:   #a393ff;
  --text:        #f0eeff;
  --text-sub:    #7a7596;
  --text-muted:  #4a4660;
}`;

const componentLinks = [
  { name: "Button", slug: "button", desc: "Triggers actions. Multiple variants and sizes." },
  { name: "Card", slug: "card", desc: "Versatile surface container with noise texture." },
  { name: "Input", slug: "input", desc: "Styled text input with error states." },
  { name: "Modal", slug: "modal", desc: "Dialog overlay with backdrop." },
  { name: "Badge", slug: "badge", desc: "Small label for status or category." },
  { name: "Tabs", slug: "tabs", desc: "Tabbed interface for switching content." },
  { name: "Toast", slug: "toast", desc: "Auto-dismissing notification." },
  { name: "Tooltip", slug: "tooltip", desc: "Hover popup with contextual info." },
];

export default function IntroductionPage() {
  useToc(TOC);

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Breadcrumb */}
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>
        DOCS
      </p>

      {/* Page title */}
      <h1 style={{
        fontSize: 30,
        fontWeight: 900,
        color: "var(--text)",
        letterSpacing: "-0.04em",
        marginBottom: 12,
        lineHeight: 1.1,
      }}>
        Introduction
      </h1>

      {/* Lead paragraph */}
      <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
        smth UI is a dark-first React component library built for developers who want polished UI without writing
        a thousand lines of CSS. 38 components, all styled via CSS custom properties, zero Tailwind required.
      </p>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

      {/* Introduction */}
      <h2 id="introduction" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Introduction
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        smth UI ships 38 production-ready components ranging from primitive inputs and overlays to rich display
        components like <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>StatCard</code>,{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>Timeline</code>, and{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>DigitCounter</code>.
        Every component is styled entirely with inline{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>style={"{{}}"}</code> props
        backed by CSS custom properties — making it trivially easy to theme via a single root override.
      </p>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        The library is designed for Next.js App Router projects but works with any React setup. It requires no
        additional runtime dependencies or build plugins.
      </p>

      {/* Callout */}
      <div style={{
        background: "rgba(96,165,250,0.06)",
        border: "1px solid rgba(96,165,250,0.15)",
        borderRadius: "var(--radius, 12px)",
        padding: 16,
        marginBottom: 32,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
        </svg>
        <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7, margin: 0 }}>
          All components use inline styles and CSS variables — no Tailwind classes, no CSS modules, no PostCSS
          configuration. Just install and import.
        </p>
      </div>

      {/* Prerequisites */}
      <h2 id="prerequisites" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Prerequisites
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        smth UI requires React 18+ and works best with Next.js 14 App Router. Install it from npm:
      </p>
      <CodeBlock code={INSTALL_CODE} language="bash" filename="terminal" />

      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        After installing, add the CSS variable definitions to your global stylesheet. See the{" "}
        <a href="/docs/theming" style={{ color: "var(--purple)", textDecoration: "none" }}>Theming</a> page
        for the full reference, or copy the minimal setup below:
      </p>
      <CodeBlock code={GLOBALS_CSS_CODE} language="css" filename="app/globals.css" />

      {/* Quick Start */}
      <h2 id="quick-start" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Quick Start
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        Import any component directly from the package and use it in your JSX. No provider wrapping required
        for most components.
      </p>
      <CodeBlock code={QUICK_START_CODE} language="tsx" filename="app/page.tsx" />

      <div style={{
        background: "rgba(251,191,36,0.05)",
        border: "1px solid rgba(251,191,36,0.15)",
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
          For overlay components like <strong style={{ color: "var(--text)" }}>Toast</strong> and{" "}
          <strong style={{ color: "var(--text)" }}>Modal</strong> make sure to mark the parent file as{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>"use client"</code>.
        </p>
      </div>

      {/* Theming */}
      <h2 id="theming" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Theming
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        Every visual property — backgrounds, borders, text colors, radii — is driven by a CSS custom property.
        Override any variable on <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>:root</code> or
        any ancestor element to theme all child components at once.
      </p>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        The{" "}
        <a href="/playground" style={{ color: "var(--purple)", textDecoration: "none" }}>Theme Playground</a>{" "}
        lets you visually tweak every variable and copy the resulting CSS block. See the full variable
        reference on the <a href="/docs/theming" style={{ color: "var(--purple)", textDecoration: "none" }}>Theming</a> page.
      </p>

      {/* Components */}
      <h2 id="components" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16, marginTop: 40, letterSpacing: "-0.03em" }}>
        Components
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 20 }}>
        Browse the full component catalog below or use the sidebar to jump to a specific component.
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12,
        marginBottom: 40,
      }}>
        {componentLinks.map(c => (
          <a
            key={c.slug}
            href={`/docs/components/${c.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "var(--radius, 12px)",
              padding: "14px 16px",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(135,108,255,0.35)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(135,108,255,0.05)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{c.name}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>{c.desc}</p>
            </div>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8 }}>
        View the{" "}
        <a href="/docs/components" style={{ color: "var(--purple)", textDecoration: "none" }}>
          full components list
        </a>{" "}
        for all 38 components.
      </p>
    </div>
  );
}

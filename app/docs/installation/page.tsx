"use client";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { useToc } from "@/components/docs/DocsContext";
import type { TocItem } from "@/lib/docs/types";

const TOC: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "css-setup", title: "CSS Setup", level: 2 },
  { id: "importing", title: "Importing Components", level: 2 },
  { id: "next-js", title: "Next.js Setup", level: 2 },
];

const INSTALL_CODE = `npm install @puskevi/smth-ui
# or
pnpm add @puskevi/smth-ui
# or
yarn add @puskevi/smth-ui`;

const GLOBALS_CSS_CODE = `/* app/globals.css */
:root {
  --bg:           #08070d;
  --surface:      #111019;
  --surface-hi:   #181620;
  --surface-lo:   #0d0b18;
  --border:       rgba(255,255,255,0.07);
  --border-hi:    rgba(255,255,255,0.12);
  --purple:       #876cff;
  --purple-hi:    #a393ff;
  --purple-lo:    #5c48c4;
  --purple-dim:   rgba(135,108,255,0.15);
  --purple-glow:  rgba(135,108,255,0.25);
  --green:        #4ade80;
  --green-dim:    rgba(74,222,128,0.15);
  --red:          #f87171;
  --red-dim:      rgba(248,113,113,0.15);
  --yellow:       #fbbf24;
  --yellow-dim:   rgba(251,191,36,0.15);
  --blue:         #60a5fa;
  --blue-dim:     rgba(96,165,250,0.15);
  --text:         #f0eeff;
  --text-muted:   #4a4660;
  --text-sub:     #7a7596;
  --mono:         ui-monospace, monospace;
  --sans:         ui-sans-serif, system-ui, sans-serif;
}

/* Apply base styles */
html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}`;

const IMPORT_CODE = `// Named imports — tree-shakeable
import { Button } from "@puskevi/smth-ui";
import { Card } from "@puskevi/smth-ui";
import { Input } from "@puskevi/smth-ui";

// Or import multiple at once
import { Button, Card, Badge, Tooltip } from "@puskevi/smth-ui";`;

const NEXT_LAYOUT_CODE = `// app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const CLIENT_CODE = `"use client";
import { useState } from "react";
import { Modal } from "@puskevi/smth-ui";

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Hello">
        <p>Modal content here.</p>
      </Modal>
    </>
  );
}`;

export default function InstallationPage() {
  useToc(TOC);

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>DOCS</p>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Installation
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
        Get smth UI set up in your project in under two minutes.
      </p>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

      {/* Installation */}
      <h2 id="installation" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Installation
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        Install the package from npm using your preferred package manager:
      </p>
      <CodeBlock code={INSTALL_CODE} language="bash" filename="terminal" />

      {/* CSS Setup */}
      <h2 id="css-setup" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        CSS Setup
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        smth UI components read their visual properties from CSS custom properties on{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>:root</code>.
        Add the following to your global stylesheet:
      </p>
      <CodeBlock code={GLOBALS_CSS_CODE} language="css" filename="app/globals.css" />

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
          You can override any variable scoped to a subtree to theme specific sections of your app independently.
          See the <a href="/docs/theming" style={{ color: "var(--purple)", textDecoration: "none" }}>Theming</a> page
          for the full reference.
        </p>
      </div>

      {/* Importing Components */}
      <h2 id="importing" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Importing Components
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        All 38 components are named exports. Import only what you need — bundlers will tree-shake the rest:
      </p>
      <CodeBlock code={IMPORT_CODE} language="tsx" filename="app/page.tsx" />

      {/* Next.js Setup */}
      <h2 id="next-js" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12, marginTop: 40, letterSpacing: "-0.03em" }}>
        Next.js Setup
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        Import your global stylesheet in the root layout. No additional configuration is required:
      </p>
      <CodeBlock code={NEXT_LAYOUT_CODE} language="tsx" filename="app/layout.tsx" />

      <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
        For interactive components that use React state (Modal, Toast, Drawer, etc.), mark the file as a client
        component with the{" "}
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--purple)", background: "rgba(135,108,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>"use client"</code>{" "}
        directive:
      </p>
      <CodeBlock code={CLIENT_CODE} language="tsx" filename="app/page.tsx" />
    </div>
  );
}

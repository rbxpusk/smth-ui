"use client";
import { getAllComponents } from "@/lib/docs/registry";
import { Card } from "@/components/Card";
import { useToc } from "@/components/docs/DocsContext";
import type { TocItem } from "@/lib/docs/types";

const TOC: TocItem[] = [
  { id: "components", title: "All Components", level: 2 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Input: "rgba(135,108,255,0.12)",
  Display: "rgba(96,165,250,0.12)",
  Layout: "rgba(74,222,128,0.10)",
  Feedback: "rgba(251,191,36,0.12)",
  Overlay: "rgba(248,113,113,0.10)",
  Navigation: "rgba(163,147,255,0.12)",
};

const CATEGORY_TEXT: Record<string, string> = {
  Input: "#a393ff",
  Display: "#60a5fa",
  Layout: "#4ade80",
  Feedback: "#fbbf24",
  Overlay: "#f87171",
  Navigation: "#c4b8ff",
};

export default function ComponentsPage() {
  useToc(TOC);
  const components = getAllComponents();

  return (
    <div style={{ maxWidth: 900 }}>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>DOCS</p>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Components
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
        {components.length} components available. Click any card to see props, examples, and usage code.
      </p>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

      <h2 id="components" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.03em" }}>
        All Components
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
      }}>
        {components.map(comp => (
          <a key={comp.slug} href={`/docs/components/${comp.slug}`} style={{ textDecoration: "none" }}>
            <Card
              variant="default"
              padding="18px 20px"
              onClick={() => {}}
              style={{ height: "100%" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                }}>
                  {comp.name}
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  color: CATEGORY_TEXT[comp.category] ?? "var(--text-sub)",
                  background: CATEGORY_COLORS[comp.category] ?? "rgba(255,255,255,0.06)",
                  padding: "2px 7px",
                  borderRadius: 6,
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                  marginLeft: 8,
                }}>
                  {comp.category}
                </span>
              </div>
              <p style={{
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}>
                {comp.description}
              </p>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useParams } from "next/navigation";
import { getComponentDoc } from "@/lib/docs/registry";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { useToc } from "@/components/docs/DocsContext";
import type { TocItem } from "@/lib/docs/types";

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const PREVIEW_PANEL_STYLE = {
  background: "rgba(255,255,255,0.02)",
  backgroundImage: [
    "linear-gradient(45deg, rgba(255,255,255,0.015) 25%, transparent 25%)",
    "linear-gradient(-45deg, rgba(255,255,255,0.015) 25%, transparent 25%)",
    "linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.015) 75%)",
    "linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.015) 75%)",
  ].join(", "),
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "var(--radius, 12px)",
  padding: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap" as const,
  gap: 16,
  marginBottom: 24,
};

const SECTION_LABEL_STYLE = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--text-muted)",
  marginBottom: 12,
};

const H2_STYLE = {
  fontSize: 18,
  fontWeight: 800,
  color: "var(--text)" as const,
  marginBottom: 12,
  marginTop: 40,
  letterSpacing: "-0.03em",
};

const H3_STYLE = {
  fontSize: 14,
  fontWeight: 700,
  color: "var(--text)" as const,
  marginBottom: 8,
  marginTop: 32,
  letterSpacing: "-0.02em",
};

const DIVIDER_STYLE = {
  height: 1,
  background: "rgba(255,255,255,0.06)",
  margin: "32px 0",
};

export default function ComponentDocPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const doc = getComponentDoc(slug);

  const toc: TocItem[] = doc
    ? [
        { id: "preview", title: "Preview", level: 2 },
        { id: "usage", title: "Usage", level: 2 },
        { id: "props", title: "Props", level: 2 },
        ...(doc.examples.length > 1
          ? [
              { id: "examples", title: "Examples", level: 2 as const },
              ...doc.examples.slice(1).map(ex => ({
                id: slugify(ex.title),
                title: ex.title,
                level: 3 as const,
              })),
            ]
          : []),
      ]
    : [];

  useToc(toc);

  if (!doc) {
    return (
      <div style={{ maxWidth: 720 }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>
          DOCS / COMPONENTS
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 16, lineHeight: 1.1, textTransform: "capitalize" }}>
          {slug}
        </h1>
        <div style={{
          background: "rgba(135,108,255,0.08)",
          border: "1px solid rgba(135,108,255,0.2)",
          borderRadius: "var(--radius, 12px)",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 8,
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>Coming soon</p>
          <p style={{ fontSize: 14, color: "var(--text-sub)", margin: 0, lineHeight: 1.7 }}>
            Documentation for{" "}
            <strong style={{ color: "var(--text)", textTransform: "capitalize" }}>{slug}</strong>{" "}
            is not yet available. Check back soon or browse the{" "}
            <a href="/docs/components" style={{ color: "var(--purple)", textDecoration: "none" }}>components list</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Breadcrumb */}
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>
        <a href="/docs/components" style={{ color: "var(--text-muted)", textDecoration: "none" }}>COMPONENTS</a>
        {" / "}
        <span style={{ color: "var(--text-sub)" }}>{doc.name.toUpperCase()}</span>
      </p>

      {/* Title */}
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        {doc.name}
      </h1>

      {/* Description */}
      <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
        {doc.description}
      </p>

      <div style={DIVIDER_STYLE} />

      {/* Preview — shows first example so preview matches code */}
      <h2 id="preview" style={H2_STYLE}>Preview</h2>
      <p style={SECTION_LABEL_STYLE}>LIVE PREVIEW</p>
      {doc.examples.length > 0 ? (
        <>
          <div style={PREVIEW_PANEL_STYLE}>
            {doc.examples[0].preview}
          </div>
          <CodeBlock code={doc.examples[0].code} language="tsx" />
        </>
      ) : (
        <div style={{ ...PREVIEW_PANEL_STYLE, minHeight: 120, justifyContent: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>No preview available</p>
        </div>
      )}

      <div style={DIVIDER_STYLE} />

      {/* Usage */}
      <h2 id="usage" style={H2_STYLE}>Usage</h2>
      <CodeBlock code={doc.usage} language="tsx" filename={`${doc.name}.tsx`} />

      <div style={DIVIDER_STYLE} />

      {/* Props */}
      <h2 id="props" style={H2_STYLE}>Props</h2>
      {doc.props.length > 0 ? (
        <PropsTable props={doc.props} />
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>This component has no configurable props.</p>
      )}

      {/* Examples — skip first (already shown in Preview) */}
      {doc.examples.length > 1 && (
        <>
          <div style={DIVIDER_STYLE} />
          <h2 id="examples" style={H2_STYLE}>Examples</h2>
          {doc.examples.slice(1).map(ex => (
            <div key={ex.title}>
              <h3 id={slugify(ex.title)} style={H3_STYLE}>{ex.title}</h3>
              {ex.description && (
                <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 16 }}>
                  {ex.description}
                </p>
              )}
              <div style={PREVIEW_PANEL_STYLE}>
                {ex.preview}
              </div>
              <CodeBlock code={ex.code} language="tsx" />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

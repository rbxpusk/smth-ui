"use client";
import { useToc } from "@/components/docs/DocsContext";
import type { TocItem } from "@/lib/docs/types";

const TOC: TocItem[] = [
  { id: "changelog", title: "Changelog", level: 2 },
  { id: "v1-0-0", title: "v1.0.0", level: 3 },
];

const RELEASES = [
  {
    version: "v1.0.0",
    date: "March 2025",
    badge: "Initial Release",
    badgeColor: "#4ade80",
    badgeBg: "rgba(74,222,128,0.12)",
    items: [
      "Initial release of 38 components",
      "Dark-first design system built on CSS custom properties",
      "Accordion, Alert, Avatar, Badge, Banner, Breadcrumb",
      "Button, Card, CodeDisplay, ColorPicker, Combobox",
      "DigitCounter, Divider, Drawer, DropdownMenu, EmptyState",
      "Input, Kbd, Modal, Notifications, NumberInput, Pagination",
      "Popover, Progress, Select, Sheet, Skeleton, Slider",
      "Spinner, StatCard, Stepper, Table, Tabs, TagInput",
      "Timeline, Toast, Toggle, Tooltip",
      "Full TypeScript support — all props typed",
      "Zero dependencies beyond React 18",
      "Theme Playground for live CSS variable customization",
    ],
  },
];

export default function ChangelogPage() {
  useToc(TOC);

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>DOCS</p>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Changelog
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
        A history of updates, new components, and breaking changes.
      </p>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

      <h2 id="changelog" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 24, letterSpacing: "-0.03em" }}>
        Releases
      </h2>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: 7,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(135,108,255,0.2)",
        }} />

        {RELEASES.map((release, idx) => (
          <div key={release.version} style={{ paddingLeft: 32, marginBottom: 48, position: "relative" }}>
            {/* Dot */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 4,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: idx === 0 ? "var(--purple)" : "var(--surface-hi)",
              border: `2px solid ${idx === 0 ? "var(--purple-hi)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: idx === 0 ? "0 0 12px rgba(135,108,255,0.5)" : "none",
            }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3 id={`v${release.version.replace(/\./g, "-").replace("v", "")}-0`} style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.03em",
                margin: 0,
              }}>
                {release.version}
              </h3>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                color: release.badgeColor,
                background: release.badgeBg,
                padding: "2px 8px",
                borderRadius: 6,
              }}>
                {release.badge}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>{release.date}</p>

            {/* Items */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {release.items.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "var(--purple)", fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

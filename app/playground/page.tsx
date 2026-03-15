"use client";
import { useState, useCallback } from "react";

import { Button }                   from "@/components/Button";
import { Badge }                    from "@/components/Badge";
import { Card }                     from "@/components/Card";
import { StatCard }                 from "@/components/StatCard";
import { Input, Textarea }          from "@/components/Input";
import { Select }                   from "@/components/Select";
import { NumberInput }              from "@/components/NumberInput";
import { TagInput }                 from "@/components/TagInput";
import { Progress }                 from "@/components/Progress";
import { Toggle, Checkbox, Radio }  from "@/components/Toggle";
import { Tabs }                     from "@/components/Tabs";
import { Avatar, AvatarGroup }      from "@/components/Avatar";
import { Alert }                    from "@/components/Alert";
import { Modal }                    from "@/components/Modal";
import { Drawer }                   from "@/components/Drawer";
import { Accordion }                from "@/components/Accordion";
import { Breadcrumb }               from "@/components/Breadcrumb";
import { Pagination }               from "@/components/Pagination";
import { DropdownMenu }             from "@/components/DropdownMenu";
import { Popover }                  from "@/components/Popover";
import { Tooltip }                  from "@/components/Tooltip";
import { Spinner }                  from "@/components/Spinner";
import { Skeleton }                 from "@/components/Skeleton";
import { Divider }                  from "@/components/Divider";
import { Kbd }                      from "@/components/Kbd";
import { EmptyState }               from "@/components/EmptyState";
import { Table, type TableColumn }  from "@/components/Table";
import { toast }                    from "@/components/Toast";

// ─── Theme ────────────────────────────────────────────────────────────────────

interface Theme {
  primary:   string;
  bg:        string;
  surface:   string;
  surfaceLo: string;
  text:      string;
  textSub:   string;
  textMuted: string;
  radius:    number;   // base px
  noise:     boolean;
  specular:  boolean;
  glow:      boolean;
  blur:      number;
}

const PRESETS: Record<string, Theme> = {
  default: {
    primary: "#876cff", bg: "#08070d", surface: "#1c1a28", surfaceLo: "#131122",
    text: "#f0eeff", textSub: "#7a7596", textMuted: "#4a4660",
    radius: 12, noise: true, specular: true, glow: true, blur: 16,
  },
  neon: {
    primary: "#00d4ff", bg: "#00070a", surface: "#001a20", surfaceLo: "#00111a",
    text: "#e0faff", textSub: "#2a8a9f", textMuted: "#115566",
    radius: 6, noise: false, specular: true, glow: true, blur: 20,
  },
  rose: {
    primary: "#f43f5e", bg: "#0d0608", surface: "#1e0d10", surfaceLo: "#14080b",
    text: "#ffe0e6", textSub: "#8a5560", textMuted: "#5a3039",
    radius: 16, noise: true, specular: true, glow: true, blur: 14,
  },
  candy: {
    primary: "#d946ef", bg: "#0a020d", surface: "#1a0c1e", surfaceLo: "#120815",
    text: "#fde0ff", textSub: "#8a4a96", textMuted: "#5a2f62",
    radius: 20, noise: true, specular: true, glow: true, blur: 18,
  },
  amber: {
    primary: "#f59e0b", bg: "#0d0a02", surface: "#1e1a08", surfaceLo: "#141105",
    text: "#fff8e0", textSub: "#8a7540", textMuted: "#5a4c20",
    radius: 8, noise: false, specular: true, glow: true, blur: 10,
  },
  slate: {
    primary: "#94a3b8", bg: "#08090d", surface: "#111318", surfaceLo: "#0c0e13",
    text: "#e2e8f0", textSub: "#64748b", textMuted: "#334155",
    radius: 4, noise: false, specular: false, glow: false, blur: 0,
  },
};

function hexToRgb(hex: string): [number,number,number] {
  const h = hex.replace("#","");
  return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
}
function lighten(hex: string, amt = 36) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex: string, amt = 28) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [theme, setTheme]           = useState<Theme>(PRESETS.default);
  const [activePreset, setPreset]   = useState("default");
  const [copied, setCopied]         = useState(false);

  // component demo states
  const [tog1, setTog1]             = useState(true);
  const [tog2, setTog2]             = useState(false);
  const [chk1, setChk1]             = useState(true);
  const [chk2, setChk2]             = useState(false);
  const [radio, setRadio]           = useState("a");
  const [selectVal, setSelectVal]   = useState("react");
  const [numVal, setNumVal]         = useState(42);
  const [tags, setTags]             = useState(["react", "typescript"]);
  const [page, setPage]             = useState(3);
  const [modalOpen, setModalOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const set = useCallback((key: keyof Theme, value: unknown) => {
    setTheme(t => ({ ...t, [key]: value }));
    setPreset("custom");
  }, []);

  const applyPreset = (name: string) => { setTheme(PRESETS[name]); setPreset(name); };

  const [r,g,b] = hexToRgb(theme.primary);

  const exportCSS = `/* smth-ui — custom theme */
:root {
  --bg:          ${theme.bg};
  --surface:     ${theme.surface};
  --surface-lo:  ${theme.surfaceLo};
  --text:        ${theme.text};
  --text-sub:    ${theme.textSub};
  --text-muted:  ${theme.textMuted};
  --purple:      ${theme.primary};
  --purple-hi:   ${lighten(theme.primary, 28)};
  --purple-lo:   ${darken(theme.primary, 24)};
  --border:      rgba(255,255,255,0.08);
  --border-hi:   rgba(255,255,255,0.13);
  --radius:      ${theme.radius}px;
  --radius-sm:   ${Math.round(theme.radius * 0.55)}px;
  --radius-lg:   ${Math.round(theme.radius * 1.4)}px;
}`;

  function copyCSS() {
    navigator.clipboard.writeText(exportCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Inject all CSS vars — components read these automatically
  const cssVars = `
    .pg-preview {
      --bg:          ${theme.bg};
      --surface:     ${theme.surface};
      --surface-lo:  ${theme.surfaceLo};
      --text:        ${theme.text};
      --text-sub:    ${theme.textSub};
      --text-muted:  ${theme.textMuted};
      --purple:      ${theme.primary};
      --purple-hi:   ${lighten(theme.primary, 28)};
      --purple-lo:   ${darken(theme.primary, 24)};
      --purple-dim:  rgba(${r},${g},${b},0.15);
      --purple-glow: rgba(${r},${g},${b},0.25);
      --border:      rgba(255,255,255,0.08);
      --border-hi:   rgba(255,255,255,0.13);
      --radius:      ${theme.radius}px;
      --radius-sm:   ${Math.round(theme.radius * 0.55)}px;
      --radius-lg:   ${Math.round(theme.radius * 1.4)}px;
      color:         ${theme.text};
    }
  `;

  // Card radius scales slightly bigger than base
  const cardRadius = `${Math.round(theme.radius * 1.3)}px`;
  const btnRadius  = `${theme.radius}px`;

  const tableData: Record<string,unknown>[] = [
    { name: "Alice Johnson", role: "Engineer",  status: "active",   joined: "Jan 2024" },
    { name: "Bob Smith",     role: "Designer",  status: "active",   joined: "Mar 2024" },
    { name: "Carol White",   role: "PM",        status: "inactive", joined: "Jun 2023" },
    { name: "Dan Brown",     role: "Engineer",  status: "active",   joined: "Sep 2023" },
  ];
  const tableColumns: TableColumn[] = [
    { key: "name",   label: "Name",   render: (v) => <span style={{ fontWeight: 600, color: theme.text }}>{String(v)}</span> },
    { key: "role",   label: "Role"   },
    { key: "status", label: "Status", render: (v) =>
      <Badge color={v === "active" ? "#4ade80" : theme.textMuted} dot={v === "active"} size="sm">{String(v)}</Badge>
    },
    { key: "joined", label: "Joined" },
  ];

  return (
    <div style={{
      display:    "flex",
      minHeight:  "100vh",
      background: "#08070d",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      color:      "#f0eeff",
      WebkitFontSmoothing: "antialiased",
    }}>
      <style>{cssVars}</style>

      {/* ══ Sidebar ══════════════════════════════════════════════════════════ */}
      <aside style={{
        width:       "288px",
        flexShrink:  0,
        position:    "sticky",
        top:         0,
        height:      "100vh",
        overflowY:   "auto",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        background:  "linear-gradient(180deg, #111019 0%, #0d0b18 100%)",
        display:     "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
              background: `linear-gradient(145deg, ${lighten(theme.primary, 30)}, ${theme.primary})`,
              boxShadow: `0 0 14px rgba(${r},${g},${b},0.5)`,
              transition: "all 0.3s",
            }} />
            <div>
              <p style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "-0.02em" }}>Theme Playground</p>
              <p style={{ fontSize: "10px", color: "#4a4660", marginTop: "1px" }}>Customize every aspect live</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "22px", flex: 1 }}>

          {/* ── Presets ─────────────────────────────────────── */}
          <SideSection label="Presets">
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {Object.entries(PRESETS).map(([name, p]) => {
                const active = activePreset === name;
                const [pr,pg,pb] = hexToRgb(p.primary);
                return (
                  <button key={name} onClick={() => applyPreset(name)} style={{
                    display:     "flex",
                    alignItems:  "center",
                    gap:         "10px",
                    padding:     "8px 10px",
                    borderRadius: "9px",
                    cursor:      "pointer",
                    transition:  "all 0.14s",
                    background:  active ? `rgba(${pr},${pg},${pb},0.12)` : "rgba(255,255,255,0.02)",
                    border:      active ? `1px solid rgba(${pr},${pg},${pb},0.3)` : "1px solid transparent",
                    textAlign:   "left",
                  }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "7px", flexShrink: 0,
                      background: `linear-gradient(145deg, ${lighten(p.primary,30)}, ${darken(p.primary,10)})`,
                      boxShadow: active ? `0 0 10px rgba(${pr},${pg},${pb},0.4)` : "none",
                      transition: "box-shadow 0.2s",
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: active ? "#fff" : "#7a7596", textTransform: "capitalize" }}>{name}</p>
                      <p style={{ fontSize: "10px", color: active ? `rgba(${pr},${pg},${pb},0.9)` : "#4a4660", fontFamily: "monospace" }}>{p.primary}</p>
                    </div>
                    {active && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </SideSection>

          {/* ── Colors ─────────────────────────────────────── */}
          <SideSection label="Colors">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <ColorRow label="Primary"      value={theme.primary}   onChange={v => set("primary",   v)} />
              <ColorRow label="Background"   value={theme.bg}        onChange={v => set("bg",        v)} />
              <ColorRow label="Surface"      value={theme.surface}   onChange={v => set("surface",   v)} />
              <ColorRow label="Surface dark" value={theme.surfaceLo} onChange={v => set("surfaceLo", v)} />
              <ColorRow label="Text"         value={theme.text}      onChange={v => set("text",      v)} />
              <ColorRow label="Text sub"     value={theme.textSub}   onChange={v => set("textSub",   v)} />
              <ColorRow label="Text muted"   value={theme.textMuted} onChange={v => set("textMuted", v)} />
            </div>
          </SideSection>

          {/* ── Shape ──────────────────────────────────────── */}
          <SideSection label="Shape">
            <SliderRow label="Border radius" value={theme.radius} min={0} max={24} step={1} display={`${theme.radius}px`} onChange={v => set("radius", v)} />
          </SideSection>

          {/* ── Effects ────────────────────────────────────── */}
          <SideSection label="Effects">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ToggleRow label="Noise texture"       value={theme.noise}    onChange={v => set("noise",    v)} />
              <ToggleRow label="Specular highlights" value={theme.specular} onChange={v => set("specular", v)} />
              <ToggleRow label="Glow effects"        value={theme.glow}     onChange={v => set("glow",     v)} />
              <SliderRow label="Backdrop blur" value={theme.blur} min={0} max={40} step={2} display={`${theme.blur}px`} onChange={v => set("blur", v)} />
            </div>
          </SideSection>

          {/* ── Export ─────────────────────────────────────── */}
          <SideSection label="Export CSS">
            <div style={{ borderRadius: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <pre style={{
                padding: "12px 14px", fontSize: "10px", lineHeight: 1.7,
                color: "#7a7596", fontFamily: "ui-monospace, monospace",
                overflowX: "auto", margin: 0, maxHeight: "160px", overflowY: "auto",
              }}>
                {exportCSS}
              </pre>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 14px" }}>
                <button onClick={copyCSS} style={{
                  width: "100%", padding: "8px", borderRadius: "8px",
                  background: copied ? "rgba(74,222,128,0.12)" : `rgba(${r},${g},${b},0.12)`,
                  border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : `rgba(${r},${g},${b},0.3)`}`,
                  color: copied ? "#4ade80" : theme.primary,
                  fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}>
                  {copied
                    ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Copied!</>
                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy CSS</>
                  }
                </button>
              </div>
            </div>
          </SideSection>
        </div>
      </aside>

      {/* ══ Preview ═══════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, overflowY: "auto", background: theme.bg, transition: "background 0.3s", padding: "48px 56px 80px" }}>
        {/* Ambient glow */}
        <div style={{
          position: "fixed", top: 0, left: "288px", right: 0, height: "400px",
          background: `radial-gradient(ellipse at 50% -20%, rgba(${r},${g},${b},0.1) 0%, transparent 60%)`,
          pointerEvents: "none", transition: "background 0.3s", zIndex: 0,
        }} />

        {/* .pg-preview picks up all --vars injected above */}
        <div className="pg-preview" style={{ position: "relative", zIndex: 1, maxWidth: "660px", margin: "0 auto" }}>

          {/* Title */}
          <div style={{ marginBottom: "52px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.05em", color: theme.text, lineHeight: 1, marginBottom: "8px" }}>
              Live Preview
            </h1>
            <p style={{ fontSize: "13px", color: theme.textSub, lineHeight: 1.6 }}>
              All components update live. Pass <code style={{ fontFamily: "monospace", fontSize: "12px", background: `rgba(${r},${g},${b},0.12)`, color: theme.primary, padding: "1px 6px", borderRadius: "4px" }}>color=&#34;{theme.primary}&#34;</code> to override any component's accent.
            </p>
          </div>

          {/* ── Buttons ───────────────────────────────────── */}
          <Sec title="Buttons" muted={theme.textMuted}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <Button color={theme.primary} style={{ borderRadius: btnRadius }}>Primary</Button>
              <Button variant="secondary" style={{ borderRadius: btnRadius }}>Secondary</Button>
              <Button variant="ghost" style={{ borderRadius: btnRadius }}>Ghost</Button>
              <Button variant="danger" style={{ borderRadius: btnRadius }}>Danger</Button>
              <Button variant="outline" style={{ borderRadius: btnRadius }}>Outline</Button>
              <Button color={theme.primary} pill style={{ borderRadius: btnRadius }}>Pill</Button>
              <Button color={theme.primary} size="sm" style={{ borderRadius: btnRadius }}>Small</Button>
              <Button color={theme.primary} loading style={{ borderRadius: btnRadius }}>Loading</Button>
              <Button color={theme.primary} disabled style={{ borderRadius: btnRadius }}>Disabled</Button>
            </div>
          </Sec>

          {/* ── Badges ────────────────────────────────────── */}
          <Sec title="Badges" muted={theme.textMuted}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <Badge color={theme.primary} dot>Active</Badge>
              <Badge color={theme.primary}>Default</Badge>
              <Badge color="#4ade80" dot>Online</Badge>
              <Badge color="#f87171">Error</Badge>
              <Badge color="#fbbf24">Warning</Badge>
              <Badge color="#60a5fa">Info</Badge>
              <Badge color={theme.primary} size="sm">Small</Badge>
              <Badge color={theme.primary} size="lg">Large</Badge>
              <Badge color={theme.primary} removable onRemove={() => {}}>Removable</Badge>
            </div>
          </Sec>

          {/* ── Cards ─────────────────────────────────────── */}
          <Sec title="Cards" muted={theme.textMuted}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Card radius={cardRadius} noise={theme.noise} specular={theme.specular}>
                <p style={{ fontSize: "11px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "6px" }}>Default</p>
                <p style={{ fontSize: "18px", fontWeight: 900, color: theme.text, letterSpacing: "-0.03em" }}>Card component</p>
                <p style={{ fontSize: "12px", color: theme.textSub, marginTop: "5px" }}>Pass any content as children.</p>
              </Card>
              <Card radius={cardRadius} variant="outlined" noise={theme.noise} specular={theme.specular}>
                <p style={{ fontSize: "11px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "6px" }}>Outlined</p>
                <p style={{ fontSize: "18px", fontWeight: 900, color: theme.text, letterSpacing: "-0.03em" }}>Outlined</p>
                <p style={{ fontSize: "12px", color: theme.textSub, marginTop: "5px" }}>Higher border opacity.</p>
              </Card>
              <Card radius={cardRadius} variant="success" noise={theme.noise} specular={theme.specular}>
                <p style={{ fontSize: "13px", color: "#4ade80", fontWeight: 700, marginBottom: "4px" }}>Success variant</p>
                <p style={{ fontSize: "12px", color: theme.textSub }}>Green glow border.</p>
              </Card>
              <Card radius={cardRadius} variant="danger" noise={theme.noise} specular={theme.specular}>
                <p style={{ fontSize: "13px", color: "#f87171", fontWeight: 700, marginBottom: "4px" }}>Danger variant</p>
                <p style={{ fontSize: "12px", color: theme.textSub }}>Red glow border.</p>
              </Card>
            </div>
          </Sec>

          {/* ── Stat Cards ────────────────────────────────── */}
          <Sec title="Stat Cards" muted={theme.textMuted}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <StatCard
                label="Active users" value="12,480" sub="Last 30 days" color={theme.primary}
                trend={{ value: "+8.2%", positive: true }}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              />
              <StatCard
                label="Revenue" value="$48.2K" sub="This month" color="#4ade80"
                trend={{ value: "+12.4%", positive: true }}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              />
            </div>
          </Sec>

          {/* ── Inputs ────────────────────────────────────── */}
          <Sec title="Inputs" muted={theme.textMuted}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
              <Input label="Email" placeholder="you@example.com" color={theme.primary} />
              <Input label="With icon" placeholder="Search…" color={theme.primary}
                iconLeft={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
              />
              <Input label="Error state" placeholder="username" color={theme.primary} error="This field is required" />
              <Select label="Framework" value={selectVal} onChange={setSelectVal} color={theme.primary}
                options={[
                  { value: "react",  label: "React" },
                  { value: "vue",    label: "Vue" },
                  { value: "svelte", label: "Svelte" },
                  { value: "solid",  label: "Solid" },
                ]}
              />
              <NumberInput label="Quantity" value={numVal} onChange={v => setNumVal(v)} min={0} max={100} />
              <TagInput label="Tags" tags={tags} onChange={setTags} color={theme.primary} placeholder="Add tag…" />
              <Textarea label="Message" placeholder="Enter a message…" color={theme.primary} rows={3} />
            </div>
          </Sec>

          {/* ── Progress ──────────────────────────────────── */}
          <Sec title="Progress" muted={theme.textMuted}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "440px" }}>
              <Progress value={72}  color={theme.primary} label="Storage"   showValue />
              <Progress value={45}  color="#4ade80"        label="Bandwidth" showValue />
              <Progress value={88}  color="#f87171"        label="CPU"       showValue />
              <Progress value={30}  color="#fbbf24"        size="sm" label="Memory" showValue />
              <Progress value={60}  color={theme.primary}  size="lg" label="Upload"  showValue />
            </div>
          </Sec>

          {/* ── Controls ──────────────────────────────────── */}
          <Sec title="Controls" muted={theme.textMuted}>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.textMuted }}>Toggle</p>
                <Toggle checked={tog1} onChange={setTog1} label="Notifications" color={theme.primary} />
                <Toggle checked={tog2} onChange={setTog2} label="Dark mode"      color={theme.primary} />
                <Toggle checked={true} onChange={() => {}} label="Disabled"      color={theme.primary} disabled />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.textMuted }}>Checkbox</p>
                <Checkbox checked={chk1} onChange={setChk1} label="Accept terms" color={theme.primary} />
                <Checkbox checked={chk2} onChange={setChk2} label="Subscribe"    color={theme.primary} />
                <Checkbox checked={false} onChange={() => {}} label="Disabled"   color={theme.primary} disabled />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.textMuted }}>Radio</p>
                <Radio checked={radio === "a"} onChange={() => setRadio("a")} label="Option A" color={theme.primary} />
                <Radio checked={radio === "b"} onChange={() => setRadio("b")} label="Option B" color={theme.primary} />
                <Radio checked={radio === "c"} onChange={() => setRadio("c")} label="Option C" color={theme.primary} />
              </div>
            </div>
          </Sec>

          {/* ── Tabs ──────────────────────────────────────── */}
          <Sec title="Tabs" muted={theme.textMuted}>
            <Tabs color={theme.primary}
              tabs={[
                { id: "overview",  label: "Overview",  badge: 3 },
                { id: "analytics", label: "Analytics" },
                { id: "settings",  label: "Settings"  },
              ]}
            >
              {id => (
                <Card radius={cardRadius} noise={theme.noise} specular={theme.specular} padding="16px">
                  <p style={{ fontSize: "13px", color: theme.textSub }}>
                    {id === "overview"  && "Overview — summaries, stats, activity feeds."}
                    {id === "analytics" && "Analytics — charts, funnels, conversion rates."}
                    {id === "settings"  && "Settings — forms, toggles, config options."}
                  </p>
                </Card>
              )}
            </Tabs>
          </Sec>

          {/* ── Avatar ────────────────────────────────────── */}
          <Sec title="Avatar" muted={theme.textMuted}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <Avatar name="Alice Johnson" size="xl" ring ringColor={theme.primary} status="online" />
                <Avatar name="Bob Smith"     size="lg" status="away" />
                <Avatar name="Carol White"   size="md" status="busy" />
                <Avatar name="Dan Brown"     size="sm" status="offline" />
                <Avatar name="Eve Davis"     size="xs" />
              </div>
              <AvatarGroup names={["Alice Johnson","Bob Smith","Carol White","Dan Brown","Eve Davis","Frank Miller"]} max={4} size="sm" />
            </div>
          </Sec>

          {/* ── Alerts ────────────────────────────────────── */}
          <Sec title="Alerts" muted={theme.textMuted}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Alert variant="success" title="Changes saved"       message="Your settings have been updated successfully." />
              <Alert variant="error"   title="Something went wrong" message="Failed to connect. Check your network." />
              <Alert variant="warning" title="Storage almost full"  message="You're using 92% of your quota." dismissible />
              <Alert variant="info"    title="Update available"     message="Version 2.4.0 is ready." color={theme.primary} dismissible />
            </div>
          </Sec>

          {/* ── Toast ─────────────────────────────────────── */}
          <Sec title="Toast" muted={theme.textMuted}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <Button variant="secondary" size="sm" onClick={() => toast.success("Saved!", { description: "All changes were written." })}>Success</Button>
              <Button variant="secondary" size="sm" onClick={() => toast.error("Error", { description: "Something went wrong." })}>Error</Button>
              <Button variant="secondary" size="sm" onClick={() => toast.warning("Warning", { description: "Storage is almost full." })}>Warning</Button>
              <Button variant="secondary" size="sm" onClick={() => toast.info("Info", { description: "A new update is available." })}>Info</Button>
              <Button variant="secondary" size="sm" onClick={() => toast("Default message")}>Default</Button>
              <Button variant="secondary" size="sm" onClick={() => toast.success("Action toast", { action: { label: "Undo", onClick: () => toast.info("Undone!") } })}>With action</Button>
            </div>
          </Sec>

          {/* ── Modal ─────────────────────────────────────── */}
          <Sec title="Modal" muted={theme.textMuted}>
            <Button color={theme.primary} style={{ borderRadius: btnRadius }} onClick={() => setModalOpen(true)}>Open modal</Button>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Delete item"
              subtitle="This action cannot be undone. The item will be permanently removed."
              iconColor={theme.primary}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/></svg>}
              footer={
                <>
                  <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="danger" size="sm" onClick={() => { setModalOpen(false); toast.success("Deleted"); }}>Delete</Button>
                </>
              }
            >
              <p style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: 1.6 }}>
                Are you sure? All associated data will be permanently lost.
              </p>
            </Modal>
          </Sec>

          {/* ── Drawer ────────────────────────────────────── */}
          <Sec title="Drawer" muted={theme.textMuted}>
            <Button color={theme.primary} style={{ borderRadius: btnRadius }} onClick={() => setDrawerOpen(true)}>Open drawer</Button>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Settings panel" side="right">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "13px", color: theme.textSub, lineHeight: 1.6 }}>
                  Drawer slides in from any side. Great for settings, detail views, or filters.
                </p>
                <Input label="Name" placeholder="Enter name…" color={theme.primary} />
                <Select label="Role" value="engineer" onChange={() => {}} color={theme.primary}
                  options={[{ value: "engineer", label: "Engineer" }, { value: "designer", label: "Designer" }]}
                />
                <Button color={theme.primary} fullWidth onClick={() => { setDrawerOpen(false); toast.success("Settings saved!"); }}>
                  Save changes
                </Button>
              </div>
            </Drawer>
          </Sec>

          {/* ── Accordion ─────────────────────────────────── */}
          <Sec title="Accordion" muted={theme.textMuted}>
            <Accordion defaultOpen={["q1"]} items={[
              { id: "q1", label: "How do I customize colors?",
                children: "Pass a hex string to the color prop on any component. All accent colors, borders, and glows derive from this single value." },
              { id: "q2", label: "Does it need a provider or context?",
                children: "Nope — components are standalone. Toast uses a module-level store, no ToastProvider needed. Just drop in <Toaster /> once." },
              { id: "q3", label: "Can I use CSS variables for global theming?",
                children: "Yes. Components read from --purple, --text, --surface, --radius etc. Override them on a wrapper to scope a theme to any subtree." },
            ]} />
          </Sec>

          {/* ── Breadcrumb ────────────────────────────────── */}
          <Sec title="Breadcrumb" muted={theme.textMuted}>
            <Breadcrumb items={[
              { label: "Home",       href: "#" },
              { label: "Components", href: "#" },
              { label: "Breadcrumb" },
            ]} />
          </Sec>

          {/* ── Pagination ────────────────────────────────── */}
          <Sec title="Pagination" muted={theme.textMuted}>
            <Pagination total={80} pageSize={10} page={page} onChange={setPage} color={theme.primary} />
          </Sec>

          {/* ── Dropdown ──────────────────────────────────── */}
          <Sec title="Dropdown Menu" muted={theme.textMuted}>
            <DropdownMenu
              trigger={<Button color={theme.primary} style={{ borderRadius: btnRadius }}>Actions</Button>}
              items={[
                { id: "edit", label: "Edit", shortcut: "⌘E",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                { id: "dup", label: "Duplicate",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
                { id: "div1", divider: true, label: "" },
                { id: "del", label: "Delete", danger: true,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg> },
              ]}
              onSelect={id => toast.info(`Selected: ${id}`)}
            />
          </Sec>

          {/* ── Popover ───────────────────────────────────── */}
          <Sec title="Popover" muted={theme.textMuted}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Popover
                trigger={<Button variant="secondary">Top</Button>}
                placement="top"
                title="Popover"
                content={<p style={{ fontSize: "12px", color: "var(--text-sub)" }}>Floats above the trigger.</p>}
              />
              <Popover
                trigger={<Button variant="secondary">Bottom</Button>}
                placement="bottom"
                content={<p style={{ fontSize: "12px", color: "var(--text-sub)" }}>Opens below the trigger.</p>}
              />
              <Popover
                trigger={<Button variant="secondary">Right</Button>}
                placement="right"
                title="Right side"
                content={<p style={{ fontSize: "12px", color: "var(--text-sub)" }}>Opens to the right.</p>}
              />
            </div>
          </Sec>

          {/* ── Tooltip ───────────────────────────────────── */}
          <Sec title="Tooltip" muted={theme.textMuted}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Tooltip content="Tooltip on top" placement="top">
                <Button variant="secondary" size="sm">Top</Button>
              </Tooltip>
              <Tooltip content="Tooltip on bottom" placement="bottom">
                <Button variant="secondary" size="sm">Bottom</Button>
              </Tooltip>
              <Tooltip content="Delayed 500ms" placement="right" delay={500}>
                <Button variant="secondary" size="sm">Delayed</Button>
              </Tooltip>
              <Tooltip content="Hover any element">
                <Badge color={theme.primary} dot>Hover me</Badge>
              </Tooltip>
            </div>
          </Sec>

          {/* ── Table ─────────────────────────────────────── */}
          <Sec title="Table" muted={theme.textMuted}>
            <Table columns={tableColumns} data={tableData} />
          </Sec>

          {/* ── Keyboard ──────────────────────────────────── */}
          <Sec title="Keyboard" muted={theme.textMuted}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <Kbd keys={["⌘"]} />
              <Kbd keys={["⌘", "K"]} />
              <Kbd keys={["⌘", "⇧", "P"]} />
              <Kbd keys={["Ctrl", "C"]} />
              <Kbd keys={["Enter"]} />
              <Kbd keys={["Esc"]} />
            </div>
          </Sec>

          {/* ── Spinner / Skeleton ────────────────────────── */}
          <Sec title="Spinner & Skeleton" muted={theme.textMuted}>
            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Spinner size="sm" color={theme.primary} />
                <Spinner size="md" color={theme.primary} />
                <Spinner size="lg" color={theme.primary} />
              </div>
              <div style={{ flex: 1, minWidth: "180px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <Skeleton width="100%" height="13px" />
                <Skeleton width="80%"  height="13px" />
                <Skeleton width="60%"  height="13px" />
                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <Skeleton width="38px" height="38px" radius="50%" />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center" }}>
                    <Skeleton width="100%" height="11px" />
                    <Skeleton width="65%"  height="11px" />
                  </div>
                </div>
              </div>
            </div>
          </Sec>

          {/* ── Divider ───────────────────────────────────── */}
          <Sec title="Divider" muted={theme.textMuted}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Divider />
              <Divider label="or continue with" />
              <Divider color={theme.primary} />
            </div>
          </Sec>

          {/* ── Empty State ───────────────────────────────── */}
          <Sec title="Empty State" muted={theme.textMuted}>
            <EmptyState
              color={theme.primary}
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              title="No messages yet"
              message="When someone sends you a message it will appear here."
              action={<Button color={theme.primary} size="sm" style={{ borderRadius: btnRadius }}>Start a conversation</Button>}
            />
          </Sec>

        </div>
      </div>
    </div>
  );
}

// ─── Sidebar helpers ──────────────────────────────────────────────────────────

function SideSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a4660", marginBottom: "10px" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "#7a7596", flexShrink: 0 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#4a4660" }}>{value}</span>
        <label style={{ cursor: "pointer", position: "relative", width: "24px", height: "24px", flexShrink: 0 }}>
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer", width: "100%", height: "100%" }} />
          <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: value, border: "1px solid rgba(255,255,255,0.15)", boxShadow: `0 2px 8px ${value}66`, pointerEvents: "none" }} />
        </label>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#7a7596" }}>{label}</span>
        <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "#4a4660" }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#876cff", cursor: "pointer" }} />
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "#7a7596" }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        position: "relative", width: "34px", height: "19px", borderRadius: "999px",
        background: value ? "linear-gradient(90deg, #6748e8, #9b85ff)" : "rgba(255,255,255,0.1)",
        border: `1px solid ${value ? "rgba(135,108,255,0.4)" : "rgba(255,255,255,0.1)"}`,
        cursor: "pointer", transition: "all 0.18s", flexShrink: 0, padding: 0,
      }}>
        <div style={{
          position: "absolute", top: "50%", left: value ? "16px" : "2px", transform: "translateY(-50%)",
          width: "13px", height: "13px", borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)", transition: "left 0.2s cubic-bezier(0.34,1.4,0.64,1)",
        }} />
      </button>
    </div>
  );
}

function Sec({ title, muted, children }: { title: string; muted: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "44px" }}>
      <p style={{
        fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em",
        textTransform: "uppercase", color: muted, marginBottom: "16px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        {title}
        <span style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </p>
      {children}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button }        from "@/components/Button";
import { Card }          from "@/components/Card";
import { Badge }         from "@/components/Badge";
import { Input, Textarea } from "@/components/Input";
import { Skeleton, SkeletonText, SkeletonCard, SkeletonRow, SkeletonAvatar } from "@/components/Skeleton";
import { Modal }         from "@/components/Modal";
import { Tabs }          from "@/components/Tabs";
import { Progress }      from "@/components/Progress";
import { Toggle, Checkbox, Radio } from "@/components/Toggle";
import { Avatar, AvatarGroup } from "@/components/Avatar";
import { Tooltip }       from "@/components/Tooltip";
import { Divider }       from "@/components/Divider";
import { Spinner }       from "@/components/Spinner";
import { EmptyState }    from "@/components/EmptyState";
import { StatCard }      from "@/components/StatCard";
import { toast }         from "@/components/Toast";
import { Select }        from "@/components/Select";
import { Alert }         from "@/components/Alert";
import { Table, type TableColumn } from "@/components/Table";
import { Kbd }           from "@/components/Kbd";
import { NumberInput }   from "@/components/NumberInput";
import { Accordion }     from "@/components/Accordion";
import { Breadcrumb }    from "@/components/Breadcrumb";
import { Pagination }    from "@/components/Pagination";
import { DropdownMenu }  from "@/components/DropdownMenu";
import { Drawer }        from "@/components/Drawer";
import { TagInput }      from "@/components/TagInput";
import { Popover }       from "@/components/Popover";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <h2 style={{
          fontSize:      "10px",
          fontWeight:    800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:         "var(--text-muted)",
          whiteSpace:    "nowrap",
        }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>
      {children}
    </section>
  );
}

function Row({ children, gap = "12px", wrap = true }: { children: React.ReactNode; gap?: string; wrap?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap, flexWrap: wrap ? "wrap" : "nowrap" }}>
      {children}
    </div>
  );
}

// ── Table sample data ──────────────────────────────────────────────────────
interface PlayerRow extends Record<string, unknown> {
  player:  string;
  rank:    number;
  points:  number;
  wins:    number;
  status:  string;
}

const tableData: PlayerRow[] = [
  { player: "Urosh",   rank: 1, points: 9420, wins: 38, status: "online"  },
  { player: "Alice",   rank: 2, points: 8810, wins: 34, status: "offline" },
  { player: "Charlie", rank: 3, points: 7550, wins: 29, status: "online"  },
  { player: "Dave",    rank: 4, points: 6200, wins: 24, status: "away"    },
  { player: "Eve",     rank: 5, points: 5870, wins: 21, status: "offline" },
];

const tableColumns: TableColumn<PlayerRow>[] = [
  {
    key:   "rank",
    label: "#",
    width: "48px",
    render: (v) => (
      <span style={{
        fontSize:   "12px",
        fontWeight: 800,
        color:      Number(v) <= 3 ? "#876cff" : "var(--text-muted)",
      }}>
        {String(v)}
      </span>
    ),
  },
  {
    key:   "player",
    label: "Player",
    width: "1fr",
    render: (v) => (
      <span style={{ fontWeight: 700, color: "var(--text)" }}>{String(v)}</span>
    ),
  },
  {
    key:   "points",
    label: "Points",
    width: "100px",
    render: (v) => (
      <span style={{ fontFamily: "var(--mono)", fontWeight: 700, color: "#a393ff" }}>
        {Number(v).toLocaleString()}
      </span>
    ),
  },
  {
    key:   "wins",
    label: "Wins",
    width: "80px",
    render: (v) => (
      <span style={{ fontFamily: "var(--mono)", color: "#4ade80", fontWeight: 700 }}>
        {String(v)}
      </span>
    ),
  },
  {
    key:   "status",
    label: "Status",
    width: "100px",
    render: (v) => {
      const isOnline = v === "online";
      const isAway   = v === "away";
      const color    = isOnline ? "#4ade80" : isAway ? "#fbbf24" : "#4a4660";
      return (
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "var(--text-sub)", textTransform: "capitalize" }}>{String(v)}</span>
        </span>
      );
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  const [modalOpen,   setModalOpen]     = useState(false);
  const [toggle,      setToggle]        = useState(true);
  const [check,       setCheck]         = useState(true);
  const [radio,       setRadio]         = useState("a");
  const [inputVal,    setInputVal]      = useState("");
  const [progress,    setProgress]      = useState(65);
  const [selectVal,   setSelectVal]     = useState("");
  const [numVal,      setNumVal]        = useState(5);
  const [badgeRemoved, setBadgeRemoved]   = useState(false);
  const [drawerOpen,   setDrawerOpen]     = useState(false);
  const [tags,         setTags]           = useState<string[]>(["design", "react"]);
  const [currentPage,  setCurrentPage]    = useState(1);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* ── Page-level background glows (not clipped) ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position:   "absolute",
          top:        "-120px",
          left:       "50%",
          transform:  "translateX(-50%)",
          width:      "900px",
          height:     "600px",
          background: "radial-gradient(ellipse, rgba(135,108,255,0.1) 0%, transparent 60%)",
        }} />
        <div style={{
          position:   "absolute",
          top:        "80px",
          left:       "-100px",
          width:      "500px",
          height:     "500px",
          background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 65%)",
        }} />
        <div style={{
          position:   "absolute",
          top:        "100px",
          right:      "-80px",
          width:      "460px",
          height:     "460px",
          background: "radial-gradient(circle, rgba(236,72,153,0.045) 0%, transparent 65%)",
        }} />
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: "100px" }}>
          {/* Title */}
          <h1 style={{
            fontSize:      "clamp(52px,9vw,88px)",
            fontWeight:    900,
            letterSpacing: "-4px",
            lineHeight:    0.95,
            marginBottom:  "22px",
            color:         "var(--text)",
          }}>
            smth{" "}
            <span style={{
              background:           "linear-gradient(135deg, #c4b8ff 0%, #9b85ff 35%, #6748e8 70%, #a393ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
            }}>
              ui
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:   "16px",
            color:      "var(--text-sub)",
            maxWidth:   "360px",
            margin:     "0 auto 36px",
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            cool frontend components for starters or vibe coders that suck at ui
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Button pill size="lg" iconLeft={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            }>
              Browse components
            </Button>
            <a href="/playground" style={{ textDecoration: "none" }}>
              <Button pill size="lg" variant="secondary" iconLeft={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
              }>
                Theme playground
              </Button>
            </a>
          </div>
        </div>



        {/* ── BUTTONS ── */}
        <Section title="Buttons — variants">
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
          </Row>
        </Section>

        <Section title="Buttons — pill + custom color">
          <Row>
            <Button pill>Pill primary</Button>
            <Button pill variant="secondary">Pill secondary</Button>
            <Button pill color="#f59e0b">Amber</Button>
            <Button pill color="#ec4899">Pink</Button>
            <Button pill color="#10b981">Emerald</Button>
            <Button pill size="xl">Extra Large</Button>
          </Row>
        </Section>

        <Section title="Buttons — sizes">
          <Row gap="8px">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </Row>
        </Section>

        <Section title="Buttons — states">
          <Row>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button iconLeft={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            }>With icon</Button>
            <Button variant="secondary" iconRight={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            }>Icon right</Button>
          </Row>
        </Section>

        {/* ── BADGES ── */}
        <Section title="Badges — custom color prop">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Row gap="8px">
              <Badge color="#876cff">Purple</Badge>
              <Badge color="#f59e0b">Amber</Badge>
              <Badge color="#ec4899">Pink</Badge>
              <Badge color="#10b981">Emerald</Badge>
              <Badge color="#60a5fa">Sky</Badge>
              <Badge color="#f87171">Red</Badge>
            </Row>
            <Row gap="8px">
              <Badge color="#876cff" dot size="sm">online</Badge>
              <Badge color="#4ade80" dot>active</Badge>
              <Badge color="#f59e0b" dot size="lg">pending</Badge>
              <Badge color="#f87171" dot>error</Badge>
              {!badgeRemoved && (
                <Badge
                  color="#ec4899"
                  removable
                  onRemove={() => setBadgeRemoved(true)}
                  icon={
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  }
                >
                  removable
                </Badge>
              )}
              {badgeRemoved && (
                <button
                  onClick={() => setBadgeRemoved(false)}
                  style={{ fontSize: "11px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                >
                  restore badge
                </button>
              )}
            </Row>
            <Row gap="8px">
              <Badge color="#876cff" size="sm">sm</Badge>
              <Badge color="#4ade80" size="md">md</Badge>
              <Badge color="#f59e0b" size="lg">lg</Badge>
              <Badge color="#60a5fa" icon={
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              }>with icon</Badge>
            </Row>
          </div>
        </Section>

        {/* ── ALERTS ── */}
        <Section title="Alerts">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Alert variant="success" title="Changes saved" message="Your profile has been updated successfully." dismissible />
            <Alert variant="error"   title="Something went wrong" message="Failed to connect to the server. Try again." dismissible />
            <Alert variant="warning" title="Proceeding is irreversible" message="This action will permanently delete your account and all data." />
            <Alert variant="info"    title="New update available" message="Version 2.1 is ready to install." dismissible />
            <Alert variant="neutral" title="Heads up" message="This feature is currently in beta." />
            <Alert color="#f59e0b"   title="Custom amber alert" message="Use the color prop for a fully custom accent color." dismissible />
          </div>
        </Section>

        {/* ── TABLE ── */}
        <Section title="Table">
          <Table columns={tableColumns} data={tableData} />
        </Section>

        {/* ── KBD ── */}
        <Section title="Keyboard shortcuts">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Row gap="20px">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Kbd keys={["⌘", "K"]} />
                <span style={{ fontSize: "13px", color: "var(--text-sub)" }}>Open command palette</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Kbd keys={["Ctrl", "S"]} />
                <span style={{ fontSize: "13px", color: "var(--text-sub)" }}>Save</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Kbd keys={["⌘", "Shift", "P"]} />
                <span style={{ fontSize: "13px", color: "var(--text-sub)" }}>Command mode</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Kbd keys={["Esc"]} />
                <span style={{ fontSize: "13px", color: "var(--text-sub)" }}>Dismiss</span>
              </div>
            </Row>
          </div>
        </Section>

        {/* ── NUMBER INPUT ── */}
        <Section title="Number input">
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <NumberInput
              label="Quantity"
              value={numVal}
              onChange={setNumVal}
              min={0}
              max={20}
              step={1}
              style={{ width: "180px" }}
            />
            <NumberInput
              label="Custom step"
              value={numVal * 5}
              onChange={(v) => setNumVal(Math.round(v / 5))}
              min={0}
              max={100}
              step={5}
              style={{ width: "180px" }}
            />
            <NumberInput
              label="Disabled"
              value={42}
              onChange={() => {}}
              disabled
              style={{ width: "180px" }}
            />
          </div>
        </Section>

        {/* ── SELECT ── */}
        <Section title="Select">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", maxWidth: "680px" }}>
            <Select
              label="Framework"
              placeholder="Pick a framework"
              value={selectVal}
              onChange={setSelectVal}
              options={[
                { value: "next",  label: "Next.js" },
                { value: "remix", label: "Remix" },
                { value: "astro", label: "Astro" },
                { value: "sveltekit", label: "SvelteKit" },
              ]}
            />
            <Select
              label="Region (error)"
              placeholder="Select region"
              value=""
              onChange={() => {}}
              error="Region is required"
              options={[
                { value: "us", label: "US East" },
                { value: "eu", label: "EU West" },
              ]}
            />
            <Select
              label="Disabled"
              placeholder="Can't select"
              value=""
              onChange={() => {}}
              disabled
              options={[]}
            />
          </div>
        </Section>

        {/* ── CARDS ── */}
        <Section title="Cards — variants + new props">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            {(["default","elevated","flat","outlined","danger","success"] as const).map(v => (
              <Card key={v} variant={v}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", textTransform: "capitalize", letterSpacing: "0.08em" }}>{v}</p>
                <p style={{ fontSize: "13px", color: "var(--text)" }}>Card content.</p>
              </Card>
            ))}
            <Card accentTop="linear-gradient(90deg, #876cff, #ec4899)" onClick={() => toast.info("Card clicked!")}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.08em" }}>ACCENT TOP</p>
              <p style={{ fontSize: "13px", color: "var(--text)" }}>Click me (hover lift).</p>
            </Card>
            <Card borderColor="#f59e0b" glowColor="rgba(245,158,11,0.12)">
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b", marginBottom: "6px", letterSpacing: "0.08em" }}>CUSTOM BORDER</p>
              <p style={{ fontSize: "13px", color: "var(--text)" }}>Custom borderColor + glowColor props.</p>
            </Card>
          </div>
        </Section>

        {/* ── STAT CARDS ── */}
        <Section title="Stat cards">
          <Row>
            {[
              { label: "Requests today", value: "24,891", trend: { value: "+12.4%", positive: true }, color: "#876cff",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
              { label: "Active users", value: "1,337", trend: { value: "+4.1%", positive: true }, color: "#4ade80",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              { label: "Avg. response", value: "142ms", trend: { value: "-18ms", positive: true }, color: "#60a5fa",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
            ].map((s, i) => (
              <div key={i} style={{ flex: "1 1 200px" }}>
                <StatCard {...s} />
              </div>
            ))}
          </Row>
        </Section>

        {/* ── INPUTS ── */}
        <Section title="Inputs">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <Input label="Default" placeholder="Enter value..." value={inputVal} onChange={e => setInputVal(e.target.value)} />
            <Input label="With hint" placeholder="username" hint="Must be at least 3 characters" />
            <Input label="Error state" placeholder="email@example.com" error="Invalid email address" />
            <Input label="Disabled" placeholder="Can't touch this" disabled />
            <Input label="With icon" placeholder="Search..." iconLeft={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            } />
            <Textarea label="Textarea" placeholder="Write something..." />
          </div>
        </Section>

        {/* ── PROGRESS ── */}
        <Section title="Progress bars">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
            <Progress value={progress} label="Purple" showValue />
            <Progress value={78} variant="green"  label="Green"  showValue />
            <Progress value={45} variant="red"    label="Red"    showValue />
            <Progress value={60} variant="yellow" label="Yellow" showValue />
            <Progress value={90} variant="blue"   label="Blue"   showValue />
            <Row gap="8px">
              <Button size="xs" variant="secondary" onClick={() => setProgress(p => Math.max(0, p - 10))}>-10</Button>
              <Button size="xs" onClick={() => setProgress(p => Math.min(100, p + 10))}>+10</Button>
            </Row>
          </div>
        </Section>

        {/* ── TOGGLES ── */}
        <Section title="Toggle / Checkbox / Radio">
          <Row>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Toggle checked={toggle}   onChange={setToggle} label="Toggle on" />
              <Toggle checked={!toggle}  onChange={v => setToggle(!v)} label="Toggle off" />
              <Toggle checked={true}     onChange={() => {}} label="Disabled" disabled size="sm" />
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.05)", alignSelf: "stretch", margin: "0 8px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Checkbox checked={check}  onChange={setCheck}  label="Checkbox on"  />
              <Checkbox checked={!check} onChange={v => setCheck(!v)} label="Checkbox off" />
              <Checkbox checked={false}  onChange={() => {}}  label="Disabled" disabled />
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.05)", alignSelf: "stretch", margin: "0 8px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["a","b","c"].map(v => (
                <Radio key={v} checked={radio === v} onChange={() => setRadio(v)} label={`Option ${v.toUpperCase()}`} />
              ))}
            </div>
          </Row>
        </Section>

        {/* ── AVATARS ── */}
        <Section title="Avatars">
          <Row gap="20px">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
              <Row gap="10px">
                {(["xs","sm","md","lg","xl"] as const).map(s => (
                  <Avatar key={s} name="Urosh" size={s} />
                ))}
              </Row>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Sizes</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
              <Row gap="10px">
                {(["online","offline","away","busy"] as const).map(s => (
                  <Avatar key={s} name="RB" size="md" status={s} />
                ))}
              </Row>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Status</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
              <Avatar name="Urosh" size="lg" ring />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Ring</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
              <AvatarGroup names={["Alice","Bob","Charlie","Dave","Eve","Frank"]} max={4} />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Group</span>
            </div>
          </Row>
        </Section>

        {/* ── TABS ── */}
        <Section title="Tabs">
          <Tabs
            defaultId="overview"
            tabs={[
              { id: "overview",  label: "Overview"  },
              { id: "analytics", label: "Analytics" },
              { id: "settings",  label: "Settings"  },
            ]}
          >
            {(id) => (
              <Card>
                <p style={{ fontSize: "14px", color: "var(--text-sub)" }}>
                  {id === "overview"  && "Overview content — stats, summaries, key metrics."}
                  {id === "analytics" && "Analytics content — charts, funnels, retention data."}
                  {id === "settings"  && "Settings content — preferences, API keys, danger zone."}
                </p>
              </Card>
            )}
          </Tabs>
        </Section>

        {/* ── TOOLTIPS ── */}
        <Section title="Tooltips">
          <Row>
            {(["top","bottom","left","right"] as const).map(p => (
              <Tooltip key={p} content={`Tooltip on ${p}`} placement={p}>
                <Button variant="outline" size="sm">{p}</Button>
              </Tooltip>
            ))}
          </Row>
        </Section>

        {/* ── TOASTS ── */}
        <Section title="Toasts">
          <Row>
            {[
              { type: "success", label: "success", fn: () => toast.success("Saved!", { description: "Your changes have been saved." }) },
              { type: "error",   label: "error",   fn: () => toast.error("Error", { description: "Something went wrong." }) },
              { type: "warning", label: "warning", fn: () => toast.warning("Warning", { description: "This action is irreversible." }) },
              { type: "info",    label: "info",    fn: () => toast.info("Info", { description: "New update available." }) },
            ].map(t => (
              <Button key={t.type} variant="secondary" size="sm" onClick={t.fn}>
                {t.label}
              </Button>
            ))}
          </Row>
        </Section>

        {/* ── SKELETONS ── */}
        <Section title="Skeletons">
          <Row wrap>
            <div style={{ flex: "1 1 280px" }}>
              <SkeletonCard />
            </div>
            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
            <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <SkeletonAvatar size={44} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Skeleton width="50%" height="13px" />
                  <Skeleton width="70%" height="11px" />
                </div>
              </div>
              <SkeletonText lines={4} />
              <Skeleton width="40%" height="36px" radius="10px" />
            </div>
          </Row>
        </Section>

        {/* ── MODAL ── */}
        <Section title="Modal">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Delete item"
            subtitle="This action is permanent and cannot be reversed."
            iconColor="#f87171"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            }
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={() => {
                  toast.success("Deleted", { description: "Item has been removed." });
                  setModalOpen(false);
                }}>
                  Delete
                </Button>
              </>
            }
          >
            <p style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: 1.7 }}>
              Once deleted, this item cannot be recovered. Any references to it will also be removed.
            </p>
          </Modal>
        </Section>

        {/* ── SPINNERS ── */}
        <Section title="Spinners">
          <Row gap="20px">
            {(["sm","md","lg","xl"] as const).map(s => (
              <Spinner key={s} size={s} />
            ))}
            <Spinner size="md" color="var(--green)" />
            <Spinner size="md" color="var(--red)" />
          </Row>
        </Section>

        {/* ── BREADCRUMB ── */}
        <Section title="Breadcrumb">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Breadcrumb items={[
              { label: "Home" },
              { label: "Settings" },
              { label: "Profile" },
            ]} />
            <Breadcrumb items={[
              { label: "Dashboard" },
              { label: "Projects" },
              { label: "smth-ui" },
              { label: "Components" },
            ]} />
          </div>
        </Section>

        {/* ── PAGINATION ── */}
        <Section title="Pagination">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Pagination total={120} pageSize={10} page={currentPage} onChange={setCurrentPage} />
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Page {currentPage} of 12</p>
          </div>
        </Section>

        {/* ── DROPDOWN MENU ── */}
        <Section title="Dropdown menu">
          <Row gap="16px">
            <DropdownMenu
              trigger={
                <Button variant="secondary" iconRight={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                }>
                  Options
                </Button>
              }
              items={[
                { id: "edit",   label: "Edit",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, shortcut: "⌘E" },
                { id: "copy",   label: "Duplicate", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>, shortcut: "⌘D" },
                { id: "share",  label: "Share",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                { id: "delete", label: "Delete", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>, danger: true, divider: true, shortcut: "⌫" },
              ]}
              onSelect={(id) => toast.info(`Selected: ${id}`)}
            />
            <DropdownMenu
              align="right"
              trigger={
                <Button variant="ghost" size="sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </Button>
              }
              items={[
                { id: "view",    label: "View details" },
                { id: "archive", label: "Archive" },
                { id: "delete",  label: "Delete",  danger: true, divider: true },
              ]}
              onSelect={(id) => toast.info(`Selected: ${id}`)}
            />
          </Row>
        </Section>

        {/* ── ACCORDION ── */}
        <Section title="Accordion">
          <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <Accordion
              defaultOpen={["a1"]}
              items={[
                {
                  id: "a1",
                  label: "What is this component?",
                  children: "This is a placeholder accordion item. It expands and collapses with a smooth height animation. Click any row to toggle it.",
                },
                {
                  id: "a2",
                  label: "Can multiple items be open at once?",
                  children: "By default only one item is open at a time. Pass the multiple prop to allow any number of items to be expanded simultaneously.",
                },
                {
                  id: "a3",
                  label: "How do I customize it?",
                  children: "Each item accepts any ReactNode as its label and children, so you can put whatever you like inside — text, badges, code, anything.",
                },
                {
                  id: "a4",
                  label: "Is it accessible?",
                  children: "Trigger elements are native buttons, so keyboard navigation and screen readers work out of the box.",
                },
              ]}
            />
          </div>
        </Section>

        {/* ── TAG INPUT ── */}
        <Section title="Tag input">
          <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <TagInput
              label="Topics"
              tags={tags}
              onChange={setTags}
              placeholder="Add topic…"
              max={8}
              color="#876cff"
            />
            <TagInput
              label="Skills (green)"
              tags={["TypeScript", "React"]}
              onChange={() => {}}
              color="#4ade80"
            />
          </div>
        </Section>

        {/* ── POPOVER ── */}
        <Section title="Popover">
          <Row gap="20px">
            <Popover
              placement="bottom"
              title="Keyboard shortcuts"
              content={
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[["⌘K", "Command palette"], ["⌘S", "Save"], ["⌘Z", "Undo"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                      <span>{v}</span>
                      <Kbd keys={k.split("")} />
                    </div>
                  ))}
                </div>
              }
              trigger={<Button variant="secondary" size="sm">Show popover</Button>}
            />
            <Popover
              placement="right"
              title="Storage"
              content={
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>2.4 GB of 5 GB used</div>
                  <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: "48%", height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #876cff, #a393ff)" }} />
                  </div>
                </div>
              }
              trigger={<Button variant="outline" size="sm">Storage info</Button>}
            />
          </Row>
        </Section>

        {/* ── DRAWER ── */}
        <Section title="Drawer">
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Settings"
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => { toast.success("Saved!"); setDrawerOpen(false); }}>Save changes</Button>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Input label="Display name" placeholder="Your name" />
              <Input label="Email" placeholder="you@example.com" />
              <Select
                label="Language"
                value=""
                onChange={() => {}}
                options={[
                  { value: "en", label: "English" },
                  { value: "es", label: "Spanish" },
                  { value: "fr", label: "French" },
                ]}
                placeholder="Select language"
              />
              <Toggle checked={toggle} onChange={setToggle} label="Email notifications" />
            </div>
          </Drawer>
        </Section>

        {/* ── DIVIDERS ── */}
        <Section title="Dividers">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
            <Divider />
            <Divider label="or continue with" />
            <Divider label="danger zone" color="rgba(248,113,113,0.2)" />
          </div>
        </Section>

        {/* ── EMPTY STATE ── */}
        <Section title="Empty state">
          <EmptyState
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            }
            title="No results found"
            message="Try adjusting your search or filter to find what you're looking for."
            action={<Button size="sm">Clear filters</Button>}
          />
        </Section>

      </div>
    </div>
  );
}

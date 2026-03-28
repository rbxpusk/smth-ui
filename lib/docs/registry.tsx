"use client";
import { useState } from "react";
import type { ComponentDoc } from "./types";

import { Accordion } from "@/components/Accordion";
import { Alert } from "@/components/Alert";
import { Avatar, AvatarGroup } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { Banner } from "@/components/Banner";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CodeDisplay } from "@/components/CodeDisplay";
import { ColorPicker } from "@/components/ColorPicker";
import { Combobox } from "@/components/Combobox";
import { DigitCounter } from "@/components/DigitCounter";
import { Divider } from "@/components/Divider";
import { Drawer } from "@/components/Drawer";
import { DropdownMenu } from "@/components/DropdownMenu";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/Input";
import { Kbd } from "@/components/Kbd";
import { Modal } from "@/components/Modal";
import { Notifications } from "@/components/Notifications";
import { NumberInput } from "@/components/NumberInput";
import { Pagination } from "@/components/Pagination";
import { Popover } from "@/components/Popover";
import { Progress } from "@/components/Progress";
import { Select } from "@/components/Select";
import { Sheet } from "@/components/Sheet";
import { Skeleton, SkeletonText, SkeletonCard, SkeletonRow } from "@/components/Skeleton";
import { Slider } from "@/components/Slider";
import { Spinner } from "@/components/Spinner";
import { StatCard } from "@/components/StatCard";
import { Stepper } from "@/components/Stepper";
import { Table } from "@/components/Table";
import { Tabs } from "@/components/Tabs";
import { TagInput } from "@/components/TagInput";
import { Timeline } from "@/components/Timeline";
import { toast, Toaster } from "@/components/Toast";
import { Toggle, Checkbox, Radio } from "@/components/Toggle";
import { Tooltip } from "@/components/Tooltip";

// ─── Interactive preview wrappers ────────────────────────────────────────────

function ModalPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action" subtitle="This operation cannot be undone.">
        <p style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: 1.65 }}>
          Are you sure you want to continue? All selected items will be permanently removed.
        </p>
      </Modal>
    </>
  );
}

function ModalWithFooterPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Modal with footer</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete workspace"
        subtitle="This will permanently delete the workspace and all its data."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        <Alert variant="warning" title="Warning" message="This action is irreversible. All data will be permanently deleted." />
      </Modal>
    </>
  );
}

function DrawerPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Settings" side="right">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input label="Display name" placeholder="Jane Doe" />
          <Input label="Email" placeholder="jane@example.com" type="email" />
          <Toggle checked={false} onChange={() => {}} label="Email notifications" />
        </div>
      </Drawer>
    </>
  );
}

function DrawerLeftPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Left drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Navigation" side="left">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["Dashboard", "Analytics", "Users", "Settings"].map(item => (
            <div key={item} style={{ padding: "10px 12px", borderRadius: "9px", fontSize: "14px", color: "var(--text-sub)", cursor: "pointer" }}>
              {item}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}

function SheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Quick actions" height="md">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: 1.65 }}>
            Sheet slides up from the bottom. Drag the handle downward to dismiss.
          </p>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </Sheet>
    </>
  );
}

function SelectPreview() {
  const [value, setValue] = useState("");
  return (
    <Select
      label="Framework"
      options={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
        { value: "solid", label: "Solid" },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Choose a framework…"
    />
  );
}

function SelectWithErrorPreview() {
  const [value, setValue] = useState("");
  return (
    <Select
      label="Role"
      options={[
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer" },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Select a role…"
      error={!value ? "Role is required" : undefined}
      hint="Determines access permissions"
    />
  );
}

function TogglePreview() {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Toggle checked={on} onChange={setOn} label="Dark mode" />
      <Toggle checked={!on} onChange={v => setOn(!v)} label="Email notifications" size="sm" />
      <Toggle checked={false} onChange={() => {}} label="Disabled toggle" disabled />
    </div>
  );
}

function CheckboxPreview() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Checkbox checked={checked} onChange={setChecked} label="I agree to the terms" />
      <Checkbox checked={checked2} onChange={setChecked2} label="Send me updates" />
      <Checkbox checked={false} onChange={() => {}} label="Disabled" disabled />
    </div>
  );
}

function RadioPreview() {
  const [selected, setSelected] = useState("monthly");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {["monthly", "yearly", "lifetime"].map(opt => (
        <Radio key={opt} checked={selected === opt} onChange={() => setSelected(opt)} label={opt.charAt(0).toUpperCase() + opt.slice(1)} />
      ))}
    </div>
  );
}

function AccordionPreview() {
  return (
    <Accordion
      items={[
        { id: "a", label: "What is smth UI?", children: "A dark-first, inline-style React component library built with a hex-based color system." },
        { id: "b", label: "Is it free?", children: "Yes, smth UI is MIT licensed and free to use in any project." },
        { id: "c", label: "Does it require a CSS framework?", children: "No. Every component is styled with inline React styles and CSS variables — zero Tailwind or class dependencies." },
      ]}
    />
  );
}

function SliderPreview() {
  const [value, setValue] = useState(40);
  const [value2, setValue2] = useState(70);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Slider value={value} onChange={setValue} label="Volume" showValue />
      <Slider value={value2} onChange={setValue2} label="Opacity" showValue color="#ec4899" />
    </div>
  );
}

function ComboboxPreview() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      label="Country"
      options={[
        { value: "us", label: "United States" },
        { value: "gb", label: "United Kingdom" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
        { value: "jp", label: "Japan" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Search countries…"
    />
  );
}

function TagInputPreview() {
  const [tags, setTags] = useState(["react", "typescript"]);
  return (
    <TagInput
      tags={tags}
      onChange={setTags}
      label="Skills"
      placeholder="Add skill…"
      max={6}
    />
  );
}

function NumberInputPreview() {
  const [value, setValue] = useState(5);
  return (
    <NumberInput
      value={value}
      onChange={setValue}
      min={0}
      max={20}
      step={1}
      label="Quantity"
    />
  );
}

function ColorPickerPreview() {
  const [color, setColor] = useState("#876cff");
  return <ColorPicker value={color} onChange={setColor} label="Accent color" />;
}

function ToastPreview() {
  return (
    <>
      <Toaster />
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Button size="sm" onClick={() => toast.success("Saved!", { description: "Your changes have been saved." })}>Success</Button>
        <Button size="sm" variant="danger" onClick={() => toast.error("Something went wrong", { description: "Please try again." })}>Error</Button>
        <Button size="sm" variant="secondary" onClick={() => toast.warning("Low storage", { description: "Less than 10% remaining." })}>Warning</Button>
        <Button size="sm" variant="ghost" onClick={() => toast.info("Update available")}>Info</Button>
      </div>
    </>
  );
}

function StepperPreview() {
  const [active, setActive] = useState(1);
  const steps = [
    { id: "account", label: "Account", description: "Basic info" },
    { id: "details", label: "Details", description: "Profile setup" },
    { id: "confirm", label: "Confirm", description: "Review" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Stepper steps={steps} activeStep={active} />
      <div style={{ display: "flex", gap: "8px" }}>
        <Button size="sm" variant="secondary" onClick={() => setActive(s => Math.max(0, s - 1))} disabled={active === 0}>Back</Button>
        <Button size="sm" onClick={() => setActive(s => Math.min(steps.length - 1, s + 1))} disabled={active === steps.length - 1}>Next</Button>
      </div>
    </div>
  );
}

function NotificationsPreview() {
  const [items, setItems] = useState([
    { id: "1", title: "Pull request merged", body: "feat/dark-mode was merged into main.", time: "2m ago", read: false, type: "success" as const },
    { id: "2", title: "New comment", body: "Alice left a comment on your post.", time: "14m ago", read: false, type: "info" as const, avatar: "Alice" },
    { id: "3", title: "Deploy failed", body: "Production deployment failed.", time: "1h ago", read: true, type: "error" as const },
  ]);
  return (
    <Notifications
      items={items}
      onRead={id => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
      onReadAll={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
      onDismiss={id => setItems(prev => prev.filter(n => n.id !== id))}
    />
  );
}

function PaginationPreview() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
      <Pagination total={120} pageSize={10} page={page} onChange={setPage} />
      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Page {page} of 12</span>
    </div>
  );
}

function ColorPickerGreenPreview() {
  const [c, setC] = useState("#10b981");
  return (
    <ColorPicker
      value={c}
      onChange={setC}
      label="Theme color"
      showInput={false}
      presets={["#876cff", "#ec4899", "#10b981", "#f59e0b", "#0ea5e9"]}
    />
  );
}

function LargeSheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Large Sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Details" height="lg" color="#0ea5e9">
        <p style={{ fontSize: "14px", color: "var(--text-sub)" }}>This is a tall sheet at 75% viewport height.</p>
      </Sheet>
    </>
  );
}

function TagInputGreenPreview() {
  const [tags, setTags] = useState(["feature", "v2.0"]);
  return <TagInput tags={tags} onChange={setTags} label="Labels" color="#4ade80" />;
}

function ToastWithActionPreview() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.success("File uploaded", {
            description: "report.pdf is ready.",
            action: { label: "View", onClick: () => {} },
          })
        }
      >
        Toast with action
      </Button>
    </>
  );
}

// ─── REGISTRY ─────────────────────────────────────────────────────────────────

export const REGISTRY: Record<string, ComponentDoc> = {
  accordion: {
    name: "Accordion",
    slug: "accordion",
    category: "Layout",
    description: "A vertically stacked set of interactive headings that expand and collapse their associated content panels. Supports single or multiple open items simultaneously.",
    usage: `import { Accordion } from "@/components/Accordion";

export default function Example() {
  return (
    <Accordion
      items={[
        { id: "a", label: "What is smth UI?", children: "A dark-first React component library." },
        { id: "b", label: "Is it free?", children: "Yes, MIT licensed." },
      ]}
    />
  );
}`,
    props: [
      { name: "items", type: "AccordionItem[]", required: true, description: "Array of { id, label, children, disabled? } objects." },
      { name: "multiple", type: "boolean", default: "false", description: "Allow multiple panels open simultaneously." },
      { name: "defaultOpen", type: "string[]", default: "[]", description: "Array of item ids open by default." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for the open chevron." },
    ],
    examples: [
      {
        title: "Default accordion",
        description: "Single-open accordion with three items.",
        code: `<Accordion
  items={[
    { id: "a", label: "What is smth UI?", children: "A dark-first React component library." },
    { id: "b", label: "Is it free?", children: "Yes, MIT licensed." },
    { id: "c", label: "Does it require CSS?", children: "No. Inline styles only." },
  ]}
/>`,
        preview: <AccordionPreview />,
      },
      {
        title: "Multi-open accordion",
        description: "Multiple panels can be open at the same time.",
        code: `<Accordion
  multiple
  defaultOpen={["a", "b"]}
  items={[
    { id: "a", label: "Colors", children: "Uses hex color props throughout." },
    { id: "b", label: "Accessibility", children: "aria-expanded and keyboard nav built in." },
  ]}
/>`,
        preview: (
          <Accordion
            multiple
            defaultOpen={["a", "b"]}
            items={[
              { id: "a", label: "Colors", children: "Uses hex color props throughout." },
              { id: "b", label: "Accessibility", children: "aria-expanded and keyboard navigation built in." },
            ]}
          />
        ),
      },
    ],
  },

  alert: {
    name: "Alert",
    slug: "alert",
    category: "Feedback",
    description: "Displays a short, important message to the user with contextual color variants and an optional dismiss button. Includes a left accent bar and variant icon.",
    usage: `import { Alert } from "@/components/Alert";

export default function Example() {
  return (
    <Alert
      variant="info"
      title="Heads up"
      message="This is an informational alert message."
    />
  );
}`,
    props: [
      { name: "title", type: "string", required: true, description: "Alert heading text." },
      { name: "variant", type: '"success" | "error" | "warning" | "info" | "neutral"', default: '"info"', description: "Visual color variant." },
      { name: "message", type: "string", default: "undefined", description: "Supporting text below the title." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Custom icon; overrides the default variant icon." },
      { name: "dismissible", type: "boolean", default: "false", description: "Show a close button that hides the alert on click." },
      { name: "onDismiss", type: "() => void", default: "undefined", description: "Called when the dismiss button is clicked." },
      { name: "color", type: "string", default: "undefined", description: "Hex color override that replaces the variant's accent color." },
    ],
    examples: [
      {
        title: "Variants",
        description: "All five built-in variants.",
        code: `<Alert variant="success" title="Saved!" message="Your changes have been saved." />
<Alert variant="error"   title="Error"   message="Something went wrong." />
<Alert variant="warning" title="Warning" message="Storage is almost full." />
<Alert variant="info"    title="Info"    message="A new version is available." />
<Alert variant="neutral" title="Note"    message="This feature is in beta." />`,
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Alert variant="success" title="Saved!" message="Your changes have been saved." />
            <Alert variant="error" title="Error" message="Something went wrong." />
            <Alert variant="warning" title="Warning" message="Storage is almost full." />
            <Alert variant="info" title="Info" message="A new version is available." />
            <Alert variant="neutral" title="Note" message="This feature is in beta." />
          </div>
        ),
      },
      {
        title: "Dismissible alert",
        description: "Renders a close button that hides the alert.",
        code: `<Alert
  variant="info"
  title="New update available"
  message="Version 2.0 is ready to install."
  dismissible
/>`,
        preview: <Alert variant="info" title="New update available" message="Version 2.0 is ready to install." dismissible />,
      },
    ],
  },

  avatar: {
    name: "Avatar",
    slug: "avatar",
    category: "Display",
    description: "Displays a user avatar with a fallback gradient + initials when no image is provided. Supports status indicators, animated ring, and grouped stacks via AvatarGroup.",
    usage: `import { Avatar, AvatarGroup } from "@/components/Avatar";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar name="Jane Doe" size="md" status="online" />
      <AvatarGroup names={["Alice", "Bob", "Carol", "Dave"]} size="sm" />
    </div>
  );
}`,
    props: [
      { name: "name", type: "string", default: '""', description: "User name used for initials and gradient generation." },
      { name: "src", type: "string", default: "undefined", description: "Image URL. Falls back to initials when omitted or invalid." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar diameter preset." },
      { name: "ring", type: "boolean", default: "false", description: "Animated conic-gradient ring around the avatar." },
      { name: "ringColor", type: "string", default: '"#876cff"', description: "Hex color for the ring gradient." },
      { name: "status", type: '"online" | "offline" | "away" | "busy"', default: "undefined", description: "Status dot shown at bottom-right." },
      { name: "color", type: "string", default: "undefined", description: "Hex override for the background color instead of gradient." },
    ],
    examples: [
      {
        title: "Sizes and statuses",
        description: "Avatars across all five size presets with status dots.",
        code: `<Avatar name="Alice" size="xs" status="online" />
<Avatar name="Bob"   size="sm" status="away" />
<Avatar name="Carol" size="md" status="busy" />
<Avatar name="Dave"  size="lg" status="offline" />
<Avatar name="Eve"   size="xl" ring />`,
        preview: (
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <Avatar name="Alice" size="xs" status="online" />
            <Avatar name="Bob" size="sm" status="away" />
            <Avatar name="Carol" size="md" status="busy" />
            <Avatar name="Dave" size="lg" status="offline" />
            <Avatar name="Eve" size="xl" ring />
          </div>
        ),
      },
      {
        title: "Avatar group",
        description: "AvatarGroup stacks multiple avatars with overflow count.",
        code: `<AvatarGroup
  names={["Alice", "Bob", "Carol", "Dave", "Eve"]}
  max={4}
  size="sm"
/>`,
        preview: <AvatarGroup names={["Alice", "Bob", "Carol", "Dave", "Eve"]} max={4} size="sm" />,
      },
    ],
  },

  badge: {
    name: "Badge",
    slug: "badge",
    category: "Display",
    description: "A small label component for highlighting status, count, or category. Derives all colors from a single hex prop. Supports dot indicators, icons, and removable tags.",
    usage: `import { Badge } from "@/components/Badge";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge>Default</Badge>
      <Badge color="#4ade80">Success</Badge>
      <Badge color="#f87171" dot>Error</Badge>
    </div>
  );
}`,
    props: [
      { name: "children", type: "ReactNode", required: true, description: "Badge label content." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size preset controlling height, padding, and font." },
      { name: "dot", type: "boolean", default: "false", description: "Show a glowing color dot before the label." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Custom icon before the label." },
      { name: "removable", type: "boolean", default: "false", description: "Show an × remove button." },
      { name: "onRemove", type: "() => void", default: "undefined", description: "Called when the remove button is clicked." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color — derives background, border, and text." },
    ],
    examples: [
      {
        title: "Color variants",
        description: "Badges with different hex accent colors.",
        code: `<Badge color="#876cff">Purple</Badge>
<Badge color="#4ade80">Green</Badge>
<Badge color="#f87171">Red</Badge>
<Badge color="#fbbf24">Yellow</Badge>
<Badge color="#60a5fa">Blue</Badge>`,
        preview: (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Badge color="#876cff">Purple</Badge>
            <Badge color="#4ade80">Green</Badge>
            <Badge color="#f87171">Red</Badge>
            <Badge color="#fbbf24">Yellow</Badge>
            <Badge color="#60a5fa">Blue</Badge>
          </div>
        ),
      },
      {
        title: "Dot, sizes, removable",
        description: "Badges with dot indicator, all sizes, and removable.",
        code: `<Badge dot color="#4ade80">Online</Badge>
<Badge size="sm" color="#876cff">Small</Badge>
<Badge size="lg" color="#876cff">Large</Badge>
<Badge removable color="#f87171" onRemove={() => {}}>Removable</Badge>`,
        preview: (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <Badge dot color="#4ade80">Online</Badge>
            <Badge size="sm" color="#876cff">Small</Badge>
            <Badge size="lg" color="#876cff">Large</Badge>
            <Badge removable color="#f87171" onRemove={() => {}}>Removable</Badge>
          </div>
        ),
      },
    ],
  },

  banner: {
    name: "Banner",
    slug: "banner",
    category: "Feedback",
    description: "A full-width notification strip for important messages or promotions. Features a left accent bar, variant icon, optional action slot, and dismissible behavior.",
    usage: `import { Banner } from "@/components/Banner";

export default function Example() {
  return (
    <Banner variant="success">
      Your account has been upgraded to Pro.
    </Banner>
  );
}`,
    props: [
      { name: "children", type: "ReactNode", required: true, description: "Banner content (text or JSX)." },
      { name: "variant", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Color variant that sets icon and accent color." },
      { name: "dismissible", type: "boolean", default: "false", description: "Show a close button that removes the banner." },
      { name: "onDismiss", type: "() => void", default: "undefined", description: "Called when dismissed." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Custom icon; overrides variant icon." },
      { name: "action", type: "ReactNode", default: "undefined", description: "Action element rendered at the trailing edge." },
      { name: "color", type: "string", default: "undefined", description: "Hex override that replaces the variant's accent color." },
    ],
    examples: [
      {
        title: "All variants",
        description: "Four built-in banner variants.",
        code: `<Banner variant="info">A new version of the dashboard is available.</Banner>
<Banner variant="success">Your subscription has been activated.</Banner>
<Banner variant="warning">Your trial expires in 3 days.</Banner>
<Banner variant="error">Payment method declined.</Banner>`,
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Banner variant="info">A new version of the dashboard is available.</Banner>
            <Banner variant="success">Your subscription has been activated.</Banner>
            <Banner variant="warning">Your trial expires in 3 days.</Banner>
            <Banner variant="error">Payment method declined.</Banner>
          </div>
        ),
      },
      {
        title: "Dismissible with action",
        description: "Banner with close button and action link.",
        code: `<Banner
  variant="info"
  dismissible
  action={<Button size="sm" variant="ghost">Learn more</Button>}
>
  smth UI v2.0 is now available with new components.
</Banner>`,
        preview: (
          <Banner
            variant="info"
            dismissible
            action={<Button size="sm" variant="ghost">Learn more</Button>}
          >
            smth UI v2.0 is now available with new components.
          </Banner>
        ),
      },
    ],
  },

  breadcrumb: {
    name: "Breadcrumb",
    slug: "breadcrumb",
    category: "Navigation",
    description: "A navigation trail showing the user's current location within a hierarchy. Items can be links (href), buttons (onClick), or plain text for the current page.",
    usage: `import { Breadcrumb } from "@/components/Breadcrumb";

export default function Example() {
  return (
    <Breadcrumb items={[
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "Button" },
    ]} />
  );
}`,
    props: [
      { name: "items", type: "BreadcrumbItem[]", required: true, description: "Array of { label, href?, onClick? } objects. Last item is the current page." },
    ],
    examples: [
      {
        title: "Simple breadcrumb",
        description: "Three-level breadcrumb with link items.",
        code: `<Breadcrumb items={[
  { label: "Home", href: "/" },
  { label: "Components", href: "/docs" },
  { label: "Breadcrumb" },
]} />`,
        preview: (
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Components", href: "/docs" },
            { label: "Breadcrumb" },
          ]} />
        ),
      },
      {
        title: "With onClick handlers",
        description: "Breadcrumb items using onClick instead of href.",
        code: `<Breadcrumb items={[
  { label: "Dashboard", onClick: () => {} },
  { label: "Projects", onClick: () => {} },
  { label: "smth UI" },
]} />`,
        preview: (
          <Breadcrumb items={[
            { label: "Dashboard", onClick: () => {} },
            { label: "Projects", onClick: () => {} },
            { label: "smth UI" },
          ]} />
        ),
      },
    ],
  },

  button: {
    name: "Button",
    slug: "button",
    category: "Input",
    description: "Triggers an action or event. Supports five variants, five sizes, loading state, left/right icons, pill shape, full-width layout, and a hex color override for the primary gradient.",
    usage: `import { Button } from "@/components/Button";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}`,
    props: [
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "danger" | "outline"', default: '"primary"', description: "Visual style." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Button size preset." },
      { name: "loading", type: "boolean", default: "false", description: "Replaces icon/content with a spinner and disables the button." },
      { name: "iconLeft", type: "ReactNode", default: "undefined", description: "Icon rendered before the label." },
      { name: "iconRight", type: "ReactNode", default: "undefined", description: "Icon rendered after the label." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches button to fill its container." },
      { name: "pill", type: "boolean", default: "false", description: "Applies fully rounded corners." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex color override for the primary gradient." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the button." },
      { name: "children", type: "ReactNode", required: true, description: "Button label." },
    ],
    examples: [
      {
        title: "Variants",
        description: "All five button variants side by side.",
        code: `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>`,
        preview: (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
          </div>
        ),
      },
      {
        title: "Sizes, loading, pill",
        description: "Size scale, loading state, and pill shape.",
        code: `<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="md">MD</Button>
<Button size="lg">LG</Button>
<Button size="xl">XL</Button>
<Button loading>Loading</Button>
<Button pill>Pill</Button>`,
        preview: (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
            <Button loading>Loading</Button>
            <Button pill>Pill</Button>
          </div>
        ),
      },
    ],
  },

  card: {
    name: "Card",
    slug: "card",
    category: "Layout",
    description: "A versatile surface container with a dark gradient background, noise texture overlay, specular top highlight, and variant-based border/glow. Becomes interactive when onClick is provided.",
    usage: `import { Card } from "@/components/Card";

export default function Example() {
  return (
    <Card variant="elevated" padding="24px">
      <h3>Card title</h3>
      <p>Card body content.</p>
    </Card>
  );
}`,
    props: [
      { name: "children", type: "ReactNode", required: true, description: "Card content." },
      { name: "variant", type: '"default" | "elevated" | "flat" | "outlined" | "danger" | "success"', default: '"default"', description: "Border and outer glow preset." },
      { name: "padding", type: "string", default: '"20px"', description: "CSS padding shorthand." },
      { name: "radius", type: "string", default: '"var(--radius-lg, 16px)"', description: "CSS border-radius value." },
      { name: "noise", type: "boolean", default: "true", description: "Renders a subtle SVG noise texture overlay." },
      { name: "specular", type: "boolean", default: "true", description: "Renders a 1px specular highlight at the top edge." },
      { name: "onClick", type: "() => void", default: "undefined", description: "If provided, card becomes clickable with hover lift." },
      { name: "borderColor", type: "string", default: "undefined", description: "Hex or rgba override for the card border." },
      { name: "glowColor", type: "string", default: "undefined", description: "rgba override for the outer glow shadow." },
      { name: "accentTop", type: "string", default: "undefined", description: "CSS gradient string for a 2px top stripe accent." },
    ],
    examples: [
      {
        title: "Variants",
        description: "Card with different variant styles.",
        code: `<Card variant="default" padding="24px">Default</Card>
<Card variant="danger"  padding="24px">Danger</Card>
<Card variant="success" padding="24px">Success</Card>`,
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Card variant="default" padding="20px"><span style={{ color: "var(--text-sub)", fontSize: "14px" }}>Default card</span></Card>
            <Card variant="danger" padding="20px"><span style={{ color: "var(--text-sub)", fontSize: "14px" }}>Danger card</span></Card>
            <Card variant="success" padding="20px"><span style={{ color: "var(--text-sub)", fontSize: "14px" }}>Success card</span></Card>
          </div>
        ),
      },
      {
        title: "Accent top stripe",
        description: "Card with a colored top border stripe and glow.",
        code: `<Card
  accentTop="linear-gradient(90deg, #876cff, #ec4899)"
  glowColor="rgba(135,108,255,0.06)"
  padding="24px"
>
  <p>Card with gradient accent stripe at top.</p>
</Card>`,
        preview: (
          <Card accentTop="linear-gradient(90deg, #876cff, #ec4899)" glowColor="rgba(135,108,255,0.06)" padding="20px">
            <p style={{ fontSize: "14px", color: "var(--text-sub)", margin: 0 }}>Card with gradient accent stripe at top.</p>
          </Card>
        ),
      },
    ],
  },

  codedisplay: {
    name: "CodeDisplay",
    slug: "codedisplay",
    category: "Display",
    description: "A styled code snippet display with a left accent bar, monospace text, and a copy-to-clipboard button that transitions to a checkmark on success.",
    usage: `import { CodeDisplay } from "@/components/CodeDisplay";

export default function Example() {
  return <CodeDisplay code="npm install @puskevi/smth-ui" label="Install" />;
}`,
    props: [
      { name: "code", type: "string", required: true, description: "The code string to display." },
      { name: "label", type: "string", default: "undefined", description: "Small uppercase label shown above the block." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for the left bar, text, and glow." },
      { name: "maxWidth", type: "string | number", default: "undefined", description: "Max width constraint for the container." },
    ],
    examples: [
      {
        title: "Install command",
        description: "Typical usage for showing a terminal command.",
        code: `<CodeDisplay code="npm install @puskevi/smth-ui" label="Install" />`,
        preview: <CodeDisplay code="npm install @puskevi/smth-ui" label="Install" />,
      },
      {
        title: "Custom color",
        description: "CodeDisplay with a custom accent color.",
        code: `<CodeDisplay code="pnpm add @puskevi/smth-ui" color="#4ade80" label="pnpm" />`,
        preview: <CodeDisplay code="pnpm add @puskevi/smth-ui" color="#4ade80" label="pnpm" />,
      },
    ],
  },

  colorpicker: {
    name: "ColorPicker",
    slug: "colorpicker",
    category: "Input",
    description: "An inline color picker with a live preview circle, a grid of preset swatches, and a hex text input with real-time validation. All colors are driven by a single hex value prop.",
    usage: `import { ColorPicker } from "@/components/ColorPicker";
import { useState } from "react";

export default function Example() {
  const [color, setColor] = useState("#876cff");
  return <ColorPicker value={color} onChange={setColor} label="Accent color" />;
}`,
    props: [
      { name: "value", type: "string", required: true, description: "Current hex color value (e.g. '#876cff')." },
      { name: "onChange", type: "(hex: string) => void", required: true, description: "Called with the new hex string when color changes." },
      { name: "label", type: "string", default: "undefined", description: "Label rendered above the picker." },
      { name: "presets", type: "string[]", default: "DEFAULT_PRESETS", description: "Array of hex strings for the preset swatch grid." },
      { name: "showInput", type: "boolean", default: "true", description: "Show the hex text input below the swatches." },
    ],
    examples: [
      {
        title: "Default color picker",
        description: "Interactive color picker with presets and hex input.",
        code: `function Example() {
  const [color, setColor] = useState("#876cff");
  return <ColorPicker value={color} onChange={setColor} label="Accent color" />;
}`,
        preview: <ColorPickerPreview />,
      },
      {
        title: "Presets only",
        description: "Color picker without the hex input.",
        code: `function Example() {
  const [color, setColor] = useState("#10b981");
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      label="Theme color"
      showInput={false}
      presets={["#876cff","#ec4899","#10b981","#f59e0b","#0ea5e9"]}
    />
  );
}`,
        preview: <ColorPickerGreenPreview />,
      },
    ],
  },

  combobox: {
    name: "Combobox",
    slug: "combobox",
    category: "Input",
    description: "A searchable dropdown that combines a text input with a filtered listbox. Uses a portal for the dropdown to avoid z-index issues. Highlights matching text in results.",
    usage: `import { Combobox } from "@/components/Combobox";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      label="Country"
      options={[
        { value: "us", label: "United States" },
        { value: "gb", label: "United Kingdom" },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Search countries…"
    />
  );
}`,
    props: [
      { name: "options", type: "ComboboxOption[]", required: true, description: "Array of { value, label, disabled? } objects." },
      { name: "value", type: "string", default: "undefined", description: "Controlled selected value." },
      { name: "onChange", type: "(value: string) => void", default: "undefined", description: "Called when an option is selected." },
      { name: "placeholder", type: "string", default: '"Search…"', description: "Input placeholder text." },
      { name: "label", type: "string", default: "undefined", description: "Label above the input." },
      { name: "hint", type: "string", default: "undefined", description: "Helper text below." },
      { name: "error", type: "string", default: "undefined", description: "Error message; applies error styling." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the combobox." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for focus ring and selected state." },
      { name: "emptyText", type: "string", default: '"No results"', description: "Text shown when no options match the query." },
    ],
    examples: [
      {
        title: "Country search",
        description: "Searchable country dropdown with highlight.",
        code: `function Example() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      label="Country"
      options={countries}
      value={value}
      onChange={setValue}
      placeholder="Search countries…"
    />
  );
}`,
        preview: <ComboboxPreview />,
      },
      {
        title: "With error state",
        description: "Combobox in an error state.",
        code: `<Combobox
  label="Framework"
  options={[{ value: "react", label: "React" }]}
  placeholder="Choose…"
  error="Selection is required"
/>`,
        preview: (
          <Combobox
            label="Framework"
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
            ]}
            placeholder="Choose…"
            error="Selection is required"
          />
        ),
      },
    ],
  },

  digitcounter: {
    name: "DigitCounter",
    slug: "digitcounter",
    category: "Display",
    description: "An animated segmented counter that rolls through random digits before landing on the target value. Each digit tile features a dark surface with color-matched border and glow.",
    usage: `import { DigitCounter } from "@/components/DigitCounter";

export default function Example() {
  return <DigitCounter value={1337} label="HIGH SCORE" />;
}`,
    props: [
      { name: "value", type: "number", required: true, description: "The number to display. Decimals are floored." },
      { name: "label", type: "string", default: "undefined", description: "Uppercase label rendered below the digit tiles." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Icon tile prepended before the digit tiles." },
      { name: "digits", type: "number", default: "4", description: "Total number of digit tiles (zero-padded from left)." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for digits, border, and glow." },
    ],
    examples: [
      {
        title: "Basic counter",
        description: "Four-digit counter with label.",
        code: `<DigitCounter value={1337} label="HIGH SCORE" />`,
        preview: <DigitCounter value={1337} label="HIGH SCORE" />,
      },
      {
        title: "Custom color and more digits",
        description: "Six-digit counter with green accent.",
        code: `<DigitCounter value={999999} digits={6} color="#4ade80" label="TOTAL SALES" />`,
        preview: <DigitCounter value={999999} digits={6} color="#4ade80" label="TOTAL SALES" />,
      },
    ],
  },

  divider: {
    name: "Divider",
    slug: "divider",
    category: "Layout",
    description: "A thin horizontal separator line, optionally with a centered text label. Uses a subtle default color that respects the dark surface.",
    usage: `import { Divider } from "@/components/Divider";

export default function Example() {
  return (
    <div>
      <p>Above</p>
      <Divider label="or" />
      <p>Below</p>
    </div>
  );
}`,
    props: [
      { name: "label", type: "string", default: "undefined", description: "Centered text label rendered between two lines." },
      { name: "color", type: "string", default: '"rgba(255,255,255,0.07)"', description: "CSS color value for the line." },
    ],
    examples: [
      {
        title: "Plain divider",
        description: "Simple horizontal separator.",
        code: `<Divider />`,
        preview: <Divider />,
      },
      {
        title: "Labeled divider",
        description: "Divider with centered text label.",
        code: `<Divider label="or continue with" />`,
        preview: <Divider label="or continue with" />,
      },
    ],
  },

  drawer: {
    name: "Drawer",
    slug: "drawer",
    category: "Overlay",
    description: "A panel that slides in from the left or right edge of the viewport with a blurred backdrop. Includes focus trap, Escape key dismiss, and animated entry/exit.",
    usage: `import { Drawer } from "@/components/Drawer";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Settings">
        <p>Drawer body content.</p>
      </Drawer>
    </>
  );
}`,
    props: [
      { name: "open", type: "boolean", required: true, description: "Controls drawer visibility." },
      { name: "onClose", type: "() => void", required: true, description: "Called on backdrop click or Escape key." },
      { name: "title", type: "string", default: "undefined", description: "Header title text." },
      { name: "side", type: '"right" | "left"', default: '"right"', description: "Edge the drawer slides in from." },
      { name: "width", type: "string", default: '"400px"', description: "CSS width of the drawer panel." },
      { name: "children", type: "ReactNode", required: true, description: "Drawer body content." },
      { name: "footer", type: "ReactNode", default: "undefined", description: "Sticky footer content." },
    ],
    examples: [
      {
        title: "Right drawer",
        description: "Settings drawer that slides in from the right.",
        code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Settings">
        {/* content */}
      </Drawer>
    </>
  );
}`,
        preview: <DrawerPreview />,
      },
      {
        title: "Left navigation drawer",
        description: "Drawer that slides from the left for navigation.",
        code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Navigation</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="left">
        {/* nav items */}
      </Drawer>
    </>
  );
}`,
        preview: <DrawerLeftPreview />,
      },
    ],
  },

  dropdownmenu: {
    name: "DropdownMenu",
    slug: "dropdownmenu",
    category: "Overlay",
    description: "A floating contextual menu anchored to a trigger element. Renders via portal, auto-flips to avoid viewport edges, and supports icons, keyboard shortcuts, dividers, and danger items.",
    usage: `import { DropdownMenu } from "@/components/DropdownMenu";

export default function Example() {
  return (
    <DropdownMenu
      trigger={<Button variant="secondary">Actions</Button>}
      items={[
        { id: "edit",   label: "Edit"   },
        { id: "delete", label: "Delete", danger: true },
      ]}
      onSelect={(id) => console.log(id)}
    />
  );
}`,
    props: [
      { name: "trigger", type: "ReactNode", required: true, description: "Element that opens the menu on click." },
      { name: "items", type: "MenuItem[]", required: true, description: "Array of { id, label, icon?, shortcut?, danger?, disabled?, divider? } objects." },
      { name: "onSelect", type: "(id: string) => void", default: "undefined", description: "Called with the item id when selected." },
      { name: "align", type: '"left" | "right"', default: '"left"', description: "Horizontal alignment relative to the trigger." },
    ],
    examples: [
      {
        title: "Actions menu",
        description: "Dropdown with icon items, shortcut, and danger item.",
        code: `<DropdownMenu
  trigger={<Button variant="secondary">Actions</Button>}
  items={[
    { id: "edit",   label: "Edit",   shortcut: "⌘E" },
    { id: "copy",   label: "Duplicate" },
    { id: "delete", label: "Delete", danger: true, divider: true },
  ]}
  onSelect={(id) => console.log(id)}
/>`,
        preview: (
          <DropdownMenu
            trigger={<Button variant="secondary">Actions</Button>}
            items={[
              { id: "edit", label: "Edit", shortcut: "⌘E" },
              { id: "copy", label: "Duplicate" },
              { id: "delete", label: "Delete", danger: true, divider: true },
            ]}
            onSelect={id => console.log(id)}
          />
        ),
      },
      {
        title: "Right-aligned menu",
        description: "Menu aligned to the right edge of the trigger.",
        code: `<DropdownMenu
  trigger={<Button size="sm" variant="ghost">⋯</Button>}
  align="right"
  items={[
    { id: "view",   label: "View details" },
    { id: "share",  label: "Share link"   },
    { id: "remove", label: "Remove", danger: true, divider: true },
  ]}
/>`,
        preview: (
          <DropdownMenu
            trigger={<Button size="sm" variant="ghost">⋯</Button>}
            align="right"
            items={[
              { id: "view", label: "View details" },
              { id: "share", label: "Share link" },
              { id: "remove", label: "Remove", danger: true, divider: true },
            ]}
          />
        ),
      },
    ],
  },

  emptystate: {
    name: "EmptyState",
    slug: "emptystate",
    category: "Display",
    description: "A centered placeholder shown when a list or section has no content. Features an icon tile with a radial glow, title, message, and optional action slot.",
    usage: `import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";

export default function Example() {
  return (
    <EmptyState
      title="No results found"
      message="Try adjusting your search or filters."
      action={<Button size="sm">Clear filters</Button>}
    />
  );
}`,
    props: [
      { name: "title", type: "string", required: true, description: "Primary heading text." },
      { name: "message", type: "string", default: "undefined", description: "Secondary description text." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Icon displayed above the title in a styled tile." },
      { name: "action", type: "ReactNode", default: "undefined", description: "CTA element rendered below the message." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for the icon tile and glow." },
    ],
    examples: [
      {
        title: "Empty search results",
        description: "Empty state with icon and action button.",
        code: `<EmptyState
  icon={<svg>…</svg>}
  title="No results found"
  message="Try adjusting your search or filters."
  action={<Button size="sm">Clear filters</Button>}
/>`,
        preview: (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            }
            title="No results found"
            message="Try adjusting your search or filters."
            action={<Button size="sm">Clear filters</Button>}
          />
        ),
      },
      {
        title: "Empty inbox",
        description: "Minimal empty state without an action.",
        code: `<EmptyState
  title="All caught up!"
  message="You have no new notifications."
  color="#4ade80"
/>`,
        preview: <EmptyState title="All caught up!" message="You have no new notifications." color="#4ade80" />,
      },
    ],
  },

  input: {
    name: "Input",
    slug: "input",
    category: "Input",
    description: "A styled text input with label, hint, error/success states, icon slots, clearable behavior, and three size presets. Also exports a Textarea component with the same styling system.",
    usage: `import { Input } from "@/components/Input";

export default function Example() {
  return (
    <Input
      label="Email"
      placeholder="you@example.com"
      type="email"
      hint="We'll never share your email."
    />
  );
}`,
    props: [
      { name: "label", type: "string", default: "undefined", description: "Label rendered above the input." },
      { name: "hint", type: "string", default: "undefined", description: "Helper text below the input." },
      { name: "error", type: "string", default: "undefined", description: "Error message; applies red error styling." },
      { name: "success", type: "string | boolean", default: "undefined", description: "Success state; shows green ring and checkmark." },
      { name: "iconLeft", type: "ReactNode", default: "undefined", description: "Icon rendered inside the left edge." },
      { name: "iconRight", type: "ReactNode", default: "undefined", description: "Icon rendered inside the right edge." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches the input to fill its container." },
      { name: "clearable", type: "boolean", default: "false", description: "Shows a clear button when there is a value." },
      { name: "onClear", type: "() => void", default: "undefined", description: "Called when the clear button is clicked." },
      { name: "inputSize", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and font size preset." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for focus ring and border." },
    ],
    examples: [
      {
        title: "Input states",
        description: "Default, error, and success states.",
        code: `<Input label="Username" placeholder="johndoe" />
<Input label="Email" placeholder="you@example.com" error="Invalid email address" />
<Input label="Username" value="johndoe" success="Username available" />`,
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="Username" placeholder="johndoe" />
            <Input label="Email" placeholder="you@example.com" error="Invalid email address" />
            <Input label="Username" defaultValue="johndoe" success="Username available" />
          </div>
        ),
      },
      {
        title: "With icons",
        description: "Input with left search icon.",
        code: `<Input
  label="Search"
  placeholder="Search components…"
  iconLeft={<svg>…</svg>}
/>`,
        preview: (
          <Input
            label="Search"
            placeholder="Search components…"
            iconLeft={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            }
          />
        ),
      },
    ],
  },

  kbd: {
    name: "Kbd",
    slug: "kbd",
    category: "Display",
    description: "Renders keyboard shortcut keys with a monospace, keycap-style appearance. Takes an array of key strings and joins them with '+' separators.",
    usage: `import { Kbd } from "@/components/Kbd";

export default function Example() {
  return (
    <span style={{ fontSize: 14 }}>
      Press <Kbd keys={["⌘", "K"]} /> to search
    </span>
  );
}`,
    props: [
      { name: "keys", type: "string[]", required: true, description: "Array of key label strings to display." },
    ],
    examples: [
      {
        title: "Keyboard shortcuts",
        description: "Common keyboard shortcut combinations.",
        code: `<Kbd keys={["⌘", "K"]} />
<Kbd keys={["Ctrl", "Shift", "P"]} />
<Kbd keys={["Esc"]} />`,
        preview: (
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <Kbd keys={["⌘", "K"]} />
            <Kbd keys={["Ctrl", "Shift", "P"]} />
            <Kbd keys={["Esc"]} />
          </div>
        ),
      },
      {
        title: "Inline in text",
        description: "Kbd used inline inside a sentence.",
        code: `<span>Press <Kbd keys={["⌘", "S"]} /> to save changes.</span>`,
        preview: (
          <span style={{ fontSize: "14px", color: "var(--text-sub)" }}>
            Press <Kbd keys={["⌘", "S"]} /> to save changes.
          </span>
        ),
      },
    ],
  },

  modal: {
    name: "Modal",
    slug: "modal",
    category: "Overlay",
    description: "A dialog that renders over the page with a blurred backdrop. Includes focus trap, Escape key support, animated entry/exit, optional icon header, and a footer slot.",
    usage: `import { Modal } from "@/components/Modal";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action">
        <p>Are you sure you want to continue?</p>
      </Modal>
    </>
  );
}`,
    props: [
      { name: "open", type: "boolean", required: true, description: "Controls modal visibility." },
      { name: "onClose", type: "() => void", required: true, description: "Called on backdrop click, Escape, or close button." },
      { name: "title", type: "string", default: "undefined", description: "Modal header title." },
      { name: "subtitle", type: "string", default: "undefined", description: "Subtitle text below the title." },
      { name: "children", type: "ReactNode", required: true, description: "Modal body content." },
      { name: "footer", type: "ReactNode", default: "undefined", description: "Footer content (typically action buttons)." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Max width preset: 400px / 520px / 680px." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Icon displayed above the title in a centered layout." },
      { name: "iconColor", type: "string", default: '"#876cff"', description: "Hex color for the icon tile and ambient glow." },
    ],
    examples: [
      {
        title: "Confirmation modal",
        description: "Modal with title and body content.",
        code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action"
        subtitle="This operation cannot be undone.">
        <p>Are you sure you want to continue?</p>
      </Modal>
    </>
  );
}`,
        preview: <ModalPreview />,
      },
      {
        title: "Modal with footer actions",
        description: "Modal with cancel/confirm footer buttons.",
        code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>With footer</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete workspace"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        <Alert variant="warning" title="Warning" message="This is irreversible." />
      </Modal>
    </>
  );
}`,
        preview: <ModalWithFooterPreview />,
      },
    ],
  },

  notifications: {
    name: "Notifications",
    slug: "notifications",
    category: "Feedback",
    description: "A notification feed panel triggered by a bell icon. Lists notification items with avatar/icon, type badge, read/unread state, and individual dismiss. Uses a portal for the dropdown.",
    usage: `import { Notifications } from "@/components/Notifications";

const items = [
  { id: "1", title: "PR merged", time: "2m ago", type: "success" },
  { id: "2", title: "New comment", time: "14m ago", type: "info", avatar: "Alice" },
];

export default function Example() {
  return <Notifications items={items} />;
}`,
    props: [
      { name: "items", type: "NotificationItem[]", required: true, description: "Array of { id, title, body?, time, read?, type?, avatar?, icon? } objects." },
      { name: "onRead", type: "(id: string) => void", default: "undefined", description: "Called when a single notification is marked as read." },
      { name: "onReadAll", type: "() => void", default: "undefined", description: "Called when 'Mark all read' is clicked." },
      { name: "onDismiss", type: "(id: string) => void", default: "undefined", description: "Called when a notification is dismissed." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for the bell badge and unread dot." },
      { name: "align", type: '"left" | "right"', default: '"right"', description: "Horizontal alignment of the dropdown panel." },
      { name: "trigger", type: "ReactNode", default: "undefined", description: "Custom trigger element; defaults to a bell button." },
      { name: "maxHeight", type: "number", default: "380", description: "Max height in px for the notification list." },
      { name: "emptyText", type: "string", default: '"No notifications"', description: "Text shown when items array is empty." },
    ],
    examples: [
      {
        title: "Interactive notification feed",
        description: "Bell trigger with read/dismiss support.",
        code: `function Example() {
  const [items, setItems] = useState([...]);
  return (
    <Notifications
      items={items}
      onRead={id => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
      onReadAll={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
      onDismiss={id => setItems(prev => prev.filter(n => n.id !== id))}
    />
  );
}`,
        preview: <NotificationsPreview />,
      },
      {
        title: "Empty state",
        description: "Notifications with an empty list.",
        code: `<Notifications items={[]} emptyText="You're all caught up!" />`,
        preview: <Notifications items={[]} emptyText="You're all caught up!" />,
      },
    ],
  },

  numberinput: {
    name: "NumberInput",
    slug: "numberinput",
    category: "Input",
    description: "A numeric stepper input with decrement and increment buttons, min/max enforcement, and a native number input for direct typing. Supports keyboard and mouse interaction.",
    usage: `import { NumberInput } from "@/components/NumberInput";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(5);
  return (
    <NumberInput value={value} onChange={setValue} min={0} max={20} label="Quantity" />
  );
}`,
    props: [
      { name: "value", type: "number", required: true, description: "Controlled numeric value." },
      { name: "onChange", type: "(value: number) => void", required: true, description: "Called with the new value on change." },
      { name: "min", type: "number", default: "undefined", description: "Minimum allowed value." },
      { name: "max", type: "number", default: "undefined", description: "Maximum allowed value." },
      { name: "step", type: "number", default: "1", description: "Increment/decrement step size." },
      { name: "label", type: "string", default: "undefined", description: "Label rendered above the input." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables all interactions." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for focus ring." },
    ],
    examples: [
      {
        title: "Quantity stepper",
        description: "NumberInput with min/max and label.",
        code: `function Example() {
  const [value, setValue] = useState(5);
  return <NumberInput value={value} onChange={setValue} min={0} max={20} label="Quantity" />;
}`,
        preview: <NumberInputPreview />,
      },
      {
        title: "Disabled state",
        description: "NumberInput in disabled state.",
        code: `<NumberInput value={10} onChange={() => {}} min={0} max={100} label="Locked" disabled />`,
        preview: <NumberInput value={10} onChange={() => {}} min={0} max={100} label="Locked" disabled />,
      },
    ],
  },

  pagination: {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation",
    description: "Page navigation control that generates a smart page list with ellipses and previous/next arrows. Supports controlled and uncontrolled modes.",
    usage: `import { Pagination } from "@/components/Pagination";
import { useState } from "react";

export default function Example() {
  const [page, setPage] = useState(1);
  return <Pagination total={120} pageSize={10} page={page} onChange={setPage} />;
}`,
    props: [
      { name: "total", type: "number", required: true, description: "Total number of items." },
      { name: "pageSize", type: "number", default: "10", description: "Number of items per page." },
      { name: "page", type: "number", default: "undefined", description: "Controlled current page (1-based)." },
      { name: "onChange", type: "(page: number) => void", default: "undefined", description: "Called when the user navigates to a new page." },
      { name: "siblings", type: "number", default: "1", description: "Number of page buttons shown on each side of the current page." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for the active page button." },
    ],
    examples: [
      {
        title: "Basic pagination",
        description: "Controlled pagination with 120 items.",
        code: `function Example() {
  const [page, setPage] = useState(1);
  return <Pagination total={120} pageSize={10} page={page} onChange={setPage} />;
}`,
        preview: <PaginationPreview />,
      },
      {
        title: "Custom color and siblings",
        description: "Pagination with pink accent and 2 siblings.",
        code: `<Pagination total={200} pageSize={10} page={5} siblings={2} color="#ec4899" />`,
        preview: <Pagination total={200} pageSize={10} page={5} siblings={2} color="#ec4899" />,
      },
    ],
  },

  popover: {
    name: "Popover",
    slug: "popover",
    category: "Overlay",
    description: "A non-modal floating panel anchored to a trigger element. Renders via portal and supports four placement options. Includes noise texture, specular line, and animated entry.",
    usage: `import { Popover } from "@/components/Popover";

export default function Example() {
  return (
    <Popover
      trigger={<Button variant="secondary">Info</Button>}
      title="Did you know?"
      content="This popover can hold any JSX content."
    />
  );
}`,
    props: [
      { name: "trigger", type: "ReactNode", required: true, description: "Element that toggles the popover on click." },
      { name: "content", type: "ReactNode", required: true, description: "Popover body content." },
      { name: "placement", type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: "Preferred placement relative to the trigger." },
      { name: "title", type: "string", default: "undefined", description: "Bold title shown above the content." },
      { name: "width", type: "string", default: '"260px"', description: "CSS width of the popover panel." },
    ],
    examples: [
      {
        title: "Info popover",
        description: "Popover with title and body triggered by a button.",
        code: `<Popover
  trigger={<Button variant="secondary">Info</Button>}
  title="Feature details"
  content="This is a contextual explanation of the feature."
/>`,
        preview: (
          <Popover
            trigger={<Button variant="secondary">Info</Button>}
            title="Feature details"
            content="This is a contextual explanation of the feature."
          />
        ),
      },
      {
        title: "Top placement",
        description: "Popover that opens above the trigger.",
        code: `<Popover
  trigger={<Button size="sm" variant="ghost">Hover area</Button>}
  placement="top"
  content="Opens above the trigger."
/>`,
        preview: (
          <Popover
            trigger={<Button size="sm" variant="ghost">Opens above</Button>}
            placement="top"
            content="Opens above the trigger."
          />
        ),
      },
    ],
  },

  progress: {
    name: "Progress",
    slug: "progress",
    category: "Feedback",
    description: "A linear progress bar with shimmer animation, tip glow, and optional indeterminate mode. Supports five color variants, three height sizes, and a hex color override.",
    usage: `import { Progress } from "@/components/Progress";

export default function Example() {
  return (
    <Progress value={65} variant="purple" size="md" label="Uploading" showValue />
  );
}`,
    props: [
      { name: "value", type: "number", required: true, description: "Progress value from 0 to 100." },
      { name: "variant", type: '"purple" | "green" | "red" | "yellow" | "blue"', default: '"purple"', description: "Built-in gradient color preset." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Track height preset (5px / 8px / 12px)." },
      { name: "label", type: "string", default: "undefined", description: "Label displayed above the track." },
      { name: "showValue", type: "boolean", default: "false", description: "Show the percentage value badge." },
      { name: "animated", type: "boolean", default: "true", description: "Enable shimmer sweep animation." },
      { name: "color", type: "string", default: "undefined", description: "Hex color override for the bar." },
      { name: "indeterminate", type: "boolean", default: "false", description: "Show infinite loading animation instead of value." },
    ],
    examples: [
      {
        title: "Variants",
        description: "Progress bars in all five color variants.",
        code: `<Progress value={70} variant="purple" label="Purple" showValue />
<Progress value={60} variant="green"  label="Green"  showValue />
<Progress value={40} variant="red"    label="Red"    showValue />
<Progress value={55} variant="yellow" label="Yellow" showValue />
<Progress value={80} variant="blue"   label="Blue"   showValue />`,
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Progress value={70} variant="purple" label="Purple" showValue />
            <Progress value={60} variant="green" label="Green" showValue />
            <Progress value={40} variant="red" label="Red" showValue />
            <Progress value={55} variant="yellow" label="Yellow" showValue />
            <Progress value={80} variant="blue" label="Blue" showValue />
          </div>
        ),
      },
      {
        title: "Indeterminate",
        description: "Infinite loading animation when progress is unknown.",
        code: `<Progress value={0} variant="purple" label="Loading…" indeterminate />`,
        preview: <Progress value={0} variant="purple" label="Loading…" indeterminate />,
      },
    ],
  },

  select: {
    name: "Select",
    slug: "select",
    category: "Input",
    description: "A fully custom dropdown select built with a button trigger and a positioned listbox. Supports full keyboard navigation, label, hint, error state, and a hex accent color.",
    usage: `import { Select } from "@/components/Select";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState("");
  return (
    <Select
      label="Framework"
      options={[
        { value: "react", label: "React" },
        { value: "vue",   label: "Vue"   },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Choose…"
    />
  );
}`,
    props: [
      { name: "options", type: "SelectOption[]", required: true, description: "Array of { value, label, disabled? } objects." },
      { name: "value", type: "string", default: "undefined", description: "Controlled selected value." },
      { name: "onChange", type: "(value: string) => void", default: "undefined", description: "Called when selection changes." },
      { name: "placeholder", type: "string", default: '"Select…"', description: "Placeholder text when no option is selected." },
      { name: "label", type: "string", default: "undefined", description: "Label rendered above the select." },
      { name: "hint", type: "string", default: "undefined", description: "Helper text below." },
      { name: "error", type: "string", default: "undefined", description: "Error message; applies error styling." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables the select." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for focus ring and selected option." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches to fill the container." },
    ],
    examples: [
      {
        title: "Framework select",
        description: "Controlled select with label and placeholder.",
        code: `function Example() {
  const [value, setValue] = useState("");
  return (
    <Select
      label="Framework"
      options={[
        { value: "react",  label: "React"  },
        { value: "vue",    label: "Vue"    },
        { value: "svelte", label: "Svelte" },
        { value: "solid",  label: "Solid"  },
      ]}
      value={value}
      onChange={setValue}
      placeholder="Choose a framework…"
    />
  );
}`,
        preview: <SelectPreview />,
      },
      {
        title: "With error and hint",
        description: "Select showing error and hint text.",
        code: `function Example() {
  const [value, setValue] = useState("");
  return (
    <Select
      label="Role"
      options={[{ value: "admin", label: "Admin" }]}
      value={value}
      onChange={setValue}
      placeholder="Select a role…"
      error={!value ? "Role is required" : undefined}
      hint="Determines access permissions"
    />
  );
}`,
        preview: <SelectWithErrorPreview />,
      },
    ],
  },

  sheet: {
    name: "Sheet",
    slug: "sheet",
    category: "Overlay",
    description: "A partial-screen panel that slides up from the bottom with a drag-to-dismiss handle. Renders via portal. Supports multiple height presets, focus trap, and Escape key dismiss.",
    usage: `import { Sheet } from "@/components/Sheet";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Quick actions">
        <p>Drag the handle to dismiss.</p>
      </Sheet>
    </>
  );
}`,
    props: [
      { name: "open", type: "boolean", required: true, description: "Controls sheet visibility." },
      { name: "onClose", type: "() => void", required: true, description: "Called when dismissed." },
      { name: "title", type: "string", default: "undefined", description: "Header title." },
      { name: "children", type: "ReactNode", required: true, description: "Sheet body content." },
      { name: "footer", type: "ReactNode", default: "undefined", description: "Sticky footer content." },
      { name: "height", type: '"sm" | "md" | "lg" | "full"', default: '"md"', description: "Max height preset: 30vh / 50vh / 75vh / 90vh." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for the drag handle, specular line, and border." },
    ],
    examples: [
      {
        title: "Bottom sheet",
        description: "Sheet with drag handle and title.",
        code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Quick actions" height="md">
        <p>Drag the handle to dismiss.</p>
      </Sheet>
    </>
  );
}`,
        preview: <SheetPreview />,
      },
      {
        title: "Large sheet",
        description: "Sheet at 75% viewport height.",
        code: `<Sheet open={open} onClose={close} title="Details" height="lg">
  {/* content */}
</Sheet>`,
        preview: <LargeSheetPreview />,
      },
    ],
  },

  skeleton: {
    name: "Skeleton",
    slug: "skeleton",
    category: "Feedback",
    description: "Placeholder loading states that mimic content layout during data fetching. Exports Skeleton (base), SkeletonText, SkeletonCard, SkeletonRow, and SkeletonAvatar.",
    usage: `import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function Example() {
  return (
    <div>
      <Skeleton width="200px" height="20px" />
      <SkeletonCard />
    </div>
  );
}`,
    props: [
      { name: "width", type: "string | number", default: '"100%"', description: "Skeleton element width." },
      { name: "height", type: "string | number", default: '"16px"', description: "Skeleton element height." },
      { name: "radius", type: "string", default: '"6px"', description: "Border radius of the skeleton shape." },
    ],
    examples: [
      {
        title: "SkeletonCard",
        description: "Pre-built card skeleton with avatar, lines, and text.",
        code: `<SkeletonCard />`,
        preview: <SkeletonCard />,
      },
      {
        title: "Custom skeletons",
        description: "Manually composed skeleton layout.",
        code: `<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
  <Skeleton width="60%" height="18px" />
  <SkeletonText lines={3} />
  <SkeletonRow />
</div>`,
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Skeleton width="60%" height="18px" />
            <SkeletonText lines={3} />
            <SkeletonRow />
          </div>
        ),
      },
    ],
  },

  slider: {
    name: "Slider",
    slug: "slider",
    category: "Input",
    description: "A custom range slider with a pointer-based drag handler, animated fill with tip glow, and an optional value badge. Includes a hidden native input for accessibility.",
    usage: `import { Slider } from "@/components/Slider";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(40);
  return <Slider value={value} onChange={setValue} label="Volume" showValue />;
}`,
    props: [
      { name: "value", type: "number", required: true, description: "Controlled slider value." },
      { name: "onChange", type: "(value: number) => void", required: true, description: "Called with the new value during drag." },
      { name: "min", type: "number", default: "0", description: "Minimum value." },
      { name: "max", type: "number", default: "100", description: "Maximum value." },
      { name: "step", type: "number", default: "1", description: "Step increment." },
      { name: "label", type: "string", default: "undefined", description: "Label above the slider." },
      { name: "showValue", type: "boolean", default: "false", description: "Show the current value badge." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables dragging." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for fill, thumb, and glow." },
    ],
    examples: [
      {
        title: "Volume and opacity sliders",
        description: "Two controlled sliders with different colors.",
        code: `function Example() {
  const [vol, setVol] = useState(40);
  const [opa, setOpa] = useState(70);
  return (
    <>
      <Slider value={vol} onChange={setVol} label="Volume"  showValue />
      <Slider value={opa} onChange={setOpa} label="Opacity" showValue color="#ec4899" />
    </>
  );
}`,
        preview: <SliderPreview />,
      },
      {
        title: "Disabled slider",
        description: "Slider in disabled state.",
        code: `<Slider value={50} onChange={() => {}} label="Locked" disabled />`,
        preview: <Slider value={50} onChange={() => {}} label="Locked" disabled />,
      },
    ],
  },

  spinner: {
    name: "Spinner",
    slug: "spinner",
    category: "Feedback",
    description: "An animated SVG loading spinner with configurable size, color, and screen reader label. Uses a single CSS animation class and no external dependencies.",
    usage: `import { Spinner } from "@/components/Spinner";

export default function Example() {
  return <Spinner size="md" color="#876cff" />;
}`,
    props: [
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Diameter preset: 16 / 24 / 36 / 48 px." },
      { name: "color", type: "string", default: '"var(--text-muted, #555)"', description: "SVG stroke color." },
      { name: "label", type: "string", default: '"Loading"', description: "aria-label for screen readers." },
    ],
    examples: [
      {
        title: "All sizes",
        description: "Spinner in all four size presets.",
        code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`,
        preview: (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Spinner size="sm" color="#876cff" />
            <Spinner size="md" color="#876cff" />
            <Spinner size="lg" color="#876cff" />
            <Spinner size="xl" color="#876cff" />
          </div>
        ),
      },
      {
        title: "Custom color",
        description: "Spinner with a custom accent color.",
        code: `<Spinner size="lg" color="#4ade80" />`,
        preview: <Spinner size="lg" color="#4ade80" />,
      },
    ],
  },

  statcard: {
    name: "StatCard",
    slug: "statcard",
    category: "Display",
    description: "A metric card with an uppercase label, large mono value, optional subtitle, icon tile, and trend badge. Uses the same elevated dark surface as Card.",
    usage: `import { StatCard } from "@/components/StatCard";

export default function Example() {
  return (
    <StatCard
      label="Total Revenue"
      value="$48,295"
      sub="Last 30 days"
      trend={{ value: "+12.5%", positive: true }}
    />
  );
}`,
    props: [
      { name: "label", type: "string", required: true, description: "Uppercase metric label." },
      { name: "value", type: "string | number", required: true, description: "Primary metric value." },
      { name: "sub", type: "string", default: "undefined", description: "Subtitle below the value." },
      { name: "icon", type: "ReactNode", default: "undefined", description: "Icon rendered in a colored tile at the top-right." },
      { name: "trend", type: "{ value: string; positive: boolean }", default: "undefined", description: "Trend badge with value string and direction." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for the icon tile." },
    ],
    examples: [
      {
        title: "Revenue stat card",
        description: "Stat card with trend badge and icon.",
        code: `<StatCard
  label="Total Revenue"
  value="$48,295"
  sub="Last 30 days"
  trend={{ value: "+12.5%", positive: true }}
  icon={<svg>…</svg>}
/>`,
        preview: (
          <StatCard
            label="Total Revenue"
            value="$48,295"
            sub="Last 30 days"
            trend={{ value: "+12.5%", positive: true }}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            }
          />
        ),
      },
      {
        title: "Negative trend",
        description: "Stat card with a red negative trend.",
        code: `<StatCard
  label="Churn Rate"
  value="3.2%"
  trend={{ value: "+0.4%", positive: false }}
  color="#f87171"
/>`,
        preview: <StatCard label="Churn Rate" value="3.2%" trend={{ value: "+0.4%", positive: false }} color="#f87171" />,
      },
    ],
  },

  stepper: {
    name: "Stepper",
    slug: "stepper",
    category: "Navigation",
    description: "A multi-step progress indicator with animated fill connectors, pulsing active circle, and check icons for completed steps. Supports horizontal and vertical orientations.",
    usage: `import { Stepper } from "@/components/Stepper";

export default function Example() {
  return (
    <Stepper
      steps={[
        { id: "account", label: "Account" },
        { id: "details", label: "Details" },
        { id: "confirm", label: "Confirm" },
      ]}
      activeStep={1}
    />
  );
}`,
    props: [
      { name: "steps", type: "StepperStep[]", required: true, description: "Array of { id, label, description? } step definitions." },
      { name: "activeStep", type: "number", required: true, description: "Zero-based index of the currently active step." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for active/completed step circles and connectors." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction of the stepper." },
    ],
    examples: [
      {
        title: "Interactive stepper",
        description: "Step through a multi-step flow with Back/Next buttons.",
        code: `function Example() {
  const [active, setActive] = useState(1);
  return (
    <>
      <Stepper
        steps={[
          { id: "account", label: "Account",  description: "Basic info" },
          { id: "details", label: "Details",  description: "Profile" },
          { id: "confirm", label: "Confirm",  description: "Review" },
        ]}
        activeStep={active}
      />
      <Button onClick={() => setActive(s => Math.min(2, s + 1))}>Next</Button>
    </>
  );
}`,
        preview: <StepperPreview />,
      },
      {
        title: "Vertical stepper",
        description: "Stepper laid out vertically with descriptions.",
        code: `<Stepper
  orientation="vertical"
  activeStep={1}
  steps={[
    { id: "a", label: "Plan",    description: "Choose your plan" },
    { id: "b", label: "Payment", description: "Enter billing info" },
    { id: "c", label: "Review",  description: "Confirm your order" },
  ]}
/>`,
        preview: (
          <Stepper
            orientation="vertical"
            activeStep={1}
            steps={[
              { id: "a", label: "Plan", description: "Choose your plan" },
              { id: "b", label: "Payment", description: "Enter billing info" },
              { id: "c", label: "Review", description: "Confirm your order" },
            ]}
          />
        ),
      },
    ],
  },

  table: {
    name: "Table",
    slug: "table",
    category: "Display",
    description: "A styled data table with CSS grid layout, sortable columns, row hover highlighting, striped rows, three density presets, and an empty state. No external table library needed.",
    usage: `import { Table } from "@/components/Table";

export default function Example() {
  return (
    <Table
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "role", label: "Role" },
      ]}
      data={[
        { name: "Alice", role: "Admin" },
        { name: "Bob",   role: "Editor" },
      ]}
    />
  );
}`,
    props: [
      { name: "columns", type: "TableColumn[]", required: true, description: "Array of { key, label, width?, sortable?, render? } column definitions." },
      { name: "data", type: "Record<string, unknown>[]", required: true, description: "Row data array. Keys must match column keys." },
      { name: "onRowClick", type: "(row) => void", default: "undefined", description: "If provided, rows are clickable with hover highlight." },
      { name: "emptyText", type: "string", default: '"No data"', description: "Text shown when data array is empty." },
      { name: "striped", type: "boolean", default: "false", description: "Apply zebra striping to even rows." },
      { name: "density", type: '"compact" | "normal" | "relaxed"', default: '"normal"', description: "Row padding density preset." },
      { name: "stickyHeader", type: "boolean", default: "false", description: "Make the header sticky when the table scrolls." },
    ],
    examples: [
      {
        title: "Sortable team table",
        description: "Table with sortable columns and row click.",
        code: `<Table
  columns={[
    { key: "name",  label: "Name",   sortable: true },
    { key: "role",  label: "Role"                   },
    { key: "email", label: "Email"                  },
  ]}
  data={[
    { name: "Alice", role: "Admin",  email: "alice@example.com" },
    { name: "Bob",   role: "Editor", email: "bob@example.com"   },
    { name: "Carol", role: "Viewer", email: "carol@example.com" },
  ]}
  onRowClick={row => console.log(row)}
/>`,
        preview: (
          <Table
            columns={[
              { key: "name", label: "Name", sortable: true },
              { key: "role", label: "Role" },
              { key: "email", label: "Email" },
            ]}
            data={[
              { name: "Alice", role: "Admin", email: "alice@example.com" },
              { name: "Bob", role: "Editor", email: "bob@example.com" },
              { name: "Carol", role: "Viewer", email: "carol@example.com" },
            ]}
            onRowClick={row => console.log(row)}
          />
        ),
      },
      {
        title: "Striped compact table",
        description: "Table with striped rows and compact density.",
        code: `<Table
  striped
  density="compact"
  columns={[
    { key: "date",   label: "Date"   },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ]}
  data={[
    { date: "Jan 1",  amount: "$120", status: "Paid"    },
    { date: "Jan 15", amount: "$85",  status: "Pending" },
    { date: "Feb 1",  amount: "$200", status: "Paid"    },
  ]}
/>`,
        preview: (
          <Table
            striped
            density="compact"
            columns={[
              { key: "date", label: "Date" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
            ]}
            data={[
              { date: "Jan 1", amount: "$120", status: "Paid" },
              { date: "Jan 15", amount: "$85", status: "Pending" },
              { date: "Feb 1", amount: "$200", status: "Paid" },
            ]}
          />
        ),
      },
    ],
  },

  tabs: {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    description: "A tabbed interface with a pill-style tab strip and keyboard navigation. Uses a render-prop children pattern so panel content is fully controlled by the caller.",
    usage: `import { Tabs } from "@/components/Tabs";

export default function Example() {
  return (
    <Tabs
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "details",  label: "Details"  },
      ]}
    >
      {(active) => (
        active === "overview"
          ? <p>Overview content</p>
          : <p>Details content</p>
      )}
    </Tabs>
  );
}`,
    props: [
      { name: "tabs", type: "Tab[]", required: true, description: "Array of { id, label, icon?, badge?, disabled? } tab definitions." },
      { name: "children", type: "(activeId: string) => ReactNode", required: true, description: "Render prop receiving the active tab id." },
      { name: "defaultId", type: "string", default: "tabs[0].id", description: "Id of the tab open on first render." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for the active tab background and border." },
      { name: "onChange", type: "(id: string) => void", default: "undefined", description: "Called when the active tab changes." },
    ],
    examples: [
      {
        title: "Basic tabs",
        description: "Three-tab interface with render-prop content.",
        code: `<Tabs
  tabs={[
    { id: "overview", label: "Overview" },
    { id: "details",  label: "Details"  },
    { id: "activity", label: "Activity" },
  ]}
>
  {(active) => <p style={{ color: "var(--text-sub)" }}>{active} panel</p>}
</Tabs>`,
        preview: (
          <Tabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "details", label: "Details" },
              { id: "activity", label: "Activity" },
            ]}
          >
            {(active) => <p style={{ color: "var(--text-sub)", fontSize: "14px" }}>{active.charAt(0).toUpperCase() + active.slice(1)} panel content.</p>}
          </Tabs>
        ),
      },
      {
        title: "Tabs with badges",
        description: "Tabs showing numeric badge counts.",
        code: `<Tabs
  tabs={[
    { id: "inbox",  label: "Inbox",   badge: 12 },
    { id: "sent",   label: "Sent"               },
    { id: "drafts", label: "Drafts",  badge: 3  },
  ]}
>
  {(active) => <p>{active}</p>}
</Tabs>`,
        preview: (
          <Tabs
            tabs={[
              { id: "inbox", label: "Inbox", badge: 12 },
              { id: "sent", label: "Sent" },
              { id: "drafts", label: "Drafts", badge: 3 },
            ]}
          >
            {(active) => <p style={{ color: "var(--text-sub)", fontSize: "14px" }}>{active} panel.</p>}
          </Tabs>
        ),
      },
    ],
  },

  taginput: {
    name: "TagInput",
    slug: "taginput",
    category: "Input",
    description: "An input that converts entries into removable tag chips. Press Enter or comma to add a tag, Backspace to remove the last. Supports a max tag limit and hex color accent.",
    usage: `import { TagInput } from "@/components/TagInput";
import { useState } from "react";

export default function Example() {
  const [tags, setTags] = useState(["react", "typescript"]);
  return <TagInput tags={tags} onChange={setTags} label="Skills" max={6} />;
}`,
    props: [
      { name: "tags", type: "string[]", required: true, description: "Controlled array of tag strings." },
      { name: "onChange", type: "(tags: string[]) => void", required: true, description: "Called with the updated tags array." },
      { name: "placeholder", type: "string", default: '"Add tag…"', description: "Input placeholder shown when there are no tags." },
      { name: "label", type: "string", default: "undefined", description: "Label above the tag input." },
      { name: "max", type: "number", default: "undefined", description: "Maximum number of tags allowed." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent for tag background, border, and focus ring." },
    ],
    examples: [
      {
        title: "Skills tag input",
        description: "Tag input with max limit and color.",
        code: `function Example() {
  const [tags, setTags] = useState(["react", "typescript"]);
  return <TagInput tags={tags} onChange={setTags} label="Skills" max={6} />;
}`,
        preview: <TagInputPreview />,
      },
      {
        title: "Custom color",
        description: "Tag input with green accent.",
        code: `function Example() {
  const [tags, setTags] = useState(["feature", "v2.0"]);
  return <TagInput tags={tags} onChange={setTags} label="Labels" color="#4ade80" />;
}`,
        preview: <TagInputGreenPreview />,
      },
    ],
  },

  timeline: {
    name: "Timeline",
    slug: "timeline",
    category: "Display",
    description: "A vertical timeline for displaying chronological events with dots, connecting lines, timestamps, and per-item color overrides. The first item uses the global accent color.",
    usage: `import { Timeline } from "@/components/Timeline";

export default function Example() {
  return (
    <Timeline items={[
      { id: "a", title: "v1.0.0 released",       time: "Jan 2025" },
      { id: "b", title: "100k downloads",         time: "Mar 2025" },
      { id: "c", title: "Component library open-sourced", time: "Apr 2025" },
    ]} />
  );
}`,
    props: [
      { name: "items", type: "TimelineItem[]", required: true, description: "Array of { id, title, description?, time?, icon?, color? } objects." },
      { name: "color", type: "string", default: '"#876cff"', description: "Default hex accent for the first item's dot." },
    ],
    examples: [
      {
        title: "Version history",
        description: "Timeline showing a release history.",
        code: `<Timeline items={[
  { id: "a", title: "v2.0.0 — Major redesign",       description: "Full visual overhaul.",      time: "Apr 2025" },
  { id: "b", title: "v1.5.0 — New components",       description: "Added 12 new components.",   time: "Feb 2025" },
  { id: "c", title: "v1.0.0 — Initial release",      description: "Public launch.",             time: "Jan 2025" },
]} />`,
        preview: (
          <Timeline items={[
            { id: "a", title: "v2.0.0 — Major redesign", description: "Full visual overhaul.", time: "Apr 2025" },
            { id: "b", title: "v1.5.0 — New components", description: "Added 12 new components.", time: "Feb 2025" },
            { id: "c", title: "v1.0.0 — Initial release", description: "Public launch.", time: "Jan 2025" },
          ]} />
        ),
      },
      {
        title: "With per-item colors",
        description: "Timeline with custom dot colors per item.",
        code: `<Timeline items={[
  { id: "a", title: "Deployed to production", time: "10:00", color: "#4ade80" },
  { id: "b", title: "Build succeeded",        time: "9:58",  color: "#60a5fa" },
  { id: "c", title: "Tests passed",           time: "9:55",  color: "#876cff" },
]} />`,
        preview: (
          <Timeline items={[
            { id: "a", title: "Deployed to production", time: "10:00", color: "#4ade80" },
            { id: "b", title: "Build succeeded", time: "9:58", color: "#60a5fa" },
            { id: "c", title: "Tests passed", time: "9:55", color: "#876cff" },
          ]} />
        ),
      },
    ],
  },

  toast: {
    name: "Toast",
    slug: "toast",
    category: "Feedback",
    description: "Auto-dismissing notification toasts triggered imperatively via the toast() API. Place <Toaster /> once in your layout. Supports success, error, warning, info, and default variants.",
    usage: `import { toast, Toaster } from "@/components/Toast";

// In your layout:
<Toaster />

// Anywhere in your app:
toast.success("Saved!", { description: "Changes have been written." });
toast.error("Failed", { description: "Please try again." });
toast("Default message");`,
    props: [
      { name: "title", type: "string", required: true, description: "Toast title text (passed to toast() calls)." },
      { name: "description", type: "string", default: "undefined", description: "Secondary body text." },
      { name: "duration", type: "number", default: "4200", description: "Auto-dismiss delay in milliseconds." },
      { name: "color", type: "string", default: "undefined", description: "Hex override for the accent color of this toast." },
      { name: "action", type: "{ label: string; onClick: () => void }", default: "undefined", description: "Optional action button rendered in the toast." },
    ],
    examples: [
      {
        title: "All toast variants",
        description: "Trigger success, error, warning, and info toasts.",
        code: `<Toaster />
<Button onClick={() => toast.success("Saved!")}>Success</Button>
<Button onClick={() => toast.error("Failed")}>Error</Button>
<Button onClick={() => toast.warning("Low storage")}>Warning</Button>
<Button onClick={() => toast.info("Update available")}>Info</Button>`,
        preview: <ToastPreview />,
      },
      {
        title: "Toast with action",
        description: "Toast with an inline action button.",
        code: `toast.success("File uploaded", {
  description: "report.pdf is ready.",
  action: { label: "View", onClick: () => {} },
});`,
        preview: <ToastWithActionPreview />,
      },
    ],
  },

  toggle: {
    name: "Toggle",
    slug: "toggle",
    category: "Input",
    description: "A smooth on/off switch. Also exports Checkbox (square with check animation) and Radio (circle with dot animation) — all share the same hex color system.",
    usage: `import { Toggle, Checkbox, Radio } from "@/components/Toggle";
import { useState } from "react";

export default function Example() {
  const [on, setOn] = useState(false);
  return <Toggle checked={on} onChange={setOn} label="Dark mode" />;
}`,
    props: [
      { name: "checked", type: "boolean", required: true, description: "Controlled on/off state." },
      { name: "onChange", type: "(v: boolean) => void", required: true, description: "Called with the new boolean value on toggle." },
      { name: "label", type: "string", default: "undefined", description: "Label rendered next to the toggle." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables interaction." },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "Toggle size (18px / 24px track height)." },
      { name: "color", type: "string", default: '"#876cff"', description: "Hex accent color for the on state." },
    ],
    examples: [
      {
        title: "Toggle, Checkbox, Radio",
        description: "All three form control components.",
        code: `function Example() {
  const [on, setOn] = useState(false);
  const [cb, setCb] = useState(false);
  const [rb, setRb] = useState("a");
  return (
    <>
      <Toggle checked={on} onChange={setOn} label="Enable feature" />
      <Checkbox checked={cb} onChange={setCb} label="I agree" />
      <Radio checked={rb === "a"} onChange={() => setRb("a")} label="Option A" />
      <Radio checked={rb === "b"} onChange={() => setRb("b")} label="Option B" />
    </>
  );
}`,
        preview: <TogglePreview />,
      },
      {
        title: "Checkbox group",
        description: "Multiple checkboxes with state.",
        code: `function Example() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <>
      <Checkbox checked={a} onChange={setA} label="Terms of service" />
      <Checkbox checked={b} onChange={setB} label="Marketing emails" />
    </>
  );
}`,
        preview: <CheckboxPreview />,
      },
    ],
  },

  tooltip: {
    name: "Tooltip",
    slug: "tooltip",
    category: "Overlay",
    description: "A small floating label that appears on hover or focus. Renders via portal with position auto-measurement. Supports four placements and a configurable show delay.",
    usage: `import { Tooltip } from "@/components/Tooltip";

export default function Example() {
  return (
    <Tooltip content="This is a tooltip" placement="top">
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  );
}`,
    props: [
      { name: "content", type: "ReactNode", required: true, description: "Tooltip text or element." },
      { name: "children", type: "ReactNode", required: true, description: "The element that triggers the tooltip on hover/focus." },
      { name: "placement", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Preferred placement relative to the trigger." },
      { name: "delay", type: "number", default: "0", description: "Show delay in milliseconds." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents the tooltip from showing." },
    ],
    examples: [
      {
        title: "Tooltip placements",
        description: "Tooltips in all four placements.",
        code: `<Tooltip content="Top tooltip"    placement="top">    <Button size="sm">Top</Button>    </Tooltip>
<Tooltip content="Bottom tooltip" placement="bottom"> <Button size="sm">Bottom</Button> </Tooltip>
<Tooltip content="Left tooltip"   placement="left">   <Button size="sm">Left</Button>   </Tooltip>
<Tooltip content="Right tooltip"  placement="right">  <Button size="sm">Right</Button>  </Tooltip>`,
        preview: (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Tooltip content="Top tooltip" placement="top"><Button size="sm" variant="secondary">Top</Button></Tooltip>
            <Tooltip content="Bottom tooltip" placement="bottom"><Button size="sm" variant="secondary">Bottom</Button></Tooltip>
            <Tooltip content="Left tooltip" placement="left"><Button size="sm" variant="secondary">Left</Button></Tooltip>
            <Tooltip content="Right tooltip" placement="right"><Button size="sm" variant="secondary">Right</Button></Tooltip>
          </div>
        ),
      },
      {
        title: "With delay",
        description: "Tooltip that appears after a 400ms delay.",
        code: `<Tooltip content="Appears after 400ms" delay={400}>
  <Button variant="ghost">Hover (delayed)</Button>
</Tooltip>`,
        preview: (
          <Tooltip content="Appears after 400ms" delay={400}>
            <Button variant="ghost">Hover (delayed)</Button>
          </Tooltip>
        ),
      },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return REGISTRY[slug];
}

export function getAllComponents(): ComponentDoc[] {
  return Object.values(REGISTRY);
}

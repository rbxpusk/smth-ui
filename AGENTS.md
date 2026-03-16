# smth-ui — Agent & Backend Integration Guide

This file tells AI coding agents, LLMs, and automated systems how to work with
this component library correctly. All components are React 18+ client components
with no external runtime dependencies (only `react` / `react-dom` peer deps).

---

## Quick reference

```ts
import { Button, Badge, StatCard, Avatar, AvatarGroup, Progress,
         Toggle, Tabs, Alert, Tooltip, Table, Card, Input, Textarea,
         Modal, Notifications, DropdownMenu, Drawer, Popover, Select, Accordion,
         Breadcrumb, Kbd, Skeleton, Spinner, Divider, EmptyState,
         Pagination, TagInput, NumberInput, DigitCounter, CodeDisplay,
         Banner, ColorPicker, Combobox, Sheet, Slider, Stepper, Timeline,
         toast, Toaster, ToastProvider, useToast } from "@puskevi/smth-ui";
```

All components are named exports. There is no default export.

---

## Theming

Every component reads from CSS custom properties injected at `:root`.
Override them in your global CSS to theme the entire library at once.

```css
:root {
  /* Surfaces */
  --bg:          #000000;
  --surface:     #111111;
  --surface-lo:  #0a0a0a;
  --surface-hi:  #1c1c1c;

  /* Text */
  --text:        #ffffff;
  --text-sub:    #888888;
  --text-muted:  #444444;

  /* Borders */
  --border:      rgba(255,255,255,0.09);
  --border-hi:   rgba(255,255,255,0.15);

  /* Radii */
  --radius:      10px;
  --radius-sm:   6px;
  --radius-lg:   14px;
}
```

Individual components also accept a `color` prop (hex string) that sets their
accent color. Luminance is auto-detected — text will flip to dark on light
backgrounds so you never get white-on-white.

---

## Component API contracts

### Button

```ts
<Button
  variant?="primary" | "outline" | "ghost" | "danger"
  size?="sm" | "md" | "lg"
  color?={string}        // hex accent — defaults to purple
  loading?={boolean}
  disabled?={boolean}
  onClick?={handler}
>
  Label
</Button>
```

### Input / Textarea

```ts
<Input
  label?={string}
  hint?={string}
  error?={string}        // shows red state + error message
  iconLeft?={ReactNode}
  iconRight?={ReactNode}
  fullWidth?={boolean}
  color?={string}        // hex accent for focus ring
  // ...all standard HTMLInputElement props (value, onChange, placeholder, etc.)
/>
```

### Select

```ts
type SelectOption = { value: string; label: string; disabled?: boolean };

<Select
  options={SelectOption[]}
  value={string}
  onChange={(value: string) => void}
  label?={string}
  placeholder?={string}
  color?={string}
/>
```

### Table

The `render` function receives `(value: unknown, row: T)` where T extends
`Record<string, unknown>`. Cast `row` to your data type inside `render`.

```ts
type TableColumn<T = Record<string, unknown>> = {
  key:     string;
  label:   string;
  width?:  string;       // CSS grid column width, e.g. "140px" or "1fr"
  render?: (value: unknown, row: T) => ReactNode;
};

<Table<MyRowType>
  columns={TableColumn<MyRowType>[]}
  data={MyRowType[]}
/>
```

For action columns: use `key: "_actions"`, `width: "44px"`, and put a
`DropdownMenu` or icon button in `render`.

### DropdownMenu

```ts
type MenuItem = {
  id:        string;
  label:     ReactNode;
  icon?:     ReactNode;
  shortcut?: string;     // displayed as faint text on the right
  danger?:   boolean;    // renders red
  disabled?: boolean;
  divider?:  boolean;    // adds a hairline separator BEFORE this item
};

<DropdownMenu
  trigger={ReactNode}    // anything — button, avatar, text
  items={MenuItem[]}
  onSelect={(id: string) => void}
  align?="left" | "right"
/>
```

### Modal

```ts
<Modal
  open={boolean}
  onClose={() => void}
  title?={string}
  subtitle?={string}
  icon?={ReactNode}      // renders a centered icon header with ambient glow
  iconColor?={string}    // hex — controls icon bg + glow color
  size?="sm" | "md" | "lg"
  footer?={ReactNode}    // rendered in a bottom bar; put action buttons here
>
  {/* body content */}
</Modal>
```

Closes on Escape key and backdrop click automatically.

### Notifications

```ts
import { Notifications, type NotificationItem } from "@puskevi/smth-ui";

const items: NotificationItem[] = [
  {
    id:      string;          // unique key
    title:   string;
    body?:   string;
    time:    string;          // display string e.g. "5m ago"
    read?:   boolean;         // defaults to false (unread)
    type?:   "info" | "success" | "warning" | "error";
    avatar?: string;          // name → Avatar initials (overrides type icon)
    icon?:   ReactNode;       // custom icon (overrides type icon)
  }
];

<Notifications
  items={items}
  onRead?={(id: string) => void}      // called when unread row is clicked
  onReadAll?={() => void}              // shows "Mark all read" button in header
  onDismiss?={(id: string) => void}   // X button per row
  color?={string}                     // unread dot color on bell (default "#876cff")
  align?="left" | "right"            // panel alignment (default "right")
  trigger?={ReactNode}                // custom trigger (default: bell icon button)
  maxHeight?={number}                 // scrollable list max-height px (default 380)
  emptyText?={string}                 // empty state message
/>
```

Portal-rendered panel with smart up/down flip. Closes on outside click, Escape, and page scroll (not internal scroll).

### Alert

```ts
<Alert
  variant?="success" | "error" | "warning" | "info" | "neutral"
  title={string}
  message?={string}
  icon?={ReactNode}
  dismissible?={boolean}
  onDismiss?={() => void}
  color?={string}        // overrides variant color with custom hex
/>
```

The component manages its own dismissed state internally. If you need to control
visibility from outside, wrap it: `{show && <Alert ... />}`.

### Toast

```ts
// Simple call anywhere (no provider needed — Toaster handles it)
toast.success("Done!", { description: "Optional subtitle" });
toast.error("Failed");
toast.info("FYI");
toast.warning("Watch out");

// Must render once in your app root:
<Toaster />
```

### Progress

```ts
<Progress
  value={number}         // 0–100
  color?={string}        // hex
  size?="sm" | "md" | "lg"
  animated?={boolean}
  showLabel?={boolean}
/>
```

### Toggle / Checkbox / Radio

```ts
<Toggle
  checked={boolean}
  onChange={(checked: boolean) => void}
  color?={string}
  size?="sm" | "md"
  disabled?={boolean}
/>
```

### Tabs

```ts
type Tab = { id: string; label: string; icon?: ReactNode; badge?: string | number };

<Tabs
  tabs={Tab[]}
  defaultId?={string}
  color?={string}
>
  {(activeId: string) => ReactNode}   // render-prop pattern
</Tabs>
```

### Accordion

```ts
type AccordionItem = { id: string; label: ReactNode; children: ReactNode };

<Accordion
  items={AccordionItem[]}
  multiple?={boolean}    // allow multiple open simultaneously
  defaultOpen?={string[]}
/>
```

### Badge

```ts
<Badge
  color?={string}        // hex — luminance-aware text flip
  size?="sm" | "md" | "lg"
  variant?="solid" | "outline" | "subtle"
>
  {children}
</Badge>
```

### Avatar / AvatarGroup

```ts
<Avatar
  name={string}          // initials auto-generated from name
  src?={string}          // image URL — falls back to initials
  size?="xs" | "sm" | "md" | "lg" | "xl"
  color?={string}        // hex background
/>

<AvatarGroup
  names={string[]}
  max?={number}          // truncates and shows "+N" overflow
  size?="xs" | "sm" | "md" | "lg" | "xl"
/>
```

### StatCard

```ts
<StatCard
  label={string}
  value={string}
  sub?={string}
  trend?={{ value: string; positive: boolean }}
  color?={string}
/>
```

### Skeleton

```ts
<Skeleton
  width?={string | number}
  height?={string | number}
  radius?={string}
  lines?={number}        // renders N stacked skeleton lines
/>
```

Use Skeleton as loading placeholder for any async data. It respects the same
CSS vars as the rest of the library.

### EmptyState

```ts
<EmptyState
  icon?={ReactNode}
  title={string}
  description?={string}
  action?={ReactNode}    // e.g. a Button
/>
```

### Breadcrumb

```ts
type BreadcrumbItem = { label: string; href?: string };

<Breadcrumb items={BreadcrumbItem[]} />
```

### Kbd

```ts
<Kbd keys={string[]} />
// e.g. <Kbd keys={["⌘", "K"]} />  →  renders ⌘ + K key pills
```

### Pagination

```ts
<Pagination
  page={number}
  total={number}         // total number of pages
  onChange={(page: number) => void}
  color?={string}
/>
```

### Spinner

```ts
<Spinner size?="sm" | "md" | "lg" color?={string} />
```

### Divider

```ts
<Divider label?={string} />   // optional centered label text
```

### TagInput

```ts
<TagInput
  tags={string[]}
  onChange={(tags: string[]) => void}
  placeholder?={string}
  color?={string}
/>
```

### NumberInput

```ts
<NumberInput
  value={number}
  onChange={(value: number) => void}
  min?={number}
  max?={number}
  step?={number}
  label?={string}
  color?={string}
/>
```

### DigitCounter

```ts
<DigitCounter value={number} color?={string} />
// Animated slot-machine style number display
```

### CodeDisplay

```ts
<CodeDisplay code={string} language?={string} />
// Syntax-highlighted code block with copy button
```

### Banner

```ts
<Banner
  variant?="info" | "success" | "warning" | "error"
  dismissible?={boolean}
  onDismiss?={() => void}
  icon?={ReactNode}
  action?={ReactNode}
  color?={string}        // hex — overrides variant color
>
  {children}             // inline text content
</Banner>
```

### ColorPicker

```ts
<ColorPicker
  value={string}         // hex color
  onChange={(color: string) => void}
  label?={string}
  presets?={string[]}    // array of hex colors for swatch grid
  showInput?={boolean}   // show hex text input (default true)
/>
```

### Combobox

```ts
type ComboboxOption = { value: string; label: string; disabled?: boolean };

<Combobox
  options={ComboboxOption[]}
  value?={string}
  onChange?={(value: string) => void}
  placeholder?={string}
  label?={string}
  hint?={string}
  error?={string}
  color?={string}
  emptyText?={string}    // shown when no results match (default "No results")
/>
```

### Sheet

```ts
<Sheet
  open={boolean}
  onClose={() => void}
  title?={string}
  height?="sm" | "md" | "lg" | "full"
  footer?={ReactNode}
>
  {children}
</Sheet>
```

Bottom sheet overlay. Closes on Escape and backdrop click. Has focus trap and scroll lock.

### Slider

```ts
<Slider
  value={number}
  onChange={(value: number) => void}
  min?={number}          // default 0
  max?={number}          // default 100
  step?={number}         // default 1
  label?={string}
  showValue?={boolean}
  disabled?={boolean}
  color?={string}
/>
```

### Stepper

```ts
type StepperStep = { id: string; label: string; description?: string };

<Stepper
  steps={StepperStep[]}
  activeStep={number}    // 0-based index
  color?={string}
  orientation?="horizontal" | "vertical"
/>
```

### Timeline

```ts
type TimelineItem = {
  id:           string;
  title:        string;
  description?: string;
  time?:        string;
  icon?:        ReactNode;
  color?:       string;    // per-item accent
};

<Timeline
  items={TimelineItem[]}
  color?={string}          // global accent (default purple)
/>
```

### Card

```ts
<Card
  variant?="default" | "elevated" | "flat" | "outlined" | "danger" | "success"
  padding?={string}
  radius?={string}
  noise?={boolean}       // subtle noise texture overlay (default true)
  specular?={boolean}    // top-edge highlight (default true)
  accentTop?={string}    // CSS gradient for a 2px colored top stripe
  borderColor?={string}
  glowColor?={string}
  onClick?={() => void}  // makes card interactive with hover lift
>
  {children}
</Card>
```

### Drawer

```ts
<Drawer
  open={boolean}
  onClose={() => void}
  title?={string}
  side?="left" | "right"
  size?="sm" | "md" | "lg"
>
  {children}
</Drawer>
```

### Popover

```ts
<Popover
  trigger={ReactNode}
  content={ReactNode}
  placement?="top" | "bottom" | "left" | "right"
/>
```

### Tooltip

```ts
<Tooltip content={string} placement?="top" | "bottom" | "left" | "right">
  {children}
</Tooltip>
```

---

## Next.js setup

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@puskevi/smth-ui"],
};
export default nextConfig;
```

```tsx
// app/layout.tsx
import { Toaster } from "@puskevi/smth-ui";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

All components are `"use client"` — they work in both App Router and Pages Router
without any extra config beyond the above.

---

## Backend integration patterns

### Loading states

Replace any data-driven section with `<Skeleton>` while fetching:

```tsx
{isLoading ? (
  <Skeleton lines={4} height={14} radius="6px" />
) : (
  <Table columns={cols} data={rows} />
)}
```

### Empty states

Use `<EmptyState>` when a fetch returns zero results:

```tsx
{data.length === 0 && (
  <EmptyState
    title="No projects yet"
    description="Create your first project to get started."
    action={<Button color="#fff" size="sm">New project</Button>}
  />
)}
```

### Error feedback

Use `toast.error(...)` for non-blocking errors and `<Alert variant="error" ...>`
for persistent inline errors:

```tsx
try {
  await createProject(payload);
  toast.success("Project created!");
} catch (err) {
  toast.error("Something went wrong", { description: err.message });
}
```

### Forms

`Input`, `Select`, `TagInput`, `NumberInput`, `Textarea`, and `Toggle` are all
controlled components. Wire them to your state management layer directly:

```tsx
const [form, setForm] = useState({ name: "", team: "" });

<Input
  value={form.name}
  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
  error={errors.name}
  label="Project name"
  color="#fff"
  fullWidth
/>
```

### Pagination

```tsx
const [page, setPage] = useState(1);
const { data, total } = useFetch(`/api/projects?page=${page}`);

<Pagination page={page} total={Math.ceil(total / PAGE_SIZE)} onChange={setPage} />
```

### Async action in DropdownMenu

```tsx
onSelect={async (id) => {
  if (id === "delete") {
    await deleteProject(row.id);
    toast.success("Archived");
    refetch();
  }
}}
```

---

## Accessibility notes

- All interactive components (Button, Toggle, DropdownMenu, Modal, Tabs) have
  proper `cursor: pointer` and keyboard support where applicable.
- Modal closes on `Escape` and backdrop click.
- DropdownMenu closes on `Escape` and outside click.
- Components do NOT inject `aria-*` attributes automatically — add them in the
  `trigger` or wrapper element when needed for your use case.

---

## What NOT to do

- Do not use `import ... from "@puskevi/smth-ui/Button"` — all exports are
  from the root `"@puskevi/smth-ui"` package.
- Do not wrap components in extra `"use client"` boundaries — they already
  declare it internally.
- Do not pass `className` to components — they use inline styles only.
  Style overrides go via CSS vars or the `style` prop where supported.
- Do not nest `<Toaster />` more than once — one instance in the app root
  is sufficient.

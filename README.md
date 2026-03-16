# @puskevi/smth-ui

Cool frontend components for starters or vibe coders that suck at ui.

38 dark-themed React components with inline styles and CSS custom properties. No Tailwind, no runtime deps — just React.

## Install

```bash
npm install @puskevi/smth-ui
```

## Usage

```tsx
import { Button, Card, toast, Toaster } from "@puskevi/smth-ui";

// Put once in your layout
<Toaster />

// Use anywhere
<Button color="#876cff">Click me</Button>
toast.success("Done!");
```

## Theming

All components read CSS custom properties. Override them on any wrapper:

```css
.my-section {
  --surface:    #111111;
  --surface-hi: #1c1c1c;
  --surface-lo: #0a0a0a;
  --text:       #e8e8e8;
  --text-sub:   #888;
  --text-muted: #444;
  --radius:     12px;
  --radius-sm:  7px;
  --radius-lg:  17px;
  --bg:         #000;
}
```

Pass `color` to override the accent on any component:

```tsx
<Button color="#f43f5e">Danger-ish</Button>
<Tabs color="#0ea5e9" tabs={...}>{...}</Tabs>
<Notifications color="#4ade80" items={notifs} />
```

## Components

Accordion, Alert, Avatar, AvatarGroup, Badge, Banner, Breadcrumb, Button, Card, CodeDisplay, ColorPicker, Combobox, DigitCounter, Divider, Drawer, DropdownMenu, EmptyState, Input, Textarea, Kbd, Modal, Notifications, NumberInput, Pagination, Popover, Progress, Select, Sheet, Skeleton, Slider, Spinner, StatCard, Stepper, Table, Tabs, TagInput, Timeline, Toast, Toggle, Checkbox, Radio, Tooltip

## AI / Agent Integration

An `AGENTS.md` file ships with the package with full component API references and AI-friendly usage patterns.

```bash
cat node_modules/@puskevi/smth-ui/AGENTS.md
```

## Requirements

React 18+

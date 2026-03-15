# @puskevi/smth-ui

Cool frontend components for starters or vibe coders that suck at ui.

30 dark-themed React components with inline styles and CSS custom properties. No Tailwind, no runtime deps — just React.

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
  --surface:    #1c1a28;
  --surface-lo: #131122;
  --text:       #f0eeff;
  --text-sub:   #7a7596;
  --text-muted: #4a4660;
  --radius:     12px;
  --radius-sm:  7px;
  --radius-lg:  17px;
}
```

Pass `color` to override the accent on any component:

```tsx
<Button color="#f43f5e">Danger-ish</Button>
<Tabs color="#0ea5e9" tabs={...}>{...}</Tabs>
<Pagination color="#22c55e" ... />
```

## Components

Accordion, Alert, Avatar, AvatarGroup, Badge, Breadcrumb, Button, Card, CodeDisplay, DigitCounter, Divider, Drawer, DropdownMenu, EmptyState, Input, Textarea, Kbd, Modal, NumberInput, Pagination, Popover, Progress, Select, Skeleton, Spinner, StatCard, Table, Tabs, TagInput, Toast, Toggle, Checkbox, Radio, Tooltip

## Requirements

React 18+

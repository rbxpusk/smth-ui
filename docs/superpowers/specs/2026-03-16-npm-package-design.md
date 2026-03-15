# @puskevit/smth-ui — npm Package Design

**Date:** 2026-03-16

## Overview

Publish the existing component library as `@puskevit/smth-ui` on npm. The library is a collection of 30 dark-themed React components built with inline styles and CSS custom properties. No Tailwind, no CSS-in-JS runtime — just React.

**Description:** "cool frontend components for starters or vibe coders that suck at ui"

## Structure

The repo stays a single Next.js project. A `lib/index.ts` barrel file re-exports all components. tsup compiles it to `dist/` which is what gets published.

```
urosh-ui/
├── app/               ← Next.js playground (dev/docs, unchanged)
├── components/        ← source components (unchanged)
├── lib/
│   └── index.ts       ← barrel re-exports all 30 components
├── dist/              ← tsup output (gitignored, published)
│   ├── index.js       ← ESM
│   ├── index.cjs      ← CJS
│   └── index.d.ts     ← TypeScript types
├── tsup.config.ts     ← build config
└── package.json       ← updated for publishing
```

## package.json

```json
{
  "name": "@puskevit/smth-ui",
  "version": "0.1.0",
  "description": "cool frontend components for starters or vibe coders that suck at ui",
  "license": "MIT",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "scripts": {
    "dev": "next dev",
    "build:lib": "tsup",
    "build": "next build",
    "prepublishOnly": "tsup"
  }
}
```

## tsup.config.ts

```ts
export default {
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  clean: true,
  external: ["react", "react-dom"],
};
```

## lib/index.ts

Barrel file re-exporting all named exports from every component file:

- All components export named exports (e.g. `Button`, `Badge`, `Card`, etc.)
- Toast exports both `toast` (function) and `Toaster` (component)
- Toggle exports `Toggle`, `Checkbox`, `Radio`
- Avatar exports `Avatar`, `AvatarGroup`
- Input exports `Input`, `Textarea`

## Cleanup

- Remove "urosh" from all user-facing strings (export CSS comment in playground, package name)
- Remove `"private": true` from package.json
- Add `dist/` to `.gitignore`

## Consumer Usage

```bash
npm install @puskevit/smth-ui
```

```tsx
import { Button, Card, toast, Toaster } from "@puskevit/smth-ui";

// In layout:
<Toaster />

// Anywhere:
toast.success("Done!");
<Button color="#876cff">Click me</Button>
```

## What Does NOT Change

- The `components/` source files are unchanged
- The Next.js playground (`app/`) is unchanged
- No Tailwind at runtime — consumers need zero config
- `"use client"` directives are preserved (tsup passes them through)

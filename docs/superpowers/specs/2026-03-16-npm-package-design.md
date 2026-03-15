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
  "keywords": ["react", "components", "ui", "dark-theme", "typescript"],
  "homepage": "https://github.com/puskevit/smth-ui",
  "repository": {
    "type": "git",
    "url": "https://github.com/puskevit/smth-ui"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
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
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

## tsup.config.ts

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  clean: true,
  external: ["react", "react-dom"],
  banner: { js: '"use client";' },
});
```

### Note on `"use client"`

All 30 components are client components (19 carry the directive explicitly; the remaining 11 are presentational and compatible). Since tsup bundles everything into a single output file, esbuild does not reliably propagate per-file `"use client"` directives. The `banner` option emits `"use client";` at the top of both ESM and CJS output files, which is the standard approach used by Radix UI, shadcn, and similar libraries.

## lib/index.ts

Barrel file re-exporting all named exports from every component file. Key multi-export files:

- `Toast` → exports `toast` (function) and `Toaster` (component)
- `Toggle` → exports `Toggle`, `Checkbox`, `Radio`
- `Avatar` → exports `Avatar`, `AvatarGroup`
- `Input` → exports `Input`, `Textarea`
- `Table` → exports `Table` and `TableColumn` (type)

Path alias note: `lib/index.ts` uses relative imports (`"../components/Button"` etc.), not the Next.js `@/` alias, so no tsup path alias config is needed.

## Cleanup

- Remove `"private": true` from package.json
- Strip all references to "urosh" from user-facing strings (playground export CSS comment, any metadata)
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

# @puskevit/smth-ui

**Date:** 2026-03-16

Cool frontend components for starters or vibe coders that suck at ui.

30 dark-themed React components, inline styles, CSS custom properties. No Tailwind, no runtime dependencies — just React.

---

## Package

```json
{
  "name": "@puskevit/smth-ui",
  "version": "0.1.0",
  "description": "cool frontend components for starters or vibe coders that suck at ui",
  "license": "MIT",
  "keywords": ["react", "components", "ui", "dark-theme", "typescript"],
  "homepage": "https://github.com/puskevit/smth-ui",
  "repository": { "type": "git", "url": "https://github.com/puskevit/smth-ui" },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.js",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "scripts": {
    "dev": "next dev",
    "build:lib": "tsup",
    "build": "next build",
    "prepublishOnly": "tsup"
  },
  "devDependencies": { "tsup": "^8", "typescript": "^5" }
}
```

## Build

tsup bundles `lib/index.ts` → `dist/`. The `banner` adds `"use client"` to the output since esbuild doesn't reliably forward per-file directives when bundling.

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

## Barrel (`lib/index.ts`)

Re-exports everything from `components/`. Multi-export files: `Toast` (toast + Toaster), `Toggle` (Toggle, Checkbox, Radio), `Avatar` (Avatar, AvatarGroup), `Input` (Input, Textarea).

## Usage

```bash
npm install @puskevit/smth-ui
```

```tsx
import { Button, Card, toast, Toaster } from "@puskevit/smth-ui";
```

## Misc

- Remove `"private": true`
- Strip "urosh" from any user-facing strings
- Add `dist/` to `.gitignore`

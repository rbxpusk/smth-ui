# @puskevit/smth-ui npm Package Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the component library as `@puskevit/smth-ui` on npm with ESM + CJS output and full TypeScript types.

**Architecture:** Add tsup alongside the existing Next.js app. A `lib/index.ts` barrel re-exports all 30 components. tsup builds to `dist/`. The Next.js playground is untouched.

**Tech Stack:** tsup ^8, TypeScript 5, React 19 (peer dep)

---

## Chunk 1: Scaffold and build

### Task 1: Install tsup

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install tsup as a dev dependency**

```bash
npm install --save-dev tsup
```

Expected: `node_modules/tsup` present, `package.json` devDependencies updated.

- [ ] **Step 2: Verify tsup runs**

```bash
npx tsup --version
```

Expected: prints a version like `8.x.x`

---

### Task 2: Create tsup.config.ts

**Files:**
- Create: `tsup.config.ts`

- [ ] **Step 1: Create the config**

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

---

### Task 3: Create lib/index.ts barrel

**Files:**
- Create: `lib/index.ts`

- [ ] **Step 1: Create the barrel**

```ts
export { Accordion }                                           from "../components/Accordion";
export { Alert }                                               from "../components/Alert";
export { Avatar, AvatarGroup }                                 from "../components/Avatar";
export { Badge }                                               from "../components/Badge";
export { Breadcrumb }                                          from "../components/Breadcrumb";
export { Button }                                              from "../components/Button";
export { Card }                                                from "../components/Card";
export { CodeDisplay }                                         from "../components/CodeDisplay";
export { DigitCounter }                                        from "../components/DigitCounter";
export { Divider }                                             from "../components/Divider";
export { Drawer }                                              from "../components/Drawer";
export { DropdownMenu, MenuItem }                              from "../components/DropdownMenu";
export { EmptyState }                                          from "../components/EmptyState";
export { Input, Textarea }                                     from "../components/Input";
export { Kbd }                                                 from "../components/Kbd";
export { Modal }                                               from "../components/Modal";
export { NumberInput }                                         from "../components/NumberInput";
export { Pagination }                                          from "../components/Pagination";
export { Popover }                                             from "../components/Popover";
export { Progress }                                            from "../components/Progress";
export { Select, SelectOption }                                from "../components/Select";
export { Skeleton, SkeletonText, SkeletonCard, SkeletonRow, SkeletonAvatar } from "../components/Skeleton";
export { Spinner }                                             from "../components/Spinner";
export { StatCard }                                            from "../components/StatCard";
export { Table }                                               from "../components/Table";
export type { TableColumn }                                    from "../components/Table";
export { Tabs }                                                from "../components/Tabs";
export { TagInput }                                            from "../components/TagInput";
export { toast, Toaster, ToastProvider, useToast }             from "../components/Toast";
export type { ToastOptions }                                   from "../components/Toast";
export { Toggle, Checkbox, Radio }                             from "../components/Toggle";
export { Tooltip }                                             from "../components/Tooltip";
```

---

### Task 4: Update package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace package.json contents**

Note: `"private": true` must be absent from the result — npm refuses to publish private packages. The replacement below intentionally omits it. Also note: the `exports."types"` path is `./dist/index.d.ts` (the spec has a typo pointing to `.js` — `.d.ts` is correct).

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
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

---

### Task 5: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add dist/ to .gitignore**

Open `.gitignore` and add this line (create the file if it doesn't exist):

```
dist/
```

---

### Task 6: Strip "urosh" from user-facing strings

**Files:**
- Modify: `app/playground/page.tsx`

- [ ] **Step 1: Find all occurrences**

```bash
grep -rn "urosh" /home/puskevit/İndirilenler/urosh-ui/app /home/puskevit/İndirilenler/urosh-ui/components
```

- [ ] **Step 2: Replace the export CSS comment in playground**

Find in `app/playground/page.tsx`:
```ts
const exportCSS = `/* urosh ui — custom theme */
```

Replace with:
```ts
const exportCSS = `/* smth-ui — custom theme */
```

- [ ] **Step 3: Verify no remaining occurrences**

```bash
grep -rn "urosh" app/ components/
```

Expected: no output. If there are other hits not covered by Step 2, replace each one — replace "urosh ui" or "urosh-ui" with "smth-ui" and "urosh" alone with the appropriate context.

---

### Task 7: Build and verify

- [ ] **Step 1: Run the library build**

```bash
npm run build:lib
```

Expected output (approximately):
```
ESM dist/index.js
CJS dist/index.cjs
DTS dist/index.d.ts
```

No errors.

- [ ] **Step 2: Verify output files exist**

```bash
ls dist/
```

Expected: `index.js`, `index.cjs`, `index.d.ts`

- [ ] **Step 3: Verify "use client" banner is present**

```bash
head -1 dist/index.js && head -1 dist/index.cjs
```

Expected: both first lines are `"use client";`

- [ ] **Step 4: Spot-check types**

```bash
grep "export.*Button" dist/index.d.ts
```

Expected: a line like `export declare function Button(...)`

- [ ] **Step 5: Verify Next.js playground still builds**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 6: Commit**

```bash
git add lib/index.ts tsup.config.ts package.json package-lock.json .gitignore app/playground/page.tsx
git commit -m "feat: add tsup build, publish as @puskevit/smth-ui"
```

---

### Task 8: Publish

- [ ] **Step 1: Log in to npm and verify scope ownership**

```bash
npm whoami
```

If not logged in: `npm login`

The `@puskevit` scope is tied to the npm account `puskevit`. Publishing a scoped package for the first time creates the scope automatically under that account — but you must be logged in as `puskevit` for this to work. Verify:

```bash
npm whoami
```

Expected: `puskevit`

- [ ] **Step 2: Dry run to verify what gets published**

```bash
npm publish --dry-run --access public
```

Check the file list — should only contain `dist/` files.

- [ ] **Step 3: Publish**

```bash
npm publish --access public
```

Expected: `+ @puskevit/smth-ui@0.1.0`

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm", "cjs"],
  dts: { compilerOptions: { incremental: false } },
  splitting: false,
  clean: true,
  external: ["react", "react-dom"],
  banner: { js: '"use client";' },
});

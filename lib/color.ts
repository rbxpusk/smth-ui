/**
 * Shared color utilities for smth-ui.
 * Centralizes hex validation, parsing, and manipulation
 * to prevent CSS injection and NaN-color bugs.
 */

const HEX_RE = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

/** Validate and normalize a hex color string. Returns 6-digit hex or fallback. */
export function safeHex(input: string, fallback = "#876cff"): string {
  const trimmed = input.trim();
  if (!HEX_RE.test(trimmed)) return fallback;
  const hex = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (hex.length === 3) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  // 8-char (with alpha) — strip alpha for CSS-in-JS usage
  if (hex.length === 8) return `#${hex.slice(0, 6)}`;
  return `#${hex}`;
}

/** Parse a validated hex string to {r, g, b}. Always call safeHex() first. */
export function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Parse hex to [r, g, b] tuple. */
export function hexToRgb(hex: string): [number, number, number] {
  const { r, g, b } = parseHex(hex);
  return [r, g, b];
}

/** Parse hex to "r,g,b" string for CSS rgba(). */
export function hexToRgbString(hex: string): string {
  const { r, g, b } = parseHex(hex);
  return `${r},${g},${b}`;
}

/** Lighten a hex color by `amt` (0-255). */
export function lighten(hex: string, amt = 40): string {
  const { r, g, b } = parseHex(hex);
  return `rgb(${Math.min(255, r + amt)},${Math.min(255, g + amt)},${Math.min(255, b + amt)})`;
}

/** Darken a hex color by `amt` (0-255). */
export function darken(hex: string, amt = 30): string {
  const { r, g, b } = parseHex(hex);
  return `rgb(${Math.max(0, r - amt)},${Math.max(0, g - amt)},${Math.max(0, b - amt)})`;
}

/** Returns true if the color is perceptually light (for text contrast decisions). */
export function isLight(hex: string): boolean {
  const { r, g, b } = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/** Validate that a URL is safe for use in CSS url() — only http(s), relative paths, and data:image. */
export function safeSrc(src: string): string | undefined {
  const trimmed = src.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }
  return undefined;
}

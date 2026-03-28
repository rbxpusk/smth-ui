"use client";
import { useState, useCallback } from "react";

type Language = "tsx" | "ts" | "js" | "jsx" | "bash" | "shell" | "css";

interface CodeBlockProps {
  code: string;
  language?: Language;
  filename?: string;
  showCopy?: boolean;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Tokenizer (operates on original string, never on HTML) ────────────────────
function tokenize(
  line: string,
  patterns: Array<{ re: RegExp; color: string; group?: number }>
): string {
  type Tok = { start: number; end: number; color: string };
  const toks: Tok[] = [];
  for (const { re, color, group = 0 } of patterns) {
    const g = new RegExp(re.source, re.flags.replace(/g/g, "") + "g");
    let m: RegExpExecArray | null;
    while ((m = g.exec(line)) !== null) {
      const text = m[group];
      if (!text) continue;
      const start = group === 0 ? m.index : m.index + m[0].indexOf(text);
      toks.push({ start, end: start + text.length, color });
    }
  }
  toks.sort((a, b) => a.start - b.start);
  const kept: Tok[] = [];
  let cursor = 0;
  for (const t of toks) {
    if (t.start >= cursor) { kept.push(t); cursor = t.end; }
  }
  let out = "";
  let pos = 0;
  for (const t of kept) {
    out += esc(line.slice(pos, t.start));
    out += `<span style="color:${t.color}">${esc(line.slice(t.start, t.end))}</span>`;
    pos = t.end;
  }
  return out + esc(line.slice(pos));
}

// ── CSS highlighter ───────────────────────────────────────────────────────────
function highlightCss(code: string): string {
  return code.split("\n").map(line => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.startsWith("//")) {
      return `<span style="color:#4a5568">${esc(line)}</span>`;
    }
    // Selector lines: non-indented, ending with {
    if (/\{\s*$/.test(line) && !/^\s/.test(line) && line.trim() !== "{") {
      const m = line.match(/^(.+?)(\s*\{)\s*$/);
      if (m) return `<span style="color:#f87171">${esc(m[1].trimEnd())}</span>${esc(m[2])}`;
    }
    return tokenize(line, [
      { re: /@[\w-]+/,                                   color: "#60a5fa" },
      { re: /--[\w-]+/,                                  color: "#a78bfa" },
      { re: /#[0-9a-fA-F]{3,8}\b/,                       color: "#4ade80" },
      { re: /rgba?\([^)]*\)/,                            color: "#4ade80" },
      { re: /(?<=^\s{1,})[\w-]+(?=\s*:)/,               color: "#7dd3fc" },
      { re: /"[^"]*"|'[^']*'/,                           color: "#4ade80" },
    ]);
  }).join("\n");
}

// ── Bash highlighter ──────────────────────────────────────────────────────────
function highlightBash(code: string): string {
  return code.split("\n").map(line => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#")) {
      return `<span style="color:#4a5568">${esc(line)}</span>`;
    }
    return tokenize(line, [
      { re: /\b(?:npm|npx|yarn|pnpm|bun)\b/,                          color: "#f87171" },
      { re: /\b(?:install|add|run|create|init|build|dev|start|exec|dlx)\b/, color: "#60a5fa" },
      { re: /(?<=\s|^)(?:--[\w-]+|-[a-zA-Z]\b)/,                      color: "#fbbf24" },
      { re: /"[^"]*"|'[^']*'/,                                         color: "#4ade80" },
    ]);
  }).join("\n");
}

// ── TSX/TS highlighter ────────────────────────────────────────────────────────
function highlightTsx(code: string): string {
  return code.split("\n").map(highlightLine).join("\n");
}

function highlightLine(raw: string): string {
  const commentMatch = raw.match(/^(\s*)(\/\/.*)$/);
  if (commentMatch) {
    return `${esc(commentMatch[1])}<span style="color:#4a5568">${esc(commentMatch[2])}</span>`;
  }

  let result = "";
  let i = 0;

  while (i < raw.length) {
    if (raw[i] === "/" && raw[i + 1] === "/") {
      result += `<span style="color:#4a5568">${esc(raw.slice(i))}</span>`;
      break;
    }
    if (raw[i] === "`" || raw[i] === '"' || raw[i] === "'") {
      const q = raw[i];
      let j = i + 1;
      while (j < raw.length) {
        if (raw[j] === "\\") { j += 2; continue; }
        if (raw[j] === q) { j++; break; }
        j++;
      }
      result += `<span style="color:#4ade80">${esc(raw.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    if (raw[i] === "<" && raw[i + 1] === "/") {
      const tagEnd = raw.indexOf(">", i);
      if (tagEnd !== -1) {
        const inner = raw.slice(i + 2, tagEnd);
        result += `<span style="color:#7dd3fc">&lt;/</span><span style="color:#f87171">${esc(inner)}</span><span style="color:#7dd3fc">&gt;</span>`;
        i = tagEnd + 1;
        continue;
      }
    }
    if (raw[i] === "<" && i + 1 < raw.length && /[A-Za-z]/.test(raw[i + 1])) {
      let j = i + 1;
      while (j < raw.length && /[\w.]/.test(raw[j])) j++;
      const tagName = raw.slice(i + 1, j);
      result += `<span style="color:#7dd3fc">&lt;</span><span style="color:#f87171">${esc(tagName)}</span>`;
      i = j;
      while (i < raw.length && raw[i] !== ">" && !(raw[i] === "/" && raw[i + 1] === ">")) {
        if (raw[i] === " " || raw[i] === "\t") { result += esc(raw[i]); i++; continue; }
        if (/[a-zA-Z_$]/.test(raw[i])) {
          let k = i;
          while (k < raw.length && raw[k] !== "=" && raw[k] !== " " && raw[k] !== ">" && raw[k] !== "/") k++;
          result += `<span style="color:#fbbf24">${esc(raw.slice(i, k))}</span>`;
          i = k;
          if (raw[i] === "=") {
            result += `<span style="color:#e2e8f0">=</span>`;
            i++;
            if (raw[i] === '"' || raw[i] === "'") {
              const q2 = raw[i]; let m = i + 1;
              while (m < raw.length && raw[m] !== q2) m++;
              m++;
              result += `<span style="color:#4ade80">${esc(raw.slice(i, m))}</span>`;
              i = m;
            } else if (raw[i] === "{") {
              let depth = 0; let m = i;
              while (m < raw.length) {
                if (raw[m] === "{") depth++;
                else if (raw[m] === "}") { depth--; if (depth === 0) { m++; break; } }
                m++;
              }
              result += `<span style="color:#e2e8f0">${esc(raw.slice(i, m))}</span>`;
              i = m;
            }
          }
          continue;
        }
        result += esc(raw[i]); i++;
      }
      if (raw[i] === "/" && raw[i + 1] === ">") {
        result += `<span style="color:#7dd3fc">/&gt;</span>`; i += 2;
      } else if (raw[i] === ">") {
        result += `<span style="color:#7dd3fc">&gt;</span>`; i++;
      }
      continue;
    }
    if (/\d/.test(raw[i]) && (i === 0 || /[\s,(:=\[{+\-*/<>!&|^~%]/.test(raw[i - 1]))) {
      let j = i;
      while (j < raw.length && /[\d._]/.test(raw[j])) j++;
      result += `<span style="color:#fb923c">${esc(raw.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    if (/[a-zA-Z_$]/.test(raw[i])) {
      let j = i;
      while (j < raw.length && /[\w$]/.test(raw[j])) j++;
      const word = raw.slice(i, j);
      const KEYWORDS = new Set([
        "import","from","export","const","let","var","function","return","type",
        "interface","default","as","async","await","if","else","for","while",
        "switch","case","break","continue","new","class","extends","implements",
        "typeof","instanceof","true","false","null","undefined","void","in","of",
      ]);
      if (KEYWORDS.has(word)) {
        result += `<span style="color:#60a5fa">${esc(word)}</span>`;
      } else {
        const before = raw.slice(0, i).trimEnd();
        if (before.endsWith(":") || before.endsWith("<")) {
          result += `<span style="color:#a78bfa">${esc(word)}</span>`;
        } else {
          result += `<span style="color:#e2e8f0">${esc(word)}</span>`;
        }
      }
      i = j;
      continue;
    }
    result += esc(raw[i]);
    i++;
  }
  return result;
}

// ── Language icons ────────────────────────────────────────────────────────────
const LANG_META: Record<Language, { label: string; color: string; icon: string }> = {
  tsx: {
    label: "tsx",
    color: "#60a5fa",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="3.8"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(-60 12 12)"/></svg>`,
  },
  ts: {
    label: "ts",
    color: "#60a5fa",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg>`,
  },
  js: {
    label: "js",
    color: "#fbbf24",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="14" cy="14" r="3"/><path d="M10 8v5"/></svg>`,
  },
  jsx: {
    label: "jsx",
    color: "#60a5fa",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="3.8"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(-60 12 12)"/></svg>`,
  },
  bash: {
    label: "sh",
    color: "#4ade80",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><polyline points="8 10 12 14 8 18"/><line x1="16" y1="18" x2="16" y2="18.01"/></svg>`,
  },
  shell: {
    label: "sh",
    color: "#4ade80",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><polyline points="8 10 12 14 8 18"/><line x1="16" y1="18" x2="16" y2="18.01"/></svg>`,
  },
  css: {
    label: "css",
    color: "#a78bfa",
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16l-1.5 14.39L12 20l-6.5-2.61L4 3z"/><path d="M16 8H8l.5 4h7l-.5 4.5-3 .5-3-.5-.2-2.5"/></svg>`,
  },
};

export function CodeBlock({ code, language = "tsx", filename, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [hoverCopy, setHoverCopy] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const isBash = language === "bash" || language === "shell";
  const isCss  = language === "css";

  const highlighted = isBash
    ? highlightBash(code)
    : isCss
      ? highlightCss(code)
      : highlightTsx(code);

  const meta = LANG_META[language] ?? LANG_META["tsx"];

  return (
    <div style={{
      background:   "#0a0a10",
      border:       "1px solid rgba(255,255,255,0.07)",
      borderRadius: "var(--radius, 12px)",
      overflow:     "hidden",
      marginBottom: "24px",
    }}>
      {/* Header */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "8px 12px 8px 14px",
        borderBottom:   "1px solid rgba(255,255,255,0.05)",
        background:     "rgba(255,255,255,0.015)",
      }}>
        {/* Left: icon + filename */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {/* Language icon */}
          <span
            style={{ color: meta.color, display: "flex", alignItems: "center", opacity: 0.8 }}
            dangerouslySetInnerHTML={{ __html: meta.icon }}
          />
          {filename ? (
            <span style={{
              fontSize:   "12px",
              color:      "rgba(255,255,255,0.45)",
              fontFamily: "var(--mono, monospace)",
            }}>
              {filename}
            </span>
          ) : (
            <span style={{
              fontSize:      "11px",
              color:         meta.color,
              opacity:       0.6,
              fontFamily:    "var(--mono, monospace)",
              letterSpacing: "0.04em",
            }}>
              {meta.label}
            </span>
          )}
        </div>

        {/* Right: copy button */}
        {showCopy && (
          <button
            onClick={handleCopy}
            onMouseEnter={() => setHoverCopy(true)}
            onMouseLeave={() => setHoverCopy(false)}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "5px",
              background:     hoverCopy ? "rgba(255,255,255,0.06)" : "transparent",
              border:         "1px solid",
              borderColor:    copied
                ? "rgba(74,222,128,0.3)"
                : hoverCopy ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
              borderRadius:   "6px",
              padding:        "3px 9px",
              fontSize:       "11px",
              color:          copied ? "#4ade80" : "rgba(255,255,255,0.35)",
              cursor:         "pointer",
              transition:     "all 0.12s",
              fontFamily:     "var(--sans, sans-serif)",
            }}
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code */}
      <div style={{
        padding:    "18px 20px",
        overflowX:  "auto",
        fontFamily: "var(--mono, monospace)",
        fontSize:   "13px",
        lineHeight: 1.75,
        color:      "#c9cdd4",
      }}>
        <pre style={{ margin: 0 }}>
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  );
}

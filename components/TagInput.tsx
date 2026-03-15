"use client";
import { type KeyboardEvent, useRef, useState } from "react";

interface TagInputProps {
  tags:        string[];
  onChange:    (tags: string[]) => void;
  placeholder?: string;
  label?:      string;
  max?:        number;
  color?:      string;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

export function TagInput({
  tags, onChange, placeholder = "Add tag…", label, max, color = "#876cff",
}: TagInputProps) {
  const [input, setInput]   = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [r,g,b] = hexToRgb(color);

  function addTag(value: string) {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    if (max && tags.length >= max) return;
    onChange([...tags, trimmed]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", letterSpacing: "-0.01em" }}>
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display:     "flex",
          flexWrap:    "wrap",
          gap:         "6px",
          padding:     "8px 12px",
          minHeight:   "42px",
          borderRadius: "11px",
          background:  "linear-gradient(170deg, #181620 0%, #0f0d1a 100%)",
          border:      focused
            ? `1px solid rgba(${r},${g},${b},0.5)`
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow:   focused
            ? `0 0 0 3px rgba(${r},${g},${b},0.12), 0 1px 0 rgba(255,255,255,0.04) inset`
            : "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.25) inset",
          cursor:      "text",
          transition:  "border-color 0.15s, box-shadow 0.15s",
          alignItems:  "center",
        }}
      >
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              display:     "inline-flex",
              alignItems:  "center",
              gap:         "5px",
              height:      "24px",
              padding:     "0 8px 0 10px",
              borderRadius: "6px",
              fontSize:    "12px",
              fontWeight:  600,
              color,
              background:  `linear-gradient(170deg, rgba(${r},${g},${b},0.15) 0%, rgba(${r},${g},${b},0.09) 100%)`,
              border:      `1px solid rgba(${r},${g},${b},0.3)`,
              userSelect:  "none",
            }}
          >
            {tag}
            <button
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              style={{
                display: "flex", alignItems: "center",
                background: "none", border: "none",
                color: "inherit", cursor: "pointer", padding: 0, opacity: 0.7,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M1 1l8 8M9 1L1 9"/>
              </svg>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input) addTag(input); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{
            flex:        1,
            minWidth:    "80px",
            background:  "none",
            border:      "none",
            outline:     "none",
            fontSize:    "13px",
            color:       "var(--text)",
            height:      "24px",
          }}
        />
      </div>
      {max && (
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          {tags.length}/{max}
        </span>
      )}
    </div>
  );
}

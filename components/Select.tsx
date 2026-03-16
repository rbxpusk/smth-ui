"use client";
import React, { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import { safeHex, hexToRgb } from "@/lib/color";

export interface SelectOption {
  value:    string;
  label:    string;
  disabled?: boolean;
}

interface SelectProps {
  options:      SelectOption[];
  value?:       string;
  onChange?:    (value: string) => void;
  placeholder?: string;
  label?:       string;
  hint?:        string;
  error?:       string;
  disabled?:    boolean;
  color?:       string;  // hex accent for focus ring/active state
  style?:       CSSProperties;
  fullWidth?:   boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select({
  options, value, onChange, placeholder = "Select…",
  label, hint, error, disabled = false, color = "#876cff", style, fullWidth,
}, forwardedRef) {
  const [open,    setOpen]    = useState(false);
  const [focused, setFocused] = useState<number>(-1);
  const ref                   = useRef<HTMLDivElement>(null);
  const listRef               = useRef<HTMLDivElement>(null);
  const hasError              = !!error;
  const validColor            = safeHex(color);
  const [r,g,b]               = hexToRgb(validColor);

  const selected    = options.find(o => o.value === value);
  const enabledOpts = options.map((o, i) => ({ ...o, idx: i })).filter(o => !o.disabled);

  const close = useCallback(() => { setOpen(false); setFocused(-1); }, []);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    function onScroll(e: Event) {
      if (listRef.current?.contains(e.target as Node)) return;
      close();
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close]);

  // Scroll focused option into view
  useEffect(() => {
    if (!open || focused < 0) return;
    const el = listRef.current?.children[focused] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [focused, open]);

  function handleSelect(val: string) {
    onChange?.(val);
    close();
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        const selIdx = enabledOpts.findIndex(o => o.value === value);
        setFocused(selIdx >= 0 ? enabledOpts[selIdx].idx : (enabledOpts.length > 0 ? enabledOpts[0].idx : -1));
      } else if (focused >= 0) {
        const opt = options[focused];
        if (opt && !opt.disabled) handleSelect(opt.value);
      }
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      const cur = enabledOpts.findIndex(o => o.idx === focused);
      const prev = enabledOpts[cur - 1] ?? enabledOpts[enabledOpts.length - 1];
      if (prev) setFocused(prev.idx);
    } else if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      const cur = enabledOpts.findIndex(o => o.idx === focused);
      const next = enabledOpts[cur + 1] ?? enabledOpts[0];
      if (next) setFocused(next.idx);
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      if (enabledOpts[0]) setFocused(enabledOpts[0].idx);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      const last = enabledOpts[enabledOpts.length - 1];
      if (last) setFocused(last.idx);
    }
  }

  const borderColor = hasError
    ? "rgba(248,113,113,0.5)"
    : open ? `rgba(${r},${g},${b},0.5)` : "rgba(255,255,255,0.08)";

  const ringColor = hasError
    ? "0 0 0 3px rgba(248,113,113,0.12)"
    : open ? `0 0 0 3px rgba(${r},${g},${b},0.12)` : "";

  const listboxId = `smth-select-list-${label?.replace(/\s/g,"") ?? Math.random().toString(36).slice(2)}`;

  return (
    <div
      ref={(node) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative", width: fullWidth ? "100%" : undefined, ...style }}
    >
      {label && (
        <label style={{ fontSize: "12px", fontWeight: 600, color: open ? "var(--text-sub)" : "var(--text-muted)", letterSpacing: "-0.01em", transition: "color 0.15s" }}>
          {label}
        </label>
      )}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={focused >= 0 ? `smth-opt-${options[focused]?.value}` : undefined}
        aria-invalid={hasError}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          width:          "100%",
          height:         "42px",
          padding:        "0 14px",
          fontSize:       "14px",
          fontFamily:     "var(--sans)",
          fontWeight:     400,
          color:          selected ? "var(--text)" : "var(--text-muted)",
          background:     open
            ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
            : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
          border:         `1px solid ${borderColor}`,
          borderRadius:   "var(--radius, 11px)",
          outline:        "none",
          cursor:         disabled ? "not-allowed" : "pointer",
          opacity:        disabled ? 0.5 : 1,
          boxShadow:      ringColor
            ? `${ringColor}, 0 1px 0 rgba(255,255,255,0.04) inset`
            : "0 2px 0 rgba(255,255,255,0.03) inset, 0 4px 10px rgba(0,0,0,0.25)",
          transition:     "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          textAlign:      "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {selected ? selected.label : placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          style={{
            position:     "absolute",
            top:          "calc(100% + 6px)",
            left:         0,
            right:        0,
            zIndex:       1100,
            background:   "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
            border:       `1px solid rgba(${r},${g},${b},0.22)`,
            borderRadius: "var(--radius, 12px)",
            boxShadow:    `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 40px rgba(${r},${g},${b},0.06)`,
            overflow:     "hidden auto",
            padding:      "4px",
            maxHeight:    "240px",
            scrollbarWidth: "none",
          } as CSSProperties}
        >
          {options.length === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
              No options
            </div>
          ) : options.map((opt, i) => {
            const isSelected  = opt.value === value;
            const isFocused   = focused === i;
            const isDisabledO = opt.disabled ?? false;
            return (
              <div
                key={opt.value}
                id={`smth-opt-${opt.value}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabledO}
                onMouseEnter={() => !isDisabledO && setFocused(i)}
                onMouseLeave={() => setFocused(-1)}
                onClick={() => !isDisabledO && handleSelect(opt.value)}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  padding:        "9px 12px",
                  fontSize:       "13px",
                  fontFamily:     "var(--sans)",
                  fontWeight:     isSelected ? 700 : 400,
                  color:          isDisabledO
                    ? "var(--text-muted)"
                    : isSelected ? validColor : isFocused ? "var(--text)" : "var(--text-sub)",
                  background:     isSelected
                    ? `rgba(${r},${g},${b},0.14)`
                    : isFocused ? "rgba(255,255,255,0.05)" : "transparent",
                  borderRadius:   "var(--radius-sm, 8px)",
                  cursor:         isDisabledO ? "not-allowed" : "pointer",
                  opacity:        isDisabledO ? 0.4 : 1,
                  textAlign:      "left",
                  transition:     "background 0.12s, color 0.12s",
                  userSelect:     "none",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {opt.label}
                </span>
                {isSelected && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(hint || error) && (
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: error ? "var(--red, #f87171)" : "var(--text-muted)" }}>
          {error && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {error || hint}
        </span>
      )}
    </div>
  );
});

Select.displayName = "Select";

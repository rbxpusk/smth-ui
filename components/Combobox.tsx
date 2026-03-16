"use client";
import React, { useState, useRef, useEffect, useCallback, useId, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { safeHex, hexToRgb } from "@/lib/color";

export interface ComboboxOption {
  value:     string;
  label:     string;
  disabled?: boolean;
}

interface ComboboxProps {
  options:      ComboboxOption[];
  value?:       string;
  onChange?:    (value: string) => void;
  placeholder?: string;
  label?:       string;
  hint?:        string;
  error?:       string;
  disabled?:    boolean;
  color?:       string;
  style?:       CSSProperties;
  emptyText?:   string;
}

export function Combobox({
  options, value, onChange, placeholder = "Search…",
  label, hint, error, disabled = false, color = "#876cff",
  style, emptyText = "No results",
}: ComboboxProps) {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState("");
  const [focused, setFocused]   = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const wrapperRef              = useRef<HTMLDivElement>(null);
  const listRef                 = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const uid                     = useId();
  const listboxId               = `combobox-list-${uid}`;

  const hasError    = !!error;
  const validColor  = safeHex(color);
  const [r, g, b]   = hexToRgb(validColor);

  const selected = options.find(o => o.value === value);

  // When closed, show selected label; when open, show what user is typing
  const displayQuery = open ? query : (selected?.label ?? "");

  // Only filter when user has typed something; show all when query is empty
  const filtered = query.trim() === ""
    ? options
    : options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

  const close = useCallback(() => {
    setOpen(false);
    setFocused(-1);
    setQuery("");
  }, []);

  // Position the dropdown via portal
  const updatePosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownPos({
      top:   rect.bottom + 6 + window.scrollY,
      left:  rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      close();
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open, close]);

  // Scroll focused into view
  useEffect(() => {
    if (!open || focused < 0 || !listRef.current) return;
    const el = listRef.current.children[focused] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focused, open]);

  function handleSelect(val: string) {
    onChange?.(val);
    close();
    inputRef.current?.blur();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (!open) setOpen(true);
    setFocused(-1);
  }

  function handleFocus() {
    setInputFocused(true);
    if (!open) {
      setOpen(true);
      // Start with empty query so ALL options are visible
      setQuery("");
    }
  }

  function handleBlur() {
    setInputFocused(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      inputRef.current?.blur();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) { setOpen(true); setQuery(""); }
      setFocused(prev => {
        const next = prev + 1;
        return next >= filtered.length ? 0 : next;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); setQuery(""); }
      setFocused(prev => {
        const next = prev - 1;
        return next < 0 ? filtered.length - 1 : next;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (open && focused >= 0 && focused < filtered.length) {
        const opt = filtered[focused];
        if (opt && !opt.disabled) handleSelect(opt.value);
      }
      return;
    }
  }

  function highlightMatch(text: string): React.ReactNode {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: validColor, fontWeight: 700 }}>
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  }

  const borderColor = hasError
    ? "rgba(248,113,113,0.5)"
    : inputFocused ? `rgba(${r},${g},${b},0.5)` : "rgba(255,255,255,0.08)";

  const ringColor = hasError
    ? "0 0 0 3px rgba(248,113,113,0.12)"
    : inputFocused ? `0 0 0 3px rgba(${r},${g},${b},0.12)` : "";

  const dropdown = open && dropdownPos && (
    <div
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-label={label}
      style={{
        position:       "absolute",
        top:            dropdownPos.top,
        left:           dropdownPos.left,
        width:          dropdownPos.width,
        zIndex:         1100,
        background:     "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
        border:         `1px solid rgba(${r},${g},${b},0.22)`,
        borderRadius:   "var(--radius, 12px)",
        boxShadow:      `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 40px rgba(${r},${g},${b},0.06)`,
        overflow:       "hidden auto",
        padding:        "4px",
        maxHeight:      "240px",
        scrollbarWidth: "none",
      } as CSSProperties}
    >
      {filtered.length === 0 ? (
        <div style={{
          padding:   "12px 14px",
          fontSize:  "13px",
          color:     "var(--text-muted)",
          textAlign: "center",
        }}>
          {emptyText}
        </div>
      ) : filtered.map((opt, i) => {
        const isSelected  = opt.value === value;
        const isFocused   = focused === i;
        const isDisabledO = opt.disabled ?? false;
        return (
          <div
            key={opt.value}
            id={`combobox-opt-${uid}-${opt.value}`}
            role="option"
            aria-selected={isSelected}
            aria-disabled={isDisabledO}
            onMouseEnter={() => !isDisabledO && setFocused(i)}
            onMouseLeave={() => setFocused(-1)}
            onMouseDown={(e) => {
              e.preventDefault(); // prevent blur
              if (!isDisabledO) handleSelect(opt.value);
            }}
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
              {highlightMatch(opt.label)}
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
  );

  return (
    <div
      ref={wrapperRef}
      style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative", ...style }}
    >
      {label && (
        <label style={{
          fontSize:      "12px",
          fontWeight:    600,
          color:         inputFocused ? "var(--text-sub)" : "var(--text-muted)",
          letterSpacing: "-0.01em",
          transition:    "color 0.15s",
        }}>
          {label}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && focused >= 0 && focused < filtered.length
              ? `combobox-opt-${uid}-${filtered[focused]?.value}`
              : undefined
          }
          aria-invalid={hasError}
          aria-label={label}
          disabled={disabled}
          placeholder={placeholder}
          value={displayQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            display:        "flex",
            alignItems:     "center",
            width:          "100%",
            height:         "42px",
            padding:        "0 36px 0 14px",
            fontSize:       "14px",
            fontFamily:     "var(--sans)",
            fontWeight:     400,
            color:          "var(--text)",
            background:     inputFocused
              ? "linear-gradient(170deg, var(--surface-hi, rgba(255,255,255,0.07)) 0%, var(--surface, rgba(255,255,255,0.04)) 100%)"
              : "linear-gradient(170deg, var(--surface, rgba(255,255,255,0.05)) 0%, var(--surface-lo, rgba(0,0,0,0.3)) 100%)",
            border:         `1px solid ${borderColor}`,
            borderRadius:   "var(--radius, 11px)",
            outline:        "none",
            cursor:         disabled ? "not-allowed" : "text",
            opacity:        disabled ? 0.5 : 1,
            boxShadow:      ringColor
              ? `${ringColor}, 0 1px 0 rgba(255,255,255,0.04) inset`
              : "0 2px 0 rgba(255,255,255,0.03) inset, 0 4px 10px rgba(0,0,0,0.25)",
            transition:     "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          }}
        />

        {/* Dropdown arrow */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            position:    "absolute",
            right:       "14px",
            top:         "50%",
            transform:   `translateY(-50%) rotate(${open ? "180deg" : "0deg"})`,
            color:       "var(--text-muted)",
            pointerEvents: "none",
            transition:  "transform 0.2s",
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {(hint || error) && (
        <span style={{
          display:    "flex",
          alignItems: "center",
          gap:        "5px",
          fontSize:   "12px",
          color:      error ? "var(--red, #f87171)" : "var(--text-muted)",
        }}>
          {error && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {error || hint}
        </span>
      )}

      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}

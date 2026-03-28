"use client";
import { useState, useEffect, useRef } from "react";
import type { TocItem } from "@/lib/docs/types";

interface OnThisPageProps {
  items: TocItem[];
}

export function OnThisPage({ items }: OnThisPageProps) {
  const [activeId, setActiveId]   = useState<string>("");
  const navRef                    = useRef<HTMLElement>(null);
  const activeRef                 = useRef<HTMLAnchorElement>(null);
  const lockedRef                 = useRef(false);
  const lockTimerRef              = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!items.length) {
      setActiveId("");
      return;
    }

    function getActive(): string {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40) {
        return items[items.length - 1].id;
      }
      const THRESHOLD = 80;
      let active = items[0].id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < THRESHOLD) active = id;
      }
      return active;
    }

    setActiveId(getActive());

    function handleScroll() {
      if (lockedRef.current) return;
      setActiveId(getActive());
    }

    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", handleScroll, { capture: true } as EventListenerOptions);
  }, [items]);

  // Scroll the active TOC link into view within the nav panel
  useEffect(() => {
    if (!activeId || !navRef.current || !activeRef.current) return;
    const nav        = navRef.current;
    const link       = activeRef.current;
    const navTop     = nav.scrollTop;
    const navBottom  = navTop + nav.clientHeight;
    const linkTop    = link.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;
    if (linkTop < navTop + 24) {
      nav.scrollTo({ top: linkTop - 24, behavior: "smooth" });
    } else if (linkBottom > navBottom - 24) {
      nav.scrollTo({ top: linkBottom - nav.clientHeight + 24, behavior: "smooth" });
    }
  }, [activeId]);

  function handleLinkClick(id: string) {
    setActiveId(id);
    lockedRef.current = true;
    clearTimeout(lockTimerRef.current);
    // Hold for long enough that the scroll animation finishes (~800ms)
    lockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, 800);
  }

  if (items.length === 0) return null;

  return (
    <nav
      ref={navRef}
      style={{
        width:     196,
        minWidth:  196,
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
        flexShrink: 0,
        scrollbarWidth: "none",
      }}
    >
      <p style={{
        fontSize:      "10px",
        fontWeight:    600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color:         "rgba(255,255,255,0.2)",
        margin:        "0 0 12px 0",
        paddingLeft:   "12px",
      }}>
        On this page
      </p>

      <div style={{ position: "relative", paddingLeft: "12px" }}>
        <div style={{
          position:   "absolute",
          left:       "0",
          top:        "4px",
          bottom:     "4px",
          width:      "1px",
          background: "rgba(255,255,255,0.07)",
        }} />

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map(item => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} style={{ position: "relative" }}>
                {isActive && (
                  <div style={{
                    position:   "absolute",
                    left:       "-12px",
                    top:        0,
                    bottom:     0,
                    width:      "1px",
                    background: "#876cff",
                  }} />
                )}
                <a
                  ref={isActive ? activeRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  style={{
                    display:        "block",
                    fontSize:       item.level === 3 ? "12px" : "13px",
                    lineHeight:     "1.7",
                    paddingLeft:    item.level === 3 ? "14px" : "0",
                    paddingTop:     "3px",
                    paddingBottom:  "3px",
                    color:          isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                    fontWeight:     isActive ? 500 : 400,
                    textDecoration: "none",
                    transition:     "color 0.15s",
                    whiteSpace:     "nowrap",
                    overflow:       "hidden",
                    textOverflow:   "ellipsis",
                  }}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

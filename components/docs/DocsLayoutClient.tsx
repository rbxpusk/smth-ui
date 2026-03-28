"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocsSidebar } from "./DocsSidebar";
import { OnThisPage } from "./OnThisPage";
import { useTocItems } from "./DocsContext";

export function DocsLayoutClient({ children }: { children: React.ReactNode }) {
  const tocItems  = useTocItems();
  const pathname  = usePathname();

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative", display: "flex", flexDirection: "column" }}>

      {/* ── Background ── */}
      <div
        aria-hidden="true"
        style={{
          position:        "fixed",
          inset:           0,
          pointerEvents:   "none",
          zIndex:          0,
          background:      "#000",
          backgroundImage: [
            "radial-gradient(ellipse 70% 55% at 15% 10%, rgba(38,38,38,0.85) 0%, transparent 55%)",
            "radial-gradient(ellipse 55% 45% at 88% 90%, rgba(28,28,28,0.7) 0%, transparent 52%)",
            "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(20,20,20,0.4) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ── Navbar ── */}
      <header style={{
        position:   "sticky",
        top:        0,
        zIndex:     50,
        height:     52,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display:    "flex",
        alignItems: "center",
      }}>
        <div style={{
          flex:           1,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 20px",
          maxWidth:       "100%",
        }}>
          {/* Left cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "7px", textDecoration: "none", padding: "6px 10px", borderRadius: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="#876cff" opacity="0.9"/>
                <circle cx="12" cy="12" r="8" stroke="rgba(135,108,255,0.25)" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="12" r="11.5" stroke="rgba(135,108,255,0.1)" strokeWidth="1" fill="none"/>
              </svg>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                smth ui
              </span>
            </Link>

            {/* Separator */}
            <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

            {/* Breadcrumb nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "0 6px" }}>
              {[
                { label: "Docs",       href: "/docs/introduction" },
                { label: "Components", href: "/docs/components" },
                { label: "Theming",    href: "/docs/theming" },
              ].map(item => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      fontSize:       "13px",
                      color:          isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                      fontWeight:     isActive ? 500 : 400,
                      textDecoration: "none",
                      padding:        "4px 9px",
                      borderRadius:   "6px",
                      background:     isActive ? "rgba(255,255,255,0.06)" : "transparent",
                      transition:     "color 0.12s, background 0.12s",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

            {/* GitHub */}
            <a
              href="https://github.com/rbxpusk/smth-ui"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          "32px",
                height:         "32px",
                borderRadius:   "7px",
                color:          "rgba(255,255,255,0.35)",
                textDecoration: "none",
                transition:     "color 0.12s, background 0.12s",
                background:     "transparent",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>

            {/* Playground */}
            <Link
              href="/playground"
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "5px",
                padding:        "5px 11px",
                fontSize:       "12px",
                fontWeight:     500,
                color:          "rgba(255,255,255,0.55)",
                textDecoration: "none",
                background:     "rgba(255,255,255,0.05)",
                border:         "1px solid rgba(255,255,255,0.08)",
                borderRadius:   "7px",
                transition:     "color 0.12s, border-color 0.12s, background 0.12s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              Playground
            </Link>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, position: "relative", zIndex: 1 }}>
        <DocsSidebar />

        <main style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 820, padding: "48px 40px" }}>
            {children}
          </div>
        </main>

        <style>{`
          @media (max-width: 1279px) { .docs-toc-panel { display: none !important; } }
          h1[id], h2[id], h3[id] { scroll-margin-top: 68px; }
        `}</style>
        <div className="docs-toc-panel" style={{
          position: "sticky",
          top: 80,
          alignSelf: "flex-start",
          padding: "52px 28px 0 0",
        }}>
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}

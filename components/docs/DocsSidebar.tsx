"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs/nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @media (max-width: 767px) { .docs-sidebar { display: none !important; } }
        .docs-sidebar::-webkit-scrollbar { width: 0; }
        .docs-sidebar-link:hover { background: rgba(255,255,255,0.04) !important; }
        .docs-sidebar-link:hover .docs-sidebar-label { color: rgba(255,255,255,0.65) !important; }
      `}</style>

      <aside
        className="docs-sidebar"
        style={{
          width:        220,
          minWidth:     220,
          height:       "calc(100vh - 52px)",
          position:     "sticky",
          top:          52,
          overflowY:    "auto",
          flexShrink:   0,
          scrollbarWidth: "none",
          padding:      "28px 0 40px",
          borderRight:  "1px solid rgba(255,255,255,0.045)",
          background:   "linear-gradient(180deg, rgba(6,5,14,0.0) 0%, rgba(6,5,14,0.0) 100%)",
        }}
      >
        {DOCS_NAV.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: sIdx === 0 ? 20 : 0 }}>
            {/* Section header */}
            {section.title && (
              <div style={{
                display:       "flex",
                alignItems:    "center",
                gap:           "8px",
                padding:       "0 16px",
                marginBottom:  "6px",
                marginTop:     sIdx > 0 ? "8px" : 0,
              }}>
                <span style={{
                  fontSize:      "10px",
                  fontWeight:    700,
                  letterSpacing: "0.12em",
                  color:         "rgba(255,255,255,0.18)",
                  textTransform: "uppercase",
                }}>
                  {section.title}
                </span>
                {sIdx === 1 && (
                  <span style={{
                    fontSize:     "9px",
                    fontWeight:   600,
                    color:        "rgba(135,108,255,0.5)",
                    background:   "rgba(135,108,255,0.08)",
                    border:       "1px solid rgba(135,108,255,0.15)",
                    borderRadius: "4px",
                    padding:      "0px 5px",
                    letterSpacing: "0",
                  }}>
                    {DOCS_NAV[1]?.items.length ?? 0}
                  </span>
                )}
              </div>
            )}

            {/* Divider above Components section */}
            {sIdx === 1 && (
              <div style={{
                height:     "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)",
                margin:     "0 0 12px",
              }} />
            )}

            <ul style={{ listStyle: "none", padding: "0 8px", margin: 0 }}>
              {section.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="docs-sidebar-link"
                      style={{
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "space-between",
                        fontSize:       "13px",
                        padding:        "5px 8px",
                        borderRadius:   "7px",
                        color:          isActive
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.38)",
                        background:     isActive
                          ? "rgba(135,108,255,0.1)"
                          : "transparent",
                        fontWeight:     isActive ? 500 : 400,
                        textDecoration: "none",
                        transition:     "color 0.1s, background 0.1s",
                        marginBottom:   "1px",
                        position:       "relative",
                      }}
                    >
                      {/* Active left bar */}
                      {isActive && (
                        <div style={{
                          position:     "absolute",
                          left:         0,
                          top:          "5px",
                          bottom:       "5px",
                          width:        "2px",
                          borderRadius: "1px",
                          background:   "linear-gradient(180deg, rgba(135,108,255,0.9), rgba(135,108,255,0.5))",
                          boxShadow:    "0 0 6px rgba(135,108,255,0.4)",
                        }} />
                      )}

                      <span
                        className="docs-sidebar-label"
                        style={{
                          paddingLeft: isActive ? "10px" : "4px",
                          transition:  "padding 0.1s",
                          color:       isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)",
                        }}
                      >
                        {item.title}
                      </span>

                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {item.external && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        )}
                        {item.badge && (
                          <span style={{
                            fontSize:      "9px",
                            fontWeight:    700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color:         "#876cff",
                            background:    "rgba(135,108,255,0.1)",
                            border:        "1px solid rgba(135,108,255,0.2)",
                            padding:       "1px 5px",
                            borderRadius:  "4px",
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Bottom fade */}
        <div style={{
          position:   "sticky",
          bottom:     0,
          height:     "40px",
          background: "linear-gradient(to top, rgba(6,5,14,0.95) 0%, transparent 100%)",
          pointerEvents: "none",
          marginTop:  "auto",
        }} />
      </aside>
    </>
  );
}

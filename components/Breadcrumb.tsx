import { type ReactNode } from "react";

interface BreadcrumbItem {
  label:    ReactNode;
  href?:    string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
      {items.map((item, i) => {
        const isLast   = i === items.length - 1;
        const isActive = isLast;
        const Tag      = item.href ? "a" : "span";
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Tag
              {...(item.href ? { href: item.href } : {})}
              onClick={!item.href ? item.onClick : undefined}
              style={{
                fontSize:      "13px",
                fontWeight:    isActive ? 600 : 500,
                color:         isActive ? "var(--text)" : "var(--text-muted)",
                textDecoration: "none",
                cursor:        !isActive && (item.href || item.onClick) ? "pointer" : "default",
                transition:    "color 0.13s",
                padding:       "2px 4px",
                borderRadius:  "5px",
              } as React.CSSProperties}
            >
              {item.label}
            </Tag>
            {!isLast && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            )}
          </span>
        );
      })}
    </nav>
  );
}

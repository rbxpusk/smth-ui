import { type CSSProperties } from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?:      SpinnerSize;
  color?:     string;
  style?:     CSSProperties;
  label?:     string;   // screen reader text, default "Loading"
}

const spinnerSizes = { sm: 16, md: 24, lg: 36, xl: 48 };

export function Spinner({ size = "md", color = "var(--text-muted, #555)", style, label = "Loading" }: SpinnerProps) {
  const s = spinnerSizes[size];
  return (
    <>
      <style>{`
        @keyframes smth-spin { to { transform: rotate(360deg); } }
        .smth-spinner { animation: smth-spin 0.75s linear infinite; }
      `}</style>
      <svg
        className="smth-spinner"
        role="status"
        aria-label={label}
        width={s} height={s}
        viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
        style={style}
      >
        <path d="M12 2a10 10 0 0 1 10 10" opacity="1" />
        <path d="M12 2a10 10 0 0 0-10 10" opacity="0.15" />
        <path d="M12 22a10 10 0 0 0 10-10" opacity="0.05" />
      </svg>
    </>
  );
}

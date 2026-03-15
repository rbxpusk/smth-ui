import { type CSSProperties } from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?:   SpinnerSize;
  color?:  string;
  style?:  CSSProperties;
}

const spinnerSizes = { sm: 16, md: 24, lg: 36, xl: 48 };

export function Spinner({ size = "md", color = "var(--purple-hi)", style }: SpinnerProps) {
  const s = spinnerSizes[size];
  return (
    <svg
      className="spin"
      width={s} height={s}
      viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round"
      style={style}
    >
      <path d="M12 2a10 10 0 0 1 10 10" opacity="1" />
      <path d="M12 2a10 10 0 0 0-10 10" opacity="0.2" />
    </svg>
  );
}

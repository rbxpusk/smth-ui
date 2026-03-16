import { type CSSProperties } from "react";

interface SkeletonProps {
  width?:  string | number;
  height?: string | number;
  radius?: string;
  style?:  CSSProperties;
}

export function Skeleton({ width = "100%", height = "16px", radius = "6px", style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, flexShrink: 0, ...style }}
    />
  );
}

export function SkeletonText({ lines = 3, gap = "8px" }: { lines?: number; gap?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "60%" : "100%"} height="14px" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "var(--radius, 12px)",
      background: "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", gap: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Skeleton width="44px" height="44px" radius="50%" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton width="40%" height="14px" />
          <Skeleton width="60%" height="12px" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "36px 1fr 120px 80px",
      alignItems: "center", gap: "12px",
      padding: "12px 16px",
      borderRadius: "var(--radius, 12px)",
      background: "linear-gradient(170deg, var(--surface-hi, var(--surface, #111)) 0%, var(--surface, #111) 100%)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.055)",
    }}>
      <Skeleton width="36px" height="36px" radius="50%" />
      <Skeleton height="13px" width="55%" />
      <Skeleton height="13px" />
      <Skeleton height="13px" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={`${size}px`} height={`${size}px`} radius="50%" />;
}

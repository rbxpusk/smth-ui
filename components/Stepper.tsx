"use client";
import { type CSSProperties } from "react";
import { safeHex, hexToRgbString } from "@/lib/color";

interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  activeStep: number;
  color?: string;
  style?: CSSProperties;
  orientation?: "horizontal" | "vertical";
}

const CIRCLE_SIZE = 32;

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function Stepper({
  steps,
  activeStep,
  color,
  style,
  orientation = "horizontal",
}: StepperProps) {
  const accent = safeHex(color ?? "#876cff");
  const accentRgb = hexToRgbString(accent);
  const isVertical = orientation === "vertical";

  return (
    <>
      <style>{`
        @keyframes stepper-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(${accentRgb},0.4); }
          50% { box-shadow: 0 0 0 6px rgba(${accentRgb},0); }
        }
        @keyframes stepper-check-in {
          from { transform: scale(0) rotate(-45deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes stepper-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes stepper-fill-v {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes stepper-circle-in {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
      <div
        role="list"
        aria-label="Progress steps"
        style={{
          display:       "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems:    isVertical ? "flex-start" : "center",
          gap:           0,
          ...style,
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isFuture = index > activeStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              style={{
                display:       "flex",
                flexDirection: isVertical ? "row" : "column",
                alignItems:    isVertical ? "flex-start" : "center",
                flex:          isVertical ? undefined : (isLast ? "0 0 auto" : 1),
              }}
            >
              {/* Circle + connector */}
              <div style={{
                display:       "flex",
                alignItems:    "center",
                flexDirection: isVertical ? "column" : "row",
                width:         isVertical ? `${CIRCLE_SIZE}px` : "100%",
                flexShrink:    0,
              }}>
                {/* Step circle */}
                <div style={{
                  width:          `${CIRCLE_SIZE}px`,
                  height:         `${CIRCLE_SIZE}px`,
                  borderRadius:   "50%",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "12px",
                  fontWeight:     700,
                  flexShrink:     0,
                  position:       "relative",
                  animation:      "stepper-circle-in 0.35s cubic-bezier(0.22,1,0.36,1) both",
                  transition:     "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                  ...(isCompleted ? {
                    background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                    color:      "#fff",
                    border:     "none",
                    boxShadow:  `0 2px 8px rgba(${accentRgb},0.35), 0 0 0 2px rgba(${accentRgb},0.12)`,
                  } : isActive ? {
                    background:  `linear-gradient(135deg, rgba(${accentRgb},0.15), rgba(${accentRgb},0.08))`,
                    color:       accent,
                    border:      `2px solid ${accent}`,
                    boxShadow:   `0 0 12px rgba(${accentRgb},0.2)`,
                    animation:   `stepper-pulse 2s ease-in-out infinite, stepper-circle-in 0.35s cubic-bezier(0.22,1,0.36,1) both`,
                  } : {
                    background:  "rgba(255,255,255,0.04)",
                    color:       "var(--text-muted)",
                    border:      "1px solid rgba(255,255,255,0.08)",
                    boxShadow:   "none",
                  }),
                }}>
                  {isCompleted ? (
                    <span style={{ display: "flex", animation: "stepper-check-in 0.3s cubic-bezier(0.34,1.4,0.64,1) both" }}>
                      <CheckIcon />
                    </span>
                  ) : (
                    <span style={{ fontFamily: "var(--mono, monospace)" }}>{index + 1}</span>
                  )}
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div style={{
                    position:     "relative",
                    overflow:     "hidden",
                    borderRadius: "1px",
                    ...(isVertical ? {
                      width:  "2px",
                      height: "36px",
                      margin: "4px 0",
                    } : {
                      height:   "2px",
                      flex:     1,
                      margin:   "0 10px",
                      minWidth: "20px",
                    }),
                    background: "rgba(255,255,255,0.06)",
                  }}>
                    {/* Animated fill overlay */}
                    <div style={{
                      position:        "absolute",
                      inset:           0,
                      borderRadius:    "1px",
                      background:      `linear-gradient(${isVertical ? "180deg" : "90deg"}, ${accent}, ${accent}aa)`,
                      transformOrigin: isVertical ? "top" : "left",
                      transform:       isCompleted ? (isVertical ? "scaleY(1)" : "scaleX(1)") : (isVertical ? "scaleY(0)" : "scaleX(0)"),
                      transition:      "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }} />
                  </div>
                )}
              </div>

              {/* Label + description */}
              <div style={{
                display:       "flex",
                flexDirection: "column",
                gap:           "2px",
                ...(isVertical ? {
                  paddingLeft:   "14px",
                  paddingTop:    "5px",
                  paddingBottom: isLast ? 0 : "12px",
                } : {
                  alignItems: "center",
                  paddingTop: "10px",
                }),
              }}>
                <span style={{
                  fontSize:   "13px",
                  fontWeight: isActive ? 700 : 600,
                  color:      isCompleted ? accent : isActive ? "var(--text)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s, font-weight 0.3s",
                }}>
                  {step.label}
                </span>
                {step.description && (
                  <span style={{
                    fontSize:   "11px",
                    color:      isActive ? "var(--text-sub)" : "var(--text-muted)",
                    lineHeight: 1.4,
                    transition: "color 0.3s",
                    ...(isVertical ? {} : { textAlign: "center" as const }),
                  }}>
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

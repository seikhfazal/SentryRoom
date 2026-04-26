import type { ReactNode } from "react";

export function ControlButton({
  children,
  tone = "neutral",
  onClick,
  wide = false,
  disabled = false,
  title
}: {
  children: ReactNode;
  tone?: "neutral" | "danger" | "safe" | "alert";
  onClick?: () => void;
  wide?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button className={`control-button ${tone} ${wide ? "wide" : ""}`} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  );
}

import { ControlButton } from "./ControlButton";

const actions = [
  ["arm", "Arm", "safe"],
  ["disarm", "Disarm", "neutral"],
  ["demo_mode", "Demo Mode", "alert"],
  ["stop_all", "Stop All", "danger"],
  ["lock", "Lock", "alert"],
  ["unlock", "Unlock", "safe"],
  ["sentry_idle", "Sentry Idle", "neutral"],
  ["sentry_scan", "Sentry Scan", "neutral"],
  ["cinematic_alert_demo", "Cinematic Alert", "alert"]
] as const;

export function MobileQuickActions({ onAction, connected }: { onAction: (action: string) => void; connected: boolean }) {
  return (
    <div className="mobile-actions">
      {actions.map(([id, label, tone]) => (
        <ControlButton
          key={id}
          tone={tone}
          onClick={() => onAction(id)}
          wide
          disabled={!connected && id !== "stop_all"}
          title={!connected && id !== "stop_all" ? "Backend unavailable in demo mode" : undefined}
        >
          {label}
        </ControlButton>
      ))}
    </div>
  );
}

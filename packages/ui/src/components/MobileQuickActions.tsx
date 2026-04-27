import { CircleDot, Lock, Play, Radar, ShieldAlert, ShieldCheck, ShieldOff, Siren, Unlock } from "lucide-react";
import { ControlButton } from "./ControlButton";

const actions = [
  { id: "arm", label: "Arm", tone: "safe", Icon: ShieldCheck },
  { id: "disarm", label: "Disarm", tone: "neutral", Icon: ShieldOff },
  { id: "demo_mode", label: "Demo Mode", tone: "alert", Icon: Play },
  { id: "stop_all", label: "Stop All", tone: "danger", Icon: ShieldAlert },
  { id: "lock", label: "Lock", tone: "alert", Icon: Lock },
  { id: "unlock", label: "Unlock", tone: "safe", Icon: Unlock },
  { id: "sentry_idle", label: "Sentry Idle", tone: "neutral", Icon: CircleDot },
  { id: "sentry_scan", label: "Sentry Scan", tone: "neutral", Icon: Radar },
  { id: "cinematic_alert_demo", label: "Cinematic Alert", tone: "alert", Icon: Siren }
] as const;

export function MobileQuickActions({
  onAction,
  connected,
  canControl
}: {
  onAction: (action: string) => void;
  connected: boolean;
  canControl: boolean;
}) {
  const disabledTitle = !connected ? "Backend unavailable in demo mode" : !canControl ? "Enter PIN to unlock controls" : undefined;
  return (
    <div className="mobile-actions">
      {actions.map(({ id, label, tone, Icon }) => (
        <ControlButton
          key={id}
          tone={tone}
          onClick={() => onAction(id)}
          wide
          disabled={!canControl && id !== "stop_all"}
          title={disabledTitle}
        >
          <Icon size={18} /> {label}
        </ControlButton>
      ))}
    </div>
  );
}

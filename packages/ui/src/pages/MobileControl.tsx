import type { Status } from "../api/types";
import { api } from "../api/client";
import { MobileQuickActions } from "../components/MobileQuickActions";
import { ControlButton } from "../components/ControlButton";

export function MobileControl({
  status,
  refresh,
  connected,
  canControl
}: {
  status: Status;
  refresh: () => void;
  connected: boolean;
  canControl: boolean;
}) {
  const stopAll = () => {
    if (!connected) {
      alert("Backend unavailable. Stop All could not be sent.");
      return;
    }
    if (!canControl) {
      alert("Enter the local PIN to unlock controls before sending Stop All.");
      return;
    }
    api.stopAll().then(refresh).catch(() => alert("Backend unavailable. Stop All could not be sent."));
  };
  const quickAction = (action: string) => {
    if (!connected) {
      alert("Backend unavailable. Action could not be sent.");
      return;
    }
    if (!canControl) {
      alert("Enter the local PIN to unlock controls before sending commands.");
      return;
    }
    api.quickAction(action).then(refresh).catch(() => alert("Backend unavailable. Action could not be sent."));
  };

  return (
    <main className="mobile-page">
      {!connected && <div className="demo-mode-banner">Demo Mode - No hardware connected</div>}
      <section className="mobile-status">
        <span>{status.system_state}</span>
        <strong>{status.message}</strong>
        <small>{status.device_online ? "Device online" : "Device offline"} | {status.sentry_state}</small>
      </section>
      <ControlButton tone="danger" wide onClick={stopAll}>Stop All</ControlButton>
      <MobileQuickActions connected={connected} canControl={canControl} onAction={quickAction} />
    </main>
  );
}

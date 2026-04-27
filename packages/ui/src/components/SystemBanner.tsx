import { ShieldAlert } from "lucide-react";
import { api } from "../api/client";
import type { Status } from "../api/types";
import { AlertBanner } from "./AlertBanner";
import { ControlButton } from "./ControlButton";

export function SystemBanner({
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

  return (
    <div className="banner-wrap">
      {!connected && <div className="demo-mode-banner">Demo Mode - No hardware connected</div>}
      {connected && !canControl && <div className="demo-mode-banner locked-banner">Controls locked - enter PIN to send commands</div>}
      <AlertBanner status={status} />
      <ControlButton tone="danger" onClick={stopAll}><ShieldAlert size={18} /> Stop All</ControlButton>
    </div>
  );
}

import { ShieldAlert } from "lucide-react";
import { api } from "../api/client";
import type { Status } from "../api/types";
import { AlertBanner } from "./AlertBanner";
import { ControlButton } from "./ControlButton";

export function SystemBanner({ status, refresh, connected }: { status: Status; refresh: () => void; connected: boolean }) {
  const stopAll = () => {
    if (!connected) {
      alert("Backend unavailable. Stop All could not be sent.");
      return;
    }
    api.stopAll().then(refresh).catch(() => alert("Backend unavailable. Stop All could not be sent."));
  };

  return (
    <div className="banner-wrap">
      {!connected && <div className="demo-mode-banner">Demo Mode - No hardware connected</div>}
      <AlertBanner status={status} />
      <ControlButton tone="danger" onClick={stopAll}><ShieldAlert size={18} /> Stop All</ControlButton>
    </div>
  );
}

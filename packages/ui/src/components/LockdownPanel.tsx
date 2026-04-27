import { Lock, Unlock } from "lucide-react";
import { api } from "../api/client";
import { ControlButton } from "./ControlButton";

export function LockdownPanel({ connected, canControl }: { connected: boolean; canControl: boolean }) {
  const disabledTitle = !connected ? "Backend unavailable in demo mode" : !canControl ? "Enter PIN to unlock controls" : undefined;
  return (
    <section className="glass panel">
      <div className="panel-title">Access</div>
      <div className="button-row">
        <ControlButton tone="alert" onClick={() => api.lock()} disabled={!canControl} title={disabledTitle}><Lock size={16} /> Lock</ControlButton>
        <ControlButton tone="safe" onClick={() => api.unlock()} disabled={!canControl} title={disabledTitle}><Unlock size={16} /> Unlock</ControlButton>
      </div>
    </section>
  );
}

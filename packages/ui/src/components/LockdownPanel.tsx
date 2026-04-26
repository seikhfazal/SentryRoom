import { Lock, Unlock } from "lucide-react";
import { api } from "../api/client";
import { ControlButton } from "./ControlButton";

export function LockdownPanel({ connected }: { connected: boolean }) {
  const disabledTitle = connected ? undefined : "Backend unavailable in demo mode";
  return (
    <section className="glass panel">
      <div className="panel-title">Access</div>
      <div className="button-row">
        <ControlButton tone="alert" onClick={() => api.lock()} disabled={!connected} title={disabledTitle}><Lock size={16} /> Lock</ControlButton>
        <ControlButton tone="safe" onClick={() => api.unlock()} disabled={!connected} title={disabledTitle}><Unlock size={16} /> Unlock</ControlButton>
      </div>
    </section>
  );
}

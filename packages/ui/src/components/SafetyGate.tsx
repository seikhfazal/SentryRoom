import { useState } from "react";
import { api } from "../api/client";
import { ControlButton } from "./ControlButton";

export function SafetyGate({ connected, canControl }: { connected: boolean; canControl: boolean }) {
  const [advanced, setAdvanced] = useState(false);
  const disabledTitle = !connected ? "Backend unavailable in demo mode" : !canControl ? "Enter PIN to unlock controls" : undefined;
  return (
    <section className="glass panel">
      <div className="panel-title">Advanced Safety Controls</div>
      <label className="toggle"><input type="checkbox" checked={advanced} onChange={(event) => setAdvanced(event.target.checked)} /> Show confirmed manual test</label>
      {advanced && (
        <ControlButton
          tone="alert"
          onClick={() => api.manualMist(window.confirm("Run fixed-direction manual mist test?"))}
          disabled={!canControl}
          title={disabledTitle}
        >
          Manual Mist Test
        </ControlButton>
      )}
    </section>
  );
}

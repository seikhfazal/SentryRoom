import { useState } from "react";
import { api } from "../api/client";
import { ControlButton } from "./ControlButton";

export function SafetyGate({ connected }: { connected: boolean }) {
  const [advanced, setAdvanced] = useState(false);
  return (
    <section className="glass panel">
      <div className="panel-title">Advanced Safety Controls</div>
      <label className="toggle"><input type="checkbox" checked={advanced} onChange={(event) => setAdvanced(event.target.checked)} /> Show confirmed manual test</label>
      {advanced && (
        <ControlButton
          tone="alert"
          onClick={() => api.manualMist(window.confirm("Run fixed-direction manual mist test?"))}
          disabled={!connected}
          title={connected ? undefined : "Backend unavailable in demo mode"}
        >
          Manual Mist Test
        </ControlButton>
      )}
    </section>
  );
}

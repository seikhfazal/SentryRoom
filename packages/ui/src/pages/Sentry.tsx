import type { Status } from "../api/types";
import { api } from "../api/client";
import { ControlButton } from "../components/ControlButton";
import { SentryPanel } from "../components/SentryPanel";
import { SentryUnitSelector } from "../components/SentryUnitSelector";

export function Sentry({ status, refresh, connected }: { status: Status; refresh: () => void; connected: boolean }) {
  const move = (pan: number, tilt: number) => api.move(pan, tilt).then(refresh);
  const disabledTitle = connected ? undefined : "Backend unavailable in demo mode";
  const stopAll = () => {
    if (!connected) {
      alert("Backend unavailable. Stop All could not be sent.");
      return;
    }
    api.stopAll().then(refresh).catch(() => alert("Backend unavailable. Stop All could not be sent."));
  };
  const units = [
    { id: "sentry-main", label: "Sentry Alpha", role: "pan-tilt head", online: status.device_online, active: true }
  ];
  return (
    <div className="page-grid">
      <SentryPanel status={status} />
      <SentryUnitSelector units={units} />
      <section className="glass panel">
        <div className="panel-title">Modes</div>
        <div className="button-row">
          <ControlButton onClick={() => api.setMode("IDLE").then(refresh)} disabled={!connected} title={disabledTitle}>Idle</ControlButton>
          <ControlButton onClick={() => api.setMode("SCANNING").then(refresh)} disabled={!connected} title={disabledTitle}>Scan</ControlButton>
          <ControlButton tone="alert" onClick={() => api.setMode("CINEMATIC_ALERT").then(refresh)} disabled={!connected} title={disabledTitle}>Cinematic Alert</ControlButton>
          <ControlButton tone="alert" onClick={() => api.demoStart().then(refresh)} disabled={!connected} title={disabledTitle}>Demo Sequence</ControlButton>
          <ControlButton tone="danger" onClick={stopAll}>Stop All</ControlButton>
        </div>
      </section>
      <section className="glass panel">
        <div className="panel-title">Manual Movement</div>
        <div className="button-row">
          <ControlButton onClick={() => move(status.pan - 5, status.tilt)} disabled={!connected} title={disabledTitle}>Pan Left</ControlButton>
          <ControlButton onClick={() => move(status.pan + 5, status.tilt)} disabled={!connected} title={disabledTitle}>Pan Right</ControlButton>
          <ControlButton onClick={() => move(status.pan, status.tilt - 5)} disabled={!connected} title={disabledTitle}>Tilt Up</ControlButton>
          <ControlButton onClick={() => move(status.pan, status.tilt + 5)} disabled={!connected} title={disabledTitle}>Tilt Down</ControlButton>
          <ControlButton onClick={() => move(90, 80)} disabled={!connected} title={disabledTitle}>Center</ControlButton>
        </div>
        <p className="muted">Movement is bounded by safe servo limits and rejects invalid angles.</p>
      </section>
    </div>
  );
}

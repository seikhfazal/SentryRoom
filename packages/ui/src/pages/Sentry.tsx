import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CircleDot, Play, Radar, ShieldAlert } from "lucide-react";
import type { Status } from "../api/types";
import { api } from "../api/client";
import { ControlButton } from "../components/ControlButton";
import { SentryPanel } from "../components/SentryPanel";
import { SentryUnitSelector } from "../components/SentryUnitSelector";

export function Sentry({
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
  const move = (pan: number, tilt: number) => api.move(pan, tilt).then(refresh);
  const disabledTitle = !connected ? "Backend unavailable in demo mode" : !canControl ? "Enter PIN to unlock controls" : undefined;
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
          <ControlButton onClick={() => api.setMode("IDLE").then(refresh)} disabled={!canControl} title={disabledTitle}><CircleDot size={16} /> Idle</ControlButton>
          <ControlButton onClick={() => api.setMode("SCANNING").then(refresh)} disabled={!canControl} title={disabledTitle}><Radar size={16} /> Scan</ControlButton>
          <ControlButton tone="alert" onClick={() => api.setMode("CINEMATIC_ALERT").then(refresh)} disabled={!canControl} title={disabledTitle}><Play size={16} /> Cinematic Alert</ControlButton>
          <ControlButton tone="alert" onClick={() => api.demoStart().then(refresh)} disabled={!canControl} title={disabledTitle}><Play size={16} /> Demo Sequence</ControlButton>
          <ControlButton tone="danger" onClick={stopAll} title={disabledTitle}><ShieldAlert size={16} /> Stop All</ControlButton>
        </div>
      </section>
      <section className="glass panel">
        <div className="panel-title">Manual Movement</div>
        <div className="button-row">
          <ControlButton onClick={() => move(status.pan - 5, status.tilt)} disabled={!canControl} title={disabledTitle}><ArrowLeft size={16} /> Pan Left</ControlButton>
          <ControlButton onClick={() => move(status.pan + 5, status.tilt)} disabled={!canControl} title={disabledTitle}><ArrowRight size={16} /> Pan Right</ControlButton>
          <ControlButton onClick={() => move(status.pan, status.tilt - 5)} disabled={!canControl} title={disabledTitle}><ArrowUp size={16} /> Tilt Up</ControlButton>
          <ControlButton onClick={() => move(status.pan, status.tilt + 5)} disabled={!canControl} title={disabledTitle}><ArrowDown size={16} /> Tilt Down</ControlButton>
          <ControlButton onClick={() => move(90, 80)} disabled={!canControl} title={disabledTitle}><CircleDot size={16} /> Center</ControlButton>
        </div>
        <p className="muted">Movement is bounded by safe servo limits and rejects invalid angles.</p>
      </section>
    </div>
  );
}

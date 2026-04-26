import { Activity, DoorOpen, Lightbulb, Siren, Wifi } from "lucide-react";
import type { EventLog, Status } from "../api/types";
import { api } from "../api/client";
import { EventTimeline } from "../components/EventTimeline";
import { LockdownPanel } from "../components/LockdownPanel";
import { SentryPanel } from "../components/SentryPanel";
import { StatusCard } from "../components/StatusCard";
import { ControlButton } from "../components/ControlButton";

export function Dashboard({ status, events, refresh, connected }: { status: Status; events: EventLog[]; refresh: () => void; connected: boolean }) {
  const disabledTitle = connected ? undefined : "Backend unavailable in demo mode";
  const stopAll = () => {
    if (!connected) {
      alert("Backend unavailable. Stop All could not be sent.");
      return;
    }
    api.stopAll().then(refresh).catch(() => alert("Backend unavailable. Stop All could not be sent."));
  };

  return (
    <div className="page-grid">
      <section className="command-core glass">
        <div className="holo-disc">
          <span className="disc-ring ring-one" />
          <span className="disc-ring ring-two" />
          <span className="disc-ring ring-three" />
          <strong>{status.system_state}</strong>
        </div>
        <div className="core-copy">
          <span className="eyebrow">Sentinel command core</span>
          <h2>{status.sentry_state.replace(/_/g, " ")}</h2>
          <p>Local-first room telemetry, safe-zone sentry control, and cinematic demo systems are online in a bounded prototype environment.</p>
        </div>
      </section>
      <div className="cards-grid">
        <StatusCard icon={<Wifi size={18} />} label="Device" value={status.device_online ? "Online" : "Offline"} detail={status.mock_mode ? "Mock mode" : "Hardware mode"} />
        <StatusCard icon={<DoorOpen size={18} />} label="Door" value={status.door_open ? "Open" : "Closed"} />
        <StatusCard icon={<Activity size={18} />} label="Motion" value={status.motion_detected ? "Detected" : "Clear"} />
        <StatusCard icon={<Lightbulb size={18} />} label="Pseudo LED" value={status.pseudo_laser_on ? "On" : "Off"} detail={`PWM ${status.pseudo_laser_pwm}`} />
      </div>
      <SentryPanel status={status} />
      <section className="glass panel">
        <div className="panel-title"><Siren size={18} /> Quick Actions</div>
        <div className="button-row">
          <ControlButton tone="safe" onClick={() => api.arm().then(refresh)} disabled={!connected} title={disabledTitle}>Arm</ControlButton>
          <ControlButton onClick={() => api.disarm().then(refresh)} disabled={!connected} title={disabledTitle}>Disarm</ControlButton>
          <ControlButton tone="alert" onClick={() => api.demoStart().then(refresh)} disabled={!connected} title={disabledTitle}>Demo Mode</ControlButton>
          <ControlButton tone="danger" onClick={stopAll}>Stop All</ControlButton>
        </div>
      </section>
      <LockdownPanel connected={connected} />
      <EventTimeline events={events} />
    </div>
  );
}

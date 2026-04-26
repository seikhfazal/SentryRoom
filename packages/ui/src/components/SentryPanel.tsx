import { Radar } from "lucide-react";
import type { Status } from "../api/types";

export function SentryPanel({ status }: { status: Status }) {
  return (
    <section className="glass sentry-panel">
      <div className="panel-title"><Radar size={18} /> Sentry Head</div>
      <div className="sentry-orbit">
        <div className="scan-line" />
        <div className="sentry-eye">
          <span className="sentry-head-icon" aria-hidden="true">
            <i />
          </span>
          <b>{status.pseudo_laser_on ? "LED" : "IDLE"}</b>
        </div>
      </div>
      <div className="readouts">
        <span>Mode <b>{status.sentry_state}</b></span>
        <span>Pan <b>{status.pan} deg</b></span>
        <span>Tilt <b>{status.tilt} deg</b></span>
        <span>RGB <b>{status.rgb}</b></span>
      </div>
    </section>
  );
}

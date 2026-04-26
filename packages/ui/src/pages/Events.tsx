import type { EventLog } from "../api/types";
import { api } from "../api/client";
import { ControlButton } from "../components/ControlButton";
import { EventTimeline } from "../components/EventTimeline";

export function Events({ events, refresh }: { events: EventLog[]; refresh: () => void }) {
  return (
    <div className="page-grid">
      <section className="glass panel">
        <div className="panel-title">Filters</div>
        <p className="muted">Severity/source filters and export are reserved placeholders.</p>
        <div className="button-row">
          <ControlButton onClick={() => alert("Export placeholder")}>Export</ControlButton>
          <ControlButton onClick={() => api.events().then(refresh)}>Refresh</ControlButton>
        </div>
      </section>
      <EventTimeline events={events} />
    </div>
  );
}

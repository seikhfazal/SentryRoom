import type { EventLog } from "../api/types";

export function EventTimeline({ events }: { events: EventLog[] }) {
  return (
    <section className="glass panel">
      <div className="panel-title">Event Feed</div>
      <div className="timeline">
        {events.length === 0 && <p className="muted">No events yet.</p>}
        {events.map((event) => (
          <article key={event.id} className={`event ${event.severity.toLowerCase()}`}>
            <time>{event.created_at}</time>
            <strong>{event.severity}</strong>
            <span>{event.source}</span>
            <p>{event.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

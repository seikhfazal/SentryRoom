import { Plus, RadioTower } from "lucide-react";
import type { SentryUnit } from "../api/types";

export function SentryUnitSelector({ units }: { units: SentryUnit[] }) {
  return (
    <section className="glass panel">
      <div className="panel-title"><RadioTower size={18} /> Sentry Units</div>
      <div className="unit-list">
        {units.map((unit) => (
          <button key={unit.id} className={unit.active ? "active" : ""}>
            <span className="mini-sentry-icon" aria-hidden="true">
              <i />
            </span>
            <span>
              <strong>{unit.label}</strong>
              <small>{unit.role} | {unit.online ? "online" : "offline"}</small>
            </span>
          </button>
        ))}
        <button className="add-unit" onClick={() => alert("Multi-sentry add flow placeholder. Future units should each get a unique MQTT client ID and calibration set.")}>
          <Plus size={18} />
          <span>
            <strong>Add sentry unit</strong>
            <small>Placeholder for multi-room expansion</small>
          </span>
        </button>
      </div>
    </section>
  );
}

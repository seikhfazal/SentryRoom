import { BrainCircuit, MicOff, PlugZap } from "lucide-react";

export function AssistantDock() {
  return (
    <section className="assistant-dock" aria-label="Future assistant bridge placeholder">
      <div className="assistant-core">
        <div className="core-ring ring-a" />
        <div className="core-ring ring-b" />
        <BrainCircuit size={26} />
      </div>
      <div>
        <span className="eyebrow">Future assistant bridge</span>
        <strong>Offline hook ready</strong>
        <small>No voice capture. No AI commands. Safety layer stays in control.</small>
      </div>
      <div className="assistant-flags">
        <span><MicOff size={13} /> voice off</span>
        <span><PlugZap size={13} /> local hook</span>
      </div>
    </section>
  );
}

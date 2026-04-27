import { useEffect, useState } from "react";
import type { CalibrationPoint, Status } from "../api/types";
import { api } from "../api/client";
import { CalibrationPad } from "../components/CalibrationPad";
import { ControlButton } from "../components/ControlButton";

export function Calibration({
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
  const [points, setPoints] = useState<CalibrationPoint[]>([]);
  const [pan, setPan] = useState(status.pan);
  const [tilt, setTilt] = useState(status.tilt);
  const disabledTitle = !connected ? "Backend unavailable in demo mode" : !canControl ? "Enter PIN to unlock controls" : undefined;

  useEffect(() => {
    api.calibration().then(setPoints).catch(() => setPoints([]));
  }, []);

  const move = (panDelta: number, tiltDelta: number) => {
    if (!canControl) return;
    const nextPan = Math.max(20, Math.min(160, pan + panDelta));
    const nextTilt = Math.max(40, Math.min(120, tilt + tiltDelta));
    setPan(nextPan);
    setTilt(nextTilt);
    api.move(nextPan, nextTilt).then(refresh);
  };

  return (
    <div className="page-grid">
      <section className="glass panel">
        <div className="panel-title">Calibration Pad</div>
        <CalibrationPad
          disabled={!canControl}
          disabledTitle={disabledTitle}
          onMove={move}
          onCenter={() => {
            if (!canControl) return;
            setPan(90);
            setTilt(80);
            api.move(90, 80).then(refresh);
          }}
        />
        <p>Pan {pan} deg | Tilt {tilt} deg</p>
      </section>
      <section className="glass panel">
        <div className="panel-title">Save Safe Zone</div>
        <div className="zone-list">
          {points.map((point) => (
            <button
              key={point.name}
              disabled={!canControl}
              title={disabledTitle}
              onClick={() => api.saveCalibration(point.name, pan, tilt).then(() => api.calibration().then(setPoints))}
            >
              {point.name}<span>{point.pan}/{point.tilt}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="glass panel">
        <div className="panel-title">Limits</div>
        <p>Pan: 20 to 160 deg. Tilt: 40 to 120 deg.</p>
        <ControlButton onClick={() => { setPan(90); setTilt(80); }}>Reset View</ControlButton>
      </section>
    </div>
  );
}

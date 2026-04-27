import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CircleDot } from "lucide-react";
import { ControlButton } from "./ControlButton";

export function CalibrationPad({
  onMove,
  onCenter,
  disabled = false,
  disabledTitle
}: {
  onMove: (panDelta: number, tiltDelta: number) => void;
  onCenter: () => void;
  disabled?: boolean;
  disabledTitle?: string;
}) {
  return (
    <div className="calibration-pad">
      <span />
      <ControlButton onClick={() => onMove(0, -5)} disabled={disabled} title={disabledTitle}><ArrowUp size={18} /></ControlButton>
      <span />
      <ControlButton onClick={() => onMove(-5, 0)} disabled={disabled} title={disabledTitle}><ArrowLeft size={18} /></ControlButton>
      <ControlButton onClick={onCenter} disabled={disabled} title={disabledTitle}><CircleDot size={18} /></ControlButton>
      <ControlButton onClick={() => onMove(5, 0)} disabled={disabled} title={disabledTitle}><ArrowRight size={18} /></ControlButton>
      <span />
      <ControlButton onClick={() => onMove(0, 5)} disabled={disabled} title={disabledTitle}><ArrowDown size={18} /></ControlButton>
      <span />
    </div>
  );
}

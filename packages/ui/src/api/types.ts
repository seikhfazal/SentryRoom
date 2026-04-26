export type SystemState = "DISARMED" | "ARMED" | "ALERT" | "LOCKDOWN" | "DEMO" | "CALIBRATION" | "SAFE_MODE";
export type SentryState = "IDLE" | "SCANNING" | "MOTION_WAKE" | "CINEMATIC_ALERT" | "DEMO_SEQUENCE" | "MARKER_TRACKING_DEMO" | "CALIBRATION" | "SAFE_MODE";
export type Severity = "INFO" | "WARN" | "ALERT" | "SAFETY" | "ERROR";

export interface Status {
  system_state: SystemState;
  sentry_state: SentryState;
  device_online: boolean;
  mock_mode: boolean;
  door_open: boolean;
  motion_detected: boolean;
  mannequin_detected: boolean;
  mannequin_region: "left" | "center" | "right" | "lost";
  mannequin_confidence: number;
  pseudo_laser_on: boolean;
  pseudo_laser_pwm: number;
  buzzer_on: boolean;
  mist_enabled: boolean;
  pan: number;
  tilt: number;
  rgb: string;
  message: string;
}

export interface EventLog {
  id: number;
  created_at: string;
  severity: Severity;
  source: string;
  message: string;
  metadata: Record<string, unknown>;
}

export interface CalibrationPoint {
  name: string;
  pan: number;
  tilt: number;
  updated_at?: string | null;
}

export interface SentryUnit {
  id: string;
  label: string;
  role: string;
  online: boolean;
  active: boolean;
}

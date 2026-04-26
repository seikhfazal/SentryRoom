# MQTT Topics

## Device publishes

| Topic | Purpose |
|---|---|
| `sentinel/device/status` | Device online/failsafe state |
| `sentinel/sensor/pir` | PIR motion |
| `sentinel/sensor/ultrasonic` | Distance value |
| `sentinel/sensor/ir_beam` | IR beam status |
| `sentinel/sensor/door` | Reed switch door state |
| `sentinel/sentry/state` | Firmware sentry mode |
| `sentinel/event/log` | Device events |
| `sentinel/error` | Device errors |

## Backend publishes

| Topic | Purpose |
|---|---|
| `sentinel/cmd/arm` | Arm system |
| `sentinel/cmd/disarm` | Disarm system |
| `sentinel/cmd/sentry/mode` | Change sentry mode |
| `sentinel/cmd/sentry/move` | Safe bounded movement |
| `sentinel/cmd/sentry/calibrate` | Save calibration |
| `sentinel/cmd/rgb` | RGB state |
| `sentinel/cmd/pseudo_laser` | Low-power LED effect only |
| `sentinel/cmd/buzzer` | Buzzer pattern |
| `sentinel/cmd/lock` | Lock placeholder |
| `sentinel/cmd/mist_manual` | Confirmed fixed-direction manual test |
| `sentinel/cmd/stop_all` | Fail-safe shutdown |
| `sentinel/cmd/safe_mode` | Safe mode |

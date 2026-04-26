# Sentinel Room Safety

Sentinel Room is a safe room-status and cinematic demo prototype. It must never become a weapon platform.

## Hard rules

- Do not use a real laser diode or module.
- The pseudo-laser is a normal red LED with a resistor behind a tube, pinhole, or stencil.
- Do not implement projectile firing.
- Do not implement weapon logic.
- Do not aim physical outputs at human body, face, or torso coordinates.
- Do not implement automatic water spray or mist at people.
- Manual mist tests require explicit confirmation and should be fixed-direction only.
- Do not wire mains AC. Use low-voltage DC simulation only.

## Fail-safe behavior

If the app, backend, MQTT, or device disconnects, the system must:

- Turn pseudo-laser LED off.
- Turn buzzer/siren off.
- Disable mist output.
- Stop demo mode.
- Return servos to safe idle/center.
- Log a `SAFE_MODE` event.

## Safe language

Use safe UI labels such as:

- Unknown presence
- Alert
- Sentry active
- Manual lockdown
- Subject acquired
- Safe mode active

Avoid violent or weapon-like wording in UI, firmware commands, docs, and logs.

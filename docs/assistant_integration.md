# Assistant Integration Placeholder

Sentinel Room is prepared for later integration with a local assistant, but no assistant is implemented yet.

Future local assistant path supplied by the user:

```text
E:\J.A.R.V.I.S
```

Current `.env` placeholders:

```text
ASSISTANT_INTEGRATION_ENABLED=false
ASSISTANT_LOCAL_PATH=E:\J.A.R.V.I.S
```

Sentinel Room does not import, launch, edit, or communicate with that folder yet.

Principles:

- Assistant integration must go through the backend safety layer.
- Assistant suggestions should be read-only unless a user confirms a safe action.
- Stop All must always remain a direct UI/backend/device path.
- No assistant may bypass servo limits, pseudo-laser timeout, mist confirmation, or Safe Mode.

Future backend route placeholder:

```text
POST /api/assistant/intent
```

Future UI placeholder:

```text
AssistantDock
```

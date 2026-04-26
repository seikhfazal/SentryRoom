# Future Assistant Hooks

This project does not implement or integrate the local assistant yet.

User-provided future assistant path:

```text
E:\J.A.R.V.I.S
```

Keep this disabled until you intentionally wire it in:

```text
ASSISTANT_INTEGRATION_ENABLED=false
ASSISTANT_LOCAL_PATH=E:\J.A.R.V.I.S
```

The UI and backend are prepared for a future local assistant bridge:

```text
packages\ui\src\components\AssistantDock.tsx
backend\app\routes\assistant.py
docs\assistant_integration.md
```

Current behavior:

- The UI may display an assistant bridge placeholder.
- No assistant commands are executed.
- No voice capture is active.
- No AI API is called.
- Nothing from `E:\J.A.R.V.I.S` is imported, launched, or modified.
- Stop All remains a direct safety control, not assistant-mediated.

Suggested future integration boundary:

1. Assistant suggests actions.
2. Backend safety layer validates actions.
3. User confirms physical actions.
4. Backend executes through existing safe API routes.
5. Stop All always bypasses assistant logic.

Allowed future command categories:

- Read status.
- Summarize events.
- Explain hardware state.
- Suggest calibration checks.
- Start safe demo after confirmation.

Blocked categories:

- Weapon-like behavior.
- Human body targeting.
- Real laser control.
- Automatic mist/spray at people.
- Public internet exposure.

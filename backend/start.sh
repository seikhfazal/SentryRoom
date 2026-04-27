#!/usr/bin/env sh
set -eu

HOST="${SENTINEL_HOST:-${SENTINEL_BIND_HOST:-0.0.0.0}}"
PORT="${PORT:-${SENTINEL_PORT:-8000}}"

exec uvicorn app.main:app --host "$HOST" --port "$PORT"

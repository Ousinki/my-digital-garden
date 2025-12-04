#!/bin/zsh

# Simple helper to launch Calibre-Web inside the local virtual environment.

set -euo pipefail

PROJECT_ROOT="/Users/ousin/Library/CloudStorage/Dropbox/Autosync/SyncVault"
VENV_DIR="${PROJECT_ROOT}/calibre-web-env"
DATA_DIR="${PROJECT_ROOT}/calibre-web-data"
LOG_DIR="${DATA_DIR}/logs"

mkdir -p "${DATA_DIR}/cache" "${DATA_DIR}/library" "${LOG_DIR}"

source "${VENV_DIR}/bin/activate"

export CACHE_DIR="${DATA_DIR}/cache"
export CALIBRE_PORT="${CALIBRE_PORT:-8083}"

echo "Calibre-Web data dir: ${DATA_DIR}"
echo "Listening on: http://127.0.0.1:${CALIBRE_PORT}"
echo "Logs: ${LOG_DIR}/cps.log"
echo "Use Ctrl+C to stop."

cps -o "${LOG_DIR}/cps.log" -p "${DATA_DIR}/app.db" -g "${DATA_DIR}/gdrive.db"


#!/usr/bin/env bash
set -Eeuo pipefail
ROOT_DIR="${1:-.}"
mkdir -p "$ROOT_DIR/apps/mobile/src/features" "$ROOT_DIR/apps/admin/src/features" "$ROOT_DIR/apps/api/src/routes"
echo "Scaffold created under: $ROOT_DIR"

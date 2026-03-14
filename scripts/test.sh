#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() { printf "\n[%s] %s\n" "$(date +'%H:%M:%S')" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*" >&2; }
run_cmd() { echo "+ $*"; "$@"; }

detect_node_pm() {
  if [[ -f pnpm-lock.yaml ]]; then echo "pnpm"; return; fi
  if [[ -f yarn.lock ]]; then echo "yarn"; return; fi
  if [[ -f bun.lockb || -f bun.lock ]]; then echo "bun"; return; fi
  if [[ -f package-lock.json || -f package.json ]]; then echo "npm"; return; fi
  echo ""
}

run_node_tests() {
  local pm
  pm="$(detect_node_pm)"
  [[ -n "$pm" ]] || { warn "Node.js プロジェクトが見つからないため Node テストをスキップします。"; return 0; }

  if [[ ! -f package.json ]]; then
    warn "package.json がないため Node テストをスキップします。"
    return 0
  fi

  if grep -q '"test"' package.json; then
    log "Run vitest"
    case "$pm" in
      pnpm) run_cmd pnpm exec vitest run ;;
      yarn) run_cmd yarn vitest run ;;
      bun)  run_cmd bun run vitest run ;;
      npm)  run_cmd npx vitest run ;;
    esac
  else
    warn "test script が package.json に見つからないため Node テストをスキップします。"
  fi

  if grep -q '"test:e2e"' package.json; then
    log "Run package.json test:e2e script"
    case "$pm" in
      pnpm) run_cmd pnpm test:e2e ;;
      yarn) run_cmd yarn test:e2e ;;
      bun)  run_cmd bun run test:e2e ;;
      npm)  run_cmd npm run test:e2e ;;
    esac
  else
    warn "test:e2e script がないため E2E をスキップします。"
  fi
}

run_python_tests() {
  if [[ -d .venv ]]; then
    # shellcheck disable=SC1091
    source .venv/bin/activate
  fi

  if command -v pytest >/dev/null 2>&1; then
    log "Run pytest"
    run_cmd pytest
  else
    warn "pytest が見つからないため Python テストをスキップします。"
  fi
}

log "Start tests"
run_node_tests
run_python_tests
log "Tests completed."

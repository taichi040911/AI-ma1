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

run_node_lint() {
  local pm
  pm="$(detect_node_pm)"
  [[ -n "$pm" ]] || { warn "Node.js プロジェクトが見つからないため lint をスキップします。"; return 0; }

  if [[ ! -f package.json ]]; then
    warn "package.json がないため npm scripts を実行できません。"
    return 0
  fi

  if grep -q '"lint"' package.json; then
    log "Run package.json lint script"
    case "$pm" in
      pnpm) run_cmd pnpm lint ;;
      yarn) run_cmd yarn lint ;;
      bun)  run_cmd bun run lint ;;
      npm)  run_cmd npm run lint ;;
    esac
    return 0
  fi

  if command -v npx >/dev/null 2>&1; then
    if [[ -f eslint.config.js || -f eslint.config.mjs || -f .eslintrc || -f .eslintrc.js || -f .eslintrc.cjs || -f .eslintrc.json ]]; then
      log "Fallback: eslint"
      run_cmd npx eslint . || return 1
      return 0
    fi
    if [[ -f biome.json || -f biome.jsonc ]]; then
      log "Fallback: biome"
      run_cmd npx @biomejs/biome check . || return 1
      return 0
    fi
  fi

  warn "lint スクリプトや linter 設定が見つかりませんでした。"
}

run_python_lint() {
  if [[ -d .venv ]]; then
    # shellcheck disable=SC1091
    source .venv/bin/activate
  fi

  if command -v ruff >/dev/null 2>&1; then
    log "Run ruff"
    run_cmd ruff check .
    return 0
  fi

  if command -v flake8 >/dev/null 2>&1; then
    log "Run flake8"
    run_cmd flake8 .
    return 0
  fi

  warn "Python linter (ruff/flake8) が見つからないため Python lint をスキップします。"
}

log "Start lint"
run_node_lint
run_python_lint
log "Lint completed."

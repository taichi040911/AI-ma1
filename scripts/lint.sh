#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() { printf "\n[%s] %s\n" "$(date +'%H:%M:%S')" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*" >&2; }
run_cmd() { echo "+ $*"; "$@"; }

detect_node_pm() {
  if [[ -f pnpm-workspace.yaml ]]; then echo "pnpm"; return; fi
  if [[ -f package.json ]] && grep -q '"packageManager": "pnpm' package.json; then echo "pnpm"; return; fi
  if [[ -f pnpm-lock.yaml ]]; then echo "pnpm"; return; fi
  if [[ -f yarn.lock ]]; then echo "yarn"; return; fi
  if [[ -f bun.lockb || -f bun.lock ]]; then echo "bun"; return; fi
  if [[ -f package-lock.json || -f package.json ]]; then echo "npm"; return; fi
  echo ""
}

list_workspaces() {
  local dirs=()
  local base
  for base in "$ROOT_DIR"/apps "$ROOT_DIR"/packages; do
    [[ -d "$base" ]] || continue
    local dir
    for dir in "$base"/*; do
      [[ -f "$dir/package.json" ]] || continue
      dirs+=("$dir")
    done
  done
  printf "%s\n" "${dirs[@]}"
}

has_node_script() {
  local dir="$1"
  local script="$2"
  node - "$dir" "$script" <<'NODE'
const fs = require("fs");
const path = process.argv[2];
const script = process.argv[3];
try {
  const pkg = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf8"));
  process.exit(pkg.scripts && pkg.scripts[script] ? 0 : 1);
} catch {
  process.exit(1);
}
NODE
}

get_package_name() {
  local dir="$1"
  node - "$dir" <<'NODE'
const fs = require("fs");
const path = process.argv[2];
try {
  const pkg = JSON.parse(fs.readFileSync(`${path}/package.json`, "utf8"));
  console.log(pkg.name || "");
} catch {
  process.exit(1);
}
NODE
}

has_lint_files() {
  local dir="$1"
  if command -v rg >/dev/null 2>&1; then
    rg --files -g "*.{js,jsx,ts,tsx,mjs,cjs,cts,mts}" "$dir" | rg -q .
    return $?
  fi
  find "$dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.cts" -o -name "*.mts" \) -print -quit | grep -q .
}

run_workspace_lint() {
  local ran="false"
  local dir

  while IFS= read -r dir; do
    if ! has_node_script "$dir" "lint"; then
      continue
    fi
    if ! has_lint_files "$dir"; then
      warn "Lint 対象が見つからないため ${dir#$ROOT_DIR/} の lint をスキップします。"
      continue
    fi
    local package_name
    package_name="$(get_package_name "$dir")"
    if [[ -z "$package_name" ]]; then
      warn "package.json に name がないため ${dir#$ROOT_DIR/} の lint をスキップします。"
      continue
    fi
    log "Run lint in ${dir#$ROOT_DIR/}"
    run_cmd pnpm --filter "$package_name" lint
    ran="true"
  done < <(list_workspaces)

  if [[ "$ran" != "true" ]]; then
    warn "lint を実行できるワークスペースがありませんでした。"
  fi
}

run_node_lint() {
  local pm
  pm="$(detect_node_pm)"
  [[ -n "$pm" ]] || { warn "Node.js プロジェクトが見つからないため lint をスキップします。"; return 0; }

  if [[ ! -f package.json ]]; then
    warn "package.json がないため npm scripts を実行できません。"
    return 0
  fi

  log "Run workspace lint scripts"
  case "$pm" in
    pnpm)
      run_workspace_lint
      return 0
      ;;
    npm)
      run_cmd npm --workspaces --if-present run lint
      return 0
      ;;
  esac

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

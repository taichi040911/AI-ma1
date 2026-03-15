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

has_test_files() {
  local dir="$1"
  if command -v rg >/dev/null 2>&1; then
    rg --files -g "*.test.*" -g "*.spec.*" -g "**/__tests__/**/*" "$dir" | rg -q .
    return $?
  fi
  find "$dir" -type f \( -name "*.test.*" -o -name "*.spec.*" -o -path "*/__tests__/*" \) -print -quit | grep -q .
}

run_workspace_script() {
  local script="$1"
  local require_tests="$2"
  local ran="false"
  local dir

  while IFS= read -r dir; do
    if ! has_node_script "$dir" "$script"; then
      continue
    fi
    if [[ "$require_tests" == "true" ]] && ! has_test_files "$dir"; then
      warn "テストファイルが見つからないため ${dir#$ROOT_DIR/} の ${script} をスキップします。"
      continue
    fi
    local package_name
    package_name="$(get_package_name "$dir")"
    if [[ -z "$package_name" ]]; then
      warn "package.json に name がないため ${dir#$ROOT_DIR/} の ${script} をスキップします。"
      continue
    fi
    log "Run ${script} in ${dir#$ROOT_DIR/}"
    run_cmd pnpm --filter "$package_name" "$script"
    ran="true"
  done < <(list_workspaces)

  if [[ "$ran" != "true" ]]; then
    warn "${script} を実行できるワークスペースがありませんでした。"
  fi
}

run_node_tests() {
  local pm
  pm="$(detect_node_pm)"
  [[ -n "$pm" ]] || { warn "Node.js プロジェクトが見つからないため Node テストをスキップします。"; return 0; }

  if [[ ! -f package.json ]]; then
    warn "package.json がないため Node テストをスキップします。"
    return 0
  fi

  case "$pm" in
    pnpm)
      run_workspace_script "test" "true"
      run_workspace_script "test:e2e" "false"
      return 0
      ;;
    npm)
      log "Run workspace tests"
      run_cmd npm --workspaces --if-present run test
      run_cmd npm --workspaces --if-present run test:e2e || true
      return 0
      ;;
  esac

  warn "workspace runner が見つからないため Node テストをスキップします。"
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

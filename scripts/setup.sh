#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() { printf "\n[%s] %s\n" "$(date +'%H:%M:%S')" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*" >&2; }
run() { echo "+ $*"; "$@"; }

detect_node_pm() {
  if [[ -f pnpm-lock.yaml ]]; then echo "pnpm"; return; fi
  if [[ -f yarn.lock ]]; then echo "yarn"; return; fi
  if [[ -f bun.lockb || -f bun.lock ]]; then echo "bun"; return; fi
  if [[ -f package-lock.json ]]; then echo "npm"; return; fi
  if [[ -f package.json ]]; then echo "npm"; return; fi
  echo ""
}

install_node_deps() {
  local pm
  pm="$(detect_node_pm)"
  if [[ -z "$pm" ]]; then
    warn "package.json が見つからないため Node.js 依存関係のセットアップをスキップします。"
    return 0
  fi

  log "Node.js package manager: $pm"

  case "$pm" in
    pnpm)
      command -v pnpm >/dev/null 2>&1 || { warn "pnpm が未インストールです。"; return 1; }
      run pnpm install --frozen-lockfile || run pnpm install
      ;;
    yarn)
      command -v yarn >/dev/null 2>&1 || { warn "yarn が未インストールです。"; return 1; }
      run yarn install --immutable || run yarn install
      ;;
    bun)
      command -v bun >/dev/null 2>&1 || { warn "bun が未インストールです。"; return 1; }
      run bun install
      ;;
    npm)
      command -v npm >/dev/null 2>&1 || { warn "npm が未インストールです。"; return 1; }
      if [[ -f package-lock.json ]]; then
        run npm ci || run npm install
      else
        run npm install
      fi
      ;;
  esac
}

setup_python_env() {
  local has_py="false"

  if [[ -f requirements.txt || -f pyproject.toml || -f setup.py ]]; then
    has_py="true"
  fi

  if [[ "$has_py" != "true" ]]; then
    warn "Python 設定ファイルが見つからないため Python セットアップをスキップします。"
    return 0
  fi

  log "Python environment setup"

  command -v python3 >/dev/null 2>&1 || { warn "python3 が見つかりません。"; return 1; }

  if [[ ! -d .venv ]]; then
    run python3 -m venv .venv
  fi

  # shellcheck disable=SC1091
  source .venv/bin/activate

  run python -m pip install --upgrade pip setuptools wheel

  if [[ -f requirements.txt ]]; then
    run pip install -r requirements.txt
  elif [[ -f pyproject.toml ]]; then
    if command -v poetry >/dev/null 2>&1; then
      run poetry install
    else
      warn "pyproject.toml はありますが poetry がないため pip install -e . を試します。"
      run pip install -e .
    fi
  elif [[ -f setup.py ]]; then
    run pip install -e .
  fi
}

copy_env_examples() {
  log ".env ファイル初期化"

  while IFS= read -r -d '' env_example; do
    local target="${env_example%.example}"
    if [[ ! -f "$target" ]]; then
      run cp "$env_example" "$target"
      echo "  -> created $target"
    fi
  done < <(find . -type f \( -name ".env.example" -o -name "*.env.example" \) -print0)
}

post_setup_checks() {
  log "Post-setup checks"

  if [[ -f package.json ]]; then
    node -v || true
    npm -v || true
  fi

  if [[ -d .venv ]]; then
    # shellcheck disable=SC1091
    source .venv/bin/activate
    python --version || true
  fi
}

log "Repository root: $ROOT_DIR"
install_node_deps
setup_python_env
copy_env_examples
post_setup_checks

log "Setup completed."

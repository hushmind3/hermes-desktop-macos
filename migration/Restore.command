#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v hermes >/dev/null 2>&1; then
  echo '먼저 새 맥에 Hermes를 설치하고 앱을 종료한 뒤 다시 실행하세요.'
  exit 1
fi
key_path="${1:-}"
if [ -z "$key_path" ]; then
  printf '별도로 보관한 복원 키 파일의 경로를 입력하세요: '
  IFS= read -r key_path
fi
exec /usr/bin/env python3 ./restore.py --key "$key_path"

#!/usr/bin/env bash
# Times `biome lint src/consumer.ts` on several Biome versions (60s cap each).
# Requires `timeout` (GNU coreutils; `gtimeout` on macOS via `brew install coreutils`).
set -u
T=$(command -v timeout || command -v gtimeout)
npm install --silent --no-audit --no-fund
for v in 2.5.12 2.5.13 2.5.14 2.5.15; do
  npm install --silent --no-save --no-audit --no-fund "@biomejs/biome@$v"
  s=$(date +%s)
  "$T" 60 npx --no-install biome lint src/consumer.ts >/dev/null 2>&1
  rc=$?
  e=$(date +%s)
  if [ "$rc" = 124 ]; then echo "biome $v: TIMEOUT (>60s)"; else echo "biome $v: $((e - s))s"; fi
done

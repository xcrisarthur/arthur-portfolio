#!/usr/bin/env bash
# Salin portfolio-web + portfolio-api dari homelabz ke repo publik ini.
set -euo pipefail

HOMELABZ="${HOMELABZ:-$HOME/homelabz}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -d "$HOMELABZ/portfolio-web" ]]; then
  echo "Homelabz tidak ditemukan: $HOMELABZ" >&2
  exit 1
fi

RSYNC=(rsync -av --delete)
"${RSYNC[@]}" "$HOMELABZ/portfolio-web/" "$ROOT/portfolio-web/"
"${RSYNC[@]}" "$HOMELABZ/portfolio-api/" "$ROOT/portfolio-api/"
cp "$HOMELABZ/deploy/nginx-9991.conf" "$ROOT/deploy/nginx.conf"

echo "==> Sync selesai: $ROOT"
echo "    Commit di arthur-portfolio, lalu push ke GitHub."

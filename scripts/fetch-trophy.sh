#!/bin/bash
# Downloads the official FIFA World Cup trophy image to public/images/
# Run: bash scripts/fetch-trophy.sh

set -e
OUT="public/images/world-cup-trophy.png"
mkdir -p public/images

echo "Downloading official FIFA World Cup trophy image..."

curl -fsSL -A "Mozilla/5.0" \
  -o "$OUT" \
  "https://upload.wikimedia.org/wikipedia/commons/6/67/FIFA_World_Cup_Trophy_%282%29.jpg" \
  || curl -fsSL -A "Mozilla/5.0" \
  -o "$OUT" \
  "https://commons.wikimedia.org/wiki/Special:FilePath/FIFA%20World%20Cup.png"

echo "Saved to $OUT"
file "$OUT"

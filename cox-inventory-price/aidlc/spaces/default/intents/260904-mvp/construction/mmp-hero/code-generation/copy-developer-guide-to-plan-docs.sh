#!/usr/bin/env bash
# Copy developer guide to personal plan docs folder.
set -euo pipefail

SRC="/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price/aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/cox-inventory-price-marketplace-placements-developer-guide.md"
DEST_DIR="/Users/yesun.joung/github/0_AI_plan_docs"
DEST="$DEST_DIR/cox-inventory-price-marketplace-placements-developer-guide.md"

mkdir -p "$DEST_DIR"
cp "$SRC" "$DEST"
echo "Copied to $DEST"

#!/usr/bin/env bash
# Apply mmp-ranking (U3) changes to workspace mirror + FRE ship repo.
set -euo pipefail

ROOT="/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price"
ST="$ROOT/aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/staging-mmp-ranking/apps/fre/scopes"
MIRROR="$ROOT/apps/fre/scopes"
FRE="/Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes"

copy_pair() {
  local rel="$1"
  cp "$ST/$rel" "$MIRROR/$rel"
  cp "$ST/$rel" "$FRE/$rel"
  echo "copied $rel"
}

copy_pair "caranddriver/components/content/review/vehicle-ranking/vehicle-ranking-card.jsx"
copy_pair "caranddriver/components/content/review/vehicle-ranking/vehicle-ranking-card.test.jsx"
copy_pair "caranddriver/components/content/review/vehicle-ranking/utils.js"
copy_pair "caranddriver/components/content/review/vehicle-ranking/index.jsx"

python3 <<'PY'
from pathlib import Path

fragment_rel = Path("caranddriver/components/content/fragments/vehicle-model.js")
roots = [
    Path("/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price/apps/fre/scopes"),
    Path("/Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes"),
]

old_blocks = [
    """\t\t\t\t\t\t\t\tprice {
\t\t\t\t\t\t\t\t\tlow
\t\t\t\t\t\t\t\t\tis_estimate
\t\t\t\t\t\t\t\t}""",
    """\t\t\t\t\t\t\t\t\tprice {
\t\t\t\t\t\t\t\t\t\tlow
\t\t\t\t\t\t\t\t\t}""",
]

new_blocks = [
    """\t\t\t\t\t\t\t\tprice {
\t\t\t\t\t\t\t\t\tlow
\t\t\t\t\t\t\t\t\thigh
\t\t\t\t\t\t\t\t\tis_estimate
\t\t\t\t\t\t\t\t\tmarketplace {
\t\t\t\t\t\t\t\t\t\thigh
\t\t\t\t\t\t\t\t\t\tlow
\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t}""",
    """\t\t\t\t\t\t\t\t\tprice {
\t\t\t\t\t\t\t\t\t\tlow
\t\t\t\t\t\t\t\t\t\thigh
\t\t\t\t\t\t\t\t\t\tis_estimate
\t\t\t\t\t\t\t\t\t\tmarketplace {
\t\t\t\t\t\t\t\t\t\t\thigh
\t\t\t\t\t\t\t\t\t\t\tlow
\t\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\t}""",
]

for root in roots:
    path = root / fragment_rel
    text = path.read_text()
    if "ranked_list" not in text or "marketplace {" in text.split("ranked_list", 1)[1].split("price {", 3)[2]:
        print(f"{root.name}: fragment already patched or unexpected shape — skip")
        continue
    updated = text
    for old, new in zip(old_blocks, new_blocks):
        if old not in updated:
            raise SystemExit(f"{root.name}: could not find ranked_list price block:\n{old[:80]}...")
        updated = updated.replace(old, new, 1)
    path.write_text(updated)
    print(f"{root.name}: vehicle-model.js ranked_list price blocks patched")
PY

echo "Applied mmp-ranking to mirror and FRE."

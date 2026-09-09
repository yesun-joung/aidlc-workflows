#!/usr/bin/env bash
# Apply mmp-hero price-section changes to workspace mirror + FRE ship repo.
set -euo pipefail

ROOT="/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price"
ST="$ROOT/aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/staging/apps/fre/scopes/caranddriver"
MIRROR="$ROOT/apps/fre/scopes/caranddriver"
FRE="/Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver"

cp "$ST/components/content/review/hero-section/price-section/index.jsx" \
   "$MIRROR/components/content/review/hero-section/price-section/index.jsx"
cp "$ST/components/content/review/hero-section/price-section/index.test.jsx" \
   "$MIRROR/components/content/review/hero-section/price-section/index.test.jsx"
cp "$ST/components/content/review/hero-section/price-section/index.jsx" \
   "$FRE/components/content/review/hero-section/price-section/index.jsx"
cp "$ST/components/content/review/hero-section/price-section/index.test.jsx" \
   "$FRE/components/content/review/hero-section/price-section/index.test.jsx"

python3 <<'PY'
from pathlib import Path

patch = """\t\t\t\t\tvehicleModelId={
\t\t\t\t\t\tvehicleModels?.id != null ? String(vehicleModels.id) : undefined
\t\t\t\t\t}
\t\t\t\t\tmarketplaceLow={price?.marketplace?.low}
\t\t\t\t\tmarketplaceHigh={price?.marketplace?.high}
\t\t\t\t\tmarketStatus={yearObject?.market_status}"""

replacements = [
    "\t\t\t\t\tvehicleModelId={vehicleModels?.id}\n\t\t\t\t\tmarketplaceLow={price?.marketplace?.low}\n\t\t\t\t\tmarketplaceHigh={price?.marketplace?.high}",
    "\t\t\t\t\tvehicleModelId={\n\t\t\t\t\t\tvehicleModels?.id != null ? String(vehicleModels.id) : undefined\n\t\t\t\t\t}\n\t\t\t\t\tmarketplaceLow={price?.marketplace?.low}\n\t\t\t\t\tmarketplaceHigh={price?.marketplace?.high}",
]

for label, path in [
    ("mirror", Path("/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price/apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx")),
    ("FRE", Path("/Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx")),
]:
    text = path.read_text()
    if "marketStatus={yearObject?.market_status}" in text:
        print(f"{label}: hero already has marketStatus")
        continue
    updated = text
    for old in replacements:
        if old in updated:
            updated = updated.replace(old, patch, 1)
            break
    if updated == text:
        raise SystemExit(f"{label}: could not patch hero index.jsx")
    path.write_text(updated)
    print(f"{label}: hero index patched")
PY

echo "Applied price-section + hero wrapper to mirror and FRE."

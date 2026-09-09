# Branch setup — mmp-hero Bolt 1 (U2)

Two repos hold changes. Create a matching branch in each before committing.

Suggested branch name: **`mmp-hero-marketplace-price-b7e2`**

## 1. AIDLC workspace (`cox-inventory-price`)

AIDLC record + FRE mirror under `apps/fre/`.

```bash
cd /Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price

# Create branch from current HEAD (keeps uncommitted work on the branch)
git checkout -b mmp-hero-marketplace-price-b7e2

# Stage AIDLC artifacts + mirror
git add \
  aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/ \
  apps/fre/scopes/caranddriver/

# Optional: U1 mirror if not already on main
git add apps/fre/scopes/autos/utils/map-marketplace-price.js \
        apps/fre/scopes/autos/utils/map-marketplace-price.test.js

git status
```

Commit when ready (example message):

```bash
git commit -m "$(cat <<'EOF'
Add mmp-hero codegen artifacts and FRE mirror for marketplace hero price.

Includes plan approval record, price-section mapper wiring, vehicleModelId guard, and unit tests.
EOF
)"
```

## 2. FRE ship repo (`media-Platform/services/fre`)

Production code for the CAD review-article hero.

```bash
cd /Users/yesun.joung/GitHub/media-Platform/services/fre

git checkout -b mmp-hero-marketplace-price-b7e2

# Copy mirror → FRE if mirror is ahead
MIRROR=/Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price/apps/fre/scopes/caranddriver
FRE=apps/fre/scopes/caranddriver

cp "$MIRROR/components/content/fragments/vehicle-model.js" \
   "$FRE/components/content/fragments/vehicle-model.js"
cp "$MIRROR/components/content/review/hero-section/index.jsx" \
   "$FRE/components/content/review/hero-section/index.jsx"
cp "$MIRROR/components/content/review/hero-section/price-section/index.jsx" \
   "$FRE/components/content/review/hero-section/price-section/index.jsx"
cp "$MIRROR/components/content/review/hero-section/price-section/index.test.jsx" \
   "$FRE/components/content/review/hero-section/price-section/index.test.jsx"

git add \
  apps/fre/scopes/caranddriver/components/content/fragments/vehicle-model.js \
  apps/fre/scopes/caranddriver/components/content/review/hero-section/index.jsx \
  apps/fre/scopes/caranddriver/components/content/review/hero-section/price-section/

git status
```

Run tests before commit:

```bash
cd apps/fre/scopes/caranddriver
npm test -- components/content/review/hero-section/price-section/index.test.jsx
```

Commit when green:

```bash
git commit -m "$(cat <<'EOF'
Wire CAD review-hero price slot to mapMarketplacePrice (U2 mmp-hero).

Extend year price fragment with marketplace fields; guard mapper when model id absent.
EOF
)"
```

## 3. Push (when ready)

```bash
# AIDLC workspace (adjust remote/default branch as needed)
cd /Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price
git push -u origin mmp-hero-marketplace-price-b7e2

# FRE
cd /Users/yesun.joung/GitHub/media-Platform/services/fre
git push -u origin mmp-hero-marketplace-price-b7e2
```

Replace branch suffix `b7e2` if your team uses a Jira prefix (e.g. `COPLAT-1234-mmp-hero-marketplace-price-b7e2`).

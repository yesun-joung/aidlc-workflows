# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

None. (affirmed 2026-09-04)
## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
- WF-2 MMP ranking, WF-3 vehicle-card backs, and WF-4 category cards use only the low marketplace price as starting at {low}. (learned 2026-09-04) <!-- cid:260904-mvp:rough-mockups:aea925980f3a57f53a131f4d7332471214d60245aa95f9331a0d06cdedb378ea -->
- Q1 C hide-the-slot applies only while the price read is in flight. After the read settles, the slot returns with marketplace copy or the Original MSRP that slot already uses. The user confirmed this reading on the consolidated summary. (learned 2026-09-08) <!-- cid:260904-mvp:refined-mockups:5cc762a3c1afe6a19ede240cc47aa47472c2af01113c952d4582c68ec3f768ce -->
- One shared marketplace-price component serves all four placements so the hide, copy, and fallback rules stay in one place. (learned 2026-09-08) <!-- cid:260904-mvp:domain-design:f9e0726e7a0555c7a5448127ac1880d11cb704fd98d1673886f91d7036ecbaea -->
- Each placement keeps its own vehicle_models query file. Add price { marketplace { high low } } on those queries. Do not add a shared fetch. (learned 2026-09-08) <!-- cid:260904-mvp:domain-design:209eb656b33afc9547c87021f98ed87420144f46ec27a6e1bbb481e9b8aee5ba -->
- Bolt 1 is U1 (marketplace-price-mapper) + U2 (mmp-hero) together as the walking skeleton; Bolts 2–4 are one placement each (ranking, card back, category card), serial on the FRE tree. (learned 2026-09-08) <!-- cid:260904-mvp:delivery-planning:aa1d7b07eae0b5afca6592bd6769dcf318628f183378ca83191f5b3d67b9ba27 -->

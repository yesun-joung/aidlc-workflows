# Plan approval runbook — mmp-hero

Your **Approve Plan** choice is recorded in `code-generation-questions.md`, but application writes remain blocked until the audit receipt chain completes. Run these in a terminal from the project root (`cox-inventory-price`).

## 1. Fingerprint (if `[Approval Fingerprint]:` is blank)

Clear `[Answer]:` to blank in `code-generation-questions.md`, then:

```bash
cd /Users/yesun.joung/GitHub/aidlc-workflows/cox-inventory-price
bun .cursor/tools/aidlc-testing-posture.ts fingerprint --unit mmp-hero
```

Paste the printed `sha256:…` into the `[Approval Fingerprint]:` line in `code-generation-questions.md`.

## 2. Decision challenge

```bash
bun .cursor/tools/aidlc-log.ts decision \
  --stage code-generation \
  --unit mmp-hero \
  --checkpoint plan-approval \
  --session ff187898-df8c-4880-a54c-02f83fdf0236 \
  --questions-file aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/code-generation-questions.md \
  --decision "Approve this exact Code Generation plan?" \
  --options "Approve Plan,Request Changes"
```

## 3. Human approval (in chat — required)

**Do not skip this step.** The `answer` command only works after Cursor records your choice from a **chat message**, not from the terminal alone.

Send exactly one of these as a **new chat message** (typo-safe options):

- `Approve Plan`
- `1`

**Will not work:** `Approve Pand`, editing `[Answer]:` only, or running `answer` from the terminal without a matching chat message first.

The `beforeSubmitPrompt` hook writes a session `response-*.json` when your chat text matches an offered option.

## 4. Set questions file answer

Ensure `code-generation-questions.md` contains:

```markdown
[Answer]: Approve Plan
```

## 5. Record answer (terminal)

```bash
bun .cursor/tools/aidlc-log.ts answer \
  --stage code-generation \
  --unit mmp-hero \
  --checkpoint plan-approval \
  --session ff187898-df8c-4880-a54c-02f83fdf0236 \
  --questions-file aidlc/spaces/default/intents/260904-mvp/construction/mmp-hero/code-generation/code-generation-questions.md \
  --details "Approve Plan"
```

If step 5 still fails with *"requires the actual offered choice"*, repeat from step 3: send **`Approve Plan`** in chat, then run step 5 again (do not re-run `decision` unless step 5 says the fingerprint or challenge is stale).

## 6. Continue codegen

After `PLAN_APPROVAL_RECORDED` appears in the audit shard, ask the agent to apply `code-generation/staging/` into:

- FRE: `/Users/yesun.joung/GitHub/media-Platform/services/fre/apps/fre/scopes/caranddriver/…`
- Workspace mirror: `cox-inventory-price/apps/fre/scopes/caranddriver/…`

Apply fragment and hero patches from `staging/VEHICLE-MODEL-FRAGMENT-PATCH.md` and `staging/HERO-INDEX-PATCH.md`.

Run tests (see `unit-test-instructions.md`), then complete code-generation review gate.

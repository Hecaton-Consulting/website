# Hecaton Site — Execution Progress

Live status tracker for the implementation plan at `docs/superpowers/plans/2026-04-19-hecaton-consulting-site.md`. Updated as work completes. Persists across token-limit session breaks.

**Last updated:** 2026-04-19 (post config+theme batch)

---

## Working state

- **Branch:** `feat/noissue/hecaton-site` (off `main` which has 4 unpushed docs commits: 3 spec + 1 plan)
- **Pushed to remote:** no
- **PR opened:** no
- **Execution mode:** Subagent-Driven Development, batched (user approved batching trivial tasks)
- **Build status:** failing on `src/pages/index.astro` importing `astro-swiper` (expected — Phase 4 rewrites this page)

---

## Phase 0 — Cleanup ✅ DONE

Branch created, phase 0 tasks 0.2–0.6 complete + one extra `.gitignore` fix.

Commits on branch:
```
<sha> chore: track package-lock.json for reproducible ci builds   ← .gitignore fix
eb5623c chore: remove stock template images and icons               ← Task 0.6
85f662d chore: delete blog, shortcodes, helpers, and template-only pages  ← Task 0.5
a796411 chore: simplify astro config, drop react and auto-imports   ← Task 0.4
59fdde1 chore: prune unused npm dependencies                        ← Task 0.3
53dfb0f chore: remove sitepins and netlify config                   ← Task 0.2
d9efbd0 docs: hecaton consulting site implementation plan            ← on main, pre-branch
```

Notes:
- `src/layouts/components/Base.astro` was already absent before 0.5 — no-op.
- `.gitignore` was excluding `package-lock.json`; changed to track it (needed for `npm ci` in Actions).

---

## Phase 1 — Foundation 🚧 IN PROGRESS

### 1.1 config.json — ✅ DONE (`be210fe`)
### 1.2 theme.json — ✅ DONE (`77c22f9`)
### 1.4 menu.json — ✅ DONE (`66d957d`)
### 1.5 social.json — ✅ DONE (`86f303a`)

Re-dispatched after token-limit break. Second dispatch (id `a0ae80528539c389a`) landed all four.

### 1.3 astro.config.mjs Fonts API — 🚧 IN PROGRESS (dispatching next)
### 1.6 Base.astro — 🚧 IN PROGRESS (dispatching next)
### 1.7 CSS overhaul — 🚧 IN PROGRESS (dispatching next)

---

## Phase 2 — Content collections ⏸ NOT STARTED
## Phase 3 — Components ⏸ NOT STARTED
## Phase 4 — Pages ⏸ NOT STARTED
## Phase 5 — Deploy (CNAME + Actions) ⏸ NOT STARTED
## Phase 6 — Services runbook ⏸ NOT STARTED
## Phase 7 — QA ⏸ NOT STARTED

---

## Resume checklist (for next session)

1. Confirm branch: `git branch --show-current` → `feat/noissue/hecaton-site`
2. Confirm working tree clean: `git status`
3. Confirm commit count: `git log --oneline feat/noissue/hecaton-site ^main | wc -l` → expect 1 (.gitignore fix; the other 5 are shared with main's docs chain)

   Actually: `git log --oneline -8` should show the sequence above starting with the `.gitignore` commit.
4. Verify Phase 1 config files are STILL TEMPLATE-SHAPED (not yet rewritten) by spot-checking:
   - `head -5 src/config/config.json` → should still show `"title": "Hecaton Light Astro"` (template) not `"title": "Hecaton"` (new)
   - If already rewritten, update this doc and skip to next task.
5. Re-dispatch the Phase 1 config + theme batch subagent (prompt already composed above in plan).
6. After every phase/batch, update this doc with:
   - ✅ DONE / ⏳ dispatched / 🚧 IN PROGRESS / ⏸ NOT STARTED
   - New commit SHAs if applicable
   - Any deviations from the plan (fixes, workarounds, concerns)

---

## Open concerns carried forward

- **Portrait image:** Homepage about-teaser and about page both reference `/images/jaime-portrait.jpg`. File does not exist yet — Phase 7 QA and runbook surface this to Jaime.
- **Astro experimental Fonts API:** Task 1.3 imports `{ Font } from "astro:assets"`. If Astro 5.14 exposes this under a different path (`astro:fonts` etc.), the build will surface the error on Task 1.3 Step 2 — switch to the correct path inline.
- **Cal.com slug `hecaton`:** Plan assumes it's available. Runbook step 1.1 asks Jaime to confirm; if taken, update `config.cal_com.event_url` and any hardcoded references.
- **DNS + Pages setup:** deferred to Phase 6 runbook (manual steps for Jaime, not in code).

---

## Legend

- ✅ DONE — committed, verified
- 🚧 IN PROGRESS — partial, actively being worked
- ⏳ dispatched — subagent launched, awaiting result
- ⏸ NOT STARTED — pending upstream dependencies
- ❌ BLOCKED — needs user input or decision

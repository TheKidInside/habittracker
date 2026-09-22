# Claude Design Prompt — Patch Desktop "Worksheet" Dashboard

> Paste everything inside the `─── PROMPT ───` block into Claude (claude.ai, with Artifacts on).
> It asks Claude to design ONE self-contained HTML mockup: a landing page that opens into a
> full-screen desktop dashboard that feels like an open paper journal / planner worksheet.
> This is a **design mockup with realistic placeholder data** — not wired to the real backend.

---

─── PROMPT ───

You are a senior product designer. Design a **desktop web dashboard** for an existing app called **Patch** — a personal habit + identity tracker with a voice journal. Deliver it as a **single self-contained HTML file** (inline CSS + minimal vanilla JS, no external libraries, no build step) rendered as an Artifact.

## The core idea
Patch today is a phone-first PWA. I want a **desktop-first view that maximizes the whole screen** and feels less like an app and more like **an open journal spread / a printed daily worksheet / a bullet-journal planner page**. The screen is my desk. When I sit down at my computer, this is the page I write my day on and check things off.

Two states in one artifact:
1. **A landing page** — a calm, editorial "open the notebook" moment: the Patch name, today's date written like a planner header, a one-line intention prompt, and a single "Open today's page" action that reveals the dashboard.
2. **The dashboard / worksheet** — the full-bleed working surface described below.

## What Patch is (so the mockup uses real concepts, not lorem ipsum)
Patch is built on identity-based habits (James Clear, *Atomic Habits*). Each habit each day is in one of four states:
- **Full** (green) — completed in full
- **Never Zero** (orange) — didn't do it fully, but kept the identity alive (the point is the streak of *showing up*, never a zero day)
- **Missed** (grey) — didn't happen
- **Unlogged** (blank)

There is also a **"Just Do It" (JDI)** counter — a running tally of no-procrastination wins for the day (a number you increment). And a **voice/typed journal** whose entries carry tags and export to an Obsidian "second brain."

## The design language — "Paper · Warm Editorial"
Match this exactly; it's the app's existing identity.
- Background (paper): `#faf9f6` · Cards: `#fffcf5` · Text: `#1f2328` · Muted: `#9ca3af` · Border: `#e7e4db`
- Primary accent (gold/amber): `#c9952c` (bg `#fef6e4`, text `#8b6020`)
- Status — Full/green: `#5f7a5f` (bg `#eaf0e8`) · Never-Zero/orange: `#f97316` (bg `#fef3e2`) · Missed/grey: `#9ca3af` (bg `#f0ede8`)
- Journal tag hues — Ideas blue `#1d4ed8`/`#dbeafe` · Lessons green · Processing orange · Log gold · Topics teal `#0f766e` · People pink `#9d174d`
- Type: a clean system/editorial sans for UI; consider a warm serif for the big date + section headers to reinforce the "journal page" feeling. Generous line-height. Radius ~14px.
- **Texture cues that sell the worksheet metaphor** (subtle, tasteful, CSS-only): faint ruled lines or a dotted grid inside writing zones, a hint of a left margin rule, section headers underlined like a workbook, hand-checkable boxes. Never skeuomorphic-heavy — keep it modern editorial, like a beautifully typeset planner.

## Layout — maximize the screen
- **Full width, no narrow center column.** Use the entire viewport at ≥1280px as a multi-zone worksheet (CSS grid). Left rail = navigation/identity; the rest = the working spread.
- **Left sidebar nav** (persistent): Patch wordmark, then Today · Calendar · Journal · Workout · Settings. Today is active.
- **The Today "worksheet" spread** (the hero of the dashboard) is a multi-column grid that shows the whole day at once — no scrolling to find things:

  1. **Date & intention header** — today's date written like a planner ("Thursday · 7 August"), plus a single editable "Today I'm showing up as…" intention line.
  2. **Habit checklist worksheet** — the day's habits as a hand-checkable list/grid. Each row: emoji, name, and a 4-state control (Unlogged → Full → Never Zero → Missed) shown as a satisfying tactile checkbox/segmented mark, colored per the status palette. Include a small "streak" indicator per habit. Use realistic habits: Journal 📓, Bible Reading 📖, Morning Prayer 🙏, One Lever ID 🎯, Never Zero 🔥, Push-ups 💪, Patience 🧘, Name It to Tame It 🏷️, Evening Audit 📋.
  3. **Day summary tiles** — counts of Full / Never Zero / Missed, plus the **JDI** counter with − / + steppers styled in gold.
  4. **This-week strip** — a 7-day mini dot-grid (habits × last 7 days) like the corner of a paper habit tracker, so I see momentum at a glance.
  5. **Today's reflection / journal** — an inline "worksheet" writing area with a prompt ("What have you learned today?"), a place to type, and a feed of the last few journal entries as index cards with their tag pills and dates.
  6. **Workout card** — today's split (e.g. "Push · Chest·Shoulders·Triceps"), a sets-done progress bar, and the exercise list (DB Floor Press 4×6–8, etc.).
  7. **Month heatmap** — a compact calendar heatmap of habit-completion color per day, echoing the Calendar view.

- Panels read as **worksheet sections on one spread**, not floating SaaS cards — think consistent margins, ruled dividers, and section labels in small-caps. It should look like something you could print.

## Interaction & feel
- Tactile and quiet. Checking a habit fills its mark with the status color; the "worksheet" responds like ink on paper (subtle, fast, no bouncy SaaS animation).
- The intention line and reflection area are directly writable.
- JDI −/+ updates the number inline.
- Keyboard-friendly; hover states on desktop.

## Technical constraints
- **One HTML file**, self-contained: inline `<style>` and a little vanilla `<script>`. No frameworks, no CDNs, no external images (use emoji + CSS for texture). If you use a web font, prefer system fonts or a single Google Font via `@import` — but a great result with system fonts alone is preferred.
- **Realistic placeholder data hard-coded** — several habits with mixed statuses, a JDI value like 3, 3–4 journal entries with tags, a partially-done workout, a month of heatmap data. Make it look *lived-in*, mid-week.
- **Theme-aware**: design primarily for the warm-paper light theme; add a tasteful dark variant via `prefers-color-scheme` (dark = warm charcoal paper, not pure black).
- Responsive: the full worksheet grid at ≥1280px; gracefully reflow to fewer columns down to ~1024px. (Mobile already exists — don't optimize below tablet.)
- No backend, no auth, no localStorage needed — it's a visual/interaction mockup I'll evaluate and then port into the real app.

## Deliverable
A single polished HTML artifact: the landing page, and the "Open today's page" action reveals the full worksheet dashboard. Prioritize the **Today worksheet spread** — that is the screen I'll live in. Make it something I'd want to open every morning.

─── END PROMPT ───

---

## How to use this
1. Open a new chat at **claude.ai** with Artifacts enabled.
2. Paste the block between `─── PROMPT ───` and `─── END PROMPT ───`.
3. Iterate: "make the habit worksheet the dominant zone", "more ruled-paper texture", "try a two-page-spread split", etc.
4. When you like a draft, bring the HTML back here and I'll port the layout into the real `index.html` (wiring it to the actual `habits` / `logs` / `journal` data and Firebase sync).

## Notes for porting later (real data shapes)
- `habits`: `[{ id, icon, name, locked? }]`
- `logs`: `{ "YYYY-MM-DD": { habits: { habitId: 'full'|'never-zero'|'missed' }, jdi: N, workout: {…} } }`
- `journal`: `[{ id, timestamp, date, prompt, tag, title, content, customTags:[{label,category}], exported }]`
- Status cycle order: `null → full → never-zero → missed → null`

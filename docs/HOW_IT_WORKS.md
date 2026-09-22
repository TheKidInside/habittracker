# Patch (Habit Tracker) — How It Works

A learning walkthrough of a **single-file vanilla + Firebase PWA** for daily habit
tracking, with a per-day counter and a calendar heat view. Read it next to
`index.html`.

> Skim **Part 1** (the mental model — note the whole-document sync), then **Part 2**
> (the patterns), then the map in **Part 3**. **Part 4** traces one tap through the
> day's log.

---

## Part 0 — Run it

It's a PWA — deploy to Firebase Hosting or serve over http/https (Auth won't run over
`file://`). Stack: one `index.html` (~3,000 lines, vanilla HTML+CSS+JS) using the
**modular Firebase SDK** (Auth + Firestore) with `localStorage` fallback, plus two
CDN libs — JSZip (backup export/import) and SortableJS (drag-reorder). "Paper · Warm
Editorial" theme.

---

## Part 1 — The big picture

### 1.1 Three data objects, one user document

The entire app is three things: `habits` (the list you track), `logs` (per-day
records), and `journal`. On the cloud these are stored as **one Firestore document
per user** — `users/{uid}` holding `{habits, logs, journal, lastUpdated}`.

That single choice defines everything: a change re-saves the whole document
(`setDoc`), and the realtime `onSnapshot` delivers the whole document back. It's the
opposite of the sibling Stash/Nestly apps (per-item docs) — simplest possible for a
small, single-user dataset. (See those apps' HOW_IT_WORKS for the per-item tradeoff.)

### 1.2 A day is a keyed log

Days are addressed by `dateKey(y,m,d)` → `"2026-08-10"`. `getLog(dk)` lazily creates
`{ habits:{}, jdi:0 }` for a day. `logs.habits[habitId]` holds that habit's **cycled
state** for the day; `logs.jdi` is a per-day numeric counter (the **JDI bar** — a
+/- tally shown on Today, as a row in the calendar, and in the day modal).

### 1.3 Local-first, then cloud, then realtime

```
 load() from localStorage         → instant render, even offline
 onAuthStateChanged → getDoc      → pull cloud copy on sign-in (or push local if first-time)
 onSnapshot(userDocRef)           → realtime: any change re-lands the whole doc → re-render
 persist()                        → writes BOTH localStorage and Firestore setDoc
```

The app renders from local data immediately and upgrades to cloud data when auth
resolves — no blank loading state.

---

## Part 2 — The patterns that repeat

### 2.1 Whole-document sync

`persist()` saves `habits`/`logs`/`journal` to `localStorage` then `setDoc`s the whole
object to `users/{uid}`. `onSnapshot` replaces all three in memory and re-renders the
active view. Simple and race-tolerant for one user across devices; not what you'd pick
for large or multi-user data.

### 2.2 Render-the-active-view on snapshot

The snapshot handler asks which view is active and calls just that render
(`renderToday` / `renderCalendar` / `renderJournal` / `renderSettings`). One update
path, minimal redraw.

### 2.3 In-code, id-based migrations

Data evolves without a migration table: `HABIT_RENAMES` maps a habit `id` to a new
name/icon and `migrateHabitNames` applies it on every load (local and cloud), persisting
if it changed. A locked Journal habit (`h-journal`) is force-inserted if missing. Old
data self-heals on open.

### 2.4 Tap to cycle a day's state

Habits aren't just done/not-done — `cycleHabit(id)` advances a habit's state for the
day through a small set (with human labels like `Missed`), writing into
`logs[dk].habits[id]`. The calendar renders each day's states as a heat row; the JDI
counter has its own +/- controls (`adjJDI`) on Today, in the calendar row, and in the
modal.

### 2.5 Backup as a first-class feature

`exportBackup` (JSZip) bundles the data to a downloadable file; `importBackup` reads it
back. Because the whole state is three plain objects, backup/restore is trivial —
another payoff of the simple data model.

### 2.6 CDN dependencies (the one caveat)

JSZip and SortableJS load from CDNs in `<head>`. That's the single external
dependency in an otherwise self-contained file — offline-first for data, but those two
features need the scripts to have loaded.

---

## Part 3 — The map (hot functions)

Navigate `index.html` by function:
- **Storage/auth:** `load`, `persist`, `onAuthStateChanged` handler, `onSnapshot`
  subscription, `migrateHabitNames`.
- **Day model:** `dateKey`, `todayKey`, `getLog`.
- **Today view:** `renderToday`, `cycleHabit`, `adjJDI`.
- **Calendar:** `changeMonth`, `renderCalendar`, day `openModal`/`renderModalHabits`/
  `cycleModalHabit`/`adjModalJDI`.
- **Settings:** `renderSettings`, `addHabit`, `removeHabit`, `exportBackup`,
  `importBackup`.
- **Reorder:** `initHabitSortable`, `reorderHabitsFromDOM` (SortableJS).
- **Router:** `go(view)`.
- `sw.js` = offline PWA shell.

---

## Part 4 — One tap, Today → calendar

1. On Today you tap a habit → `cycleHabit(id)` reads `getLog(todayKey())` and advances
   `logs[dk].habits[id]` to its next state.
2. `persist()` writes `localStorage` and `setDoc`s the whole `users/{uid}` document.
3. `renderToday` redraws the row in its new state.
4. On your other device, `onSnapshot` fires with the updated document → replaces
   `habits/logs/journal` → re-renders whatever view is active there.
5. Open History → `renderCalendar` reads `logs` and paints today's cell with the new
   state (and the JDI count as its own row). Same data, different view.

---

## Part 5 — How to change things (recipes)

| You want to… | Where | What to do |
|---|---|---|
| Add a habit-day state | `cycleHabit` + the state label map + calendar CSS | Extend the cycle; style the new state |
| Rename a habit safely | `HABIT_RENAMES` | Map its `id` → new name/icon; applies on next load |
| Add a view | `go()` + a `render*` + the snapshot handler | Register it so snapshots re-render it |
| Change the JDI counter | `adjJDI` / `.jdi-*` CSS | It's a per-day integer in `logs[dk].jdi` |
| Backup format | `exportBackup`/`importBackup` | Whole-state is three plain objects |

**Golden rule:** it's one document per user — every write re-saves the whole thing and
every snapshot replaces the whole thing. That simplicity is the design; don't reach for
per-item docs unless the data outgrows it.

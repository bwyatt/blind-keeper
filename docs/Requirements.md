# Requirements

> **Status:** Ready for review

## Functional Requirements

### Ante & Boss Tracking

| ID | Requirement |
| --- | --- |
| FR-1 | Track the current Ante number in a Balatro run (Ante can go below 1 via voucher decrements; Antes 1–39 under normal progression) |
| FR-2 | Select which boss blind was played (faced) in each Ante |
| FR-3 | Record bosses that were rerolled before the faced boss (multiple rerolls per Ante supported) |
| FR-4 | Display boss selection with both icon and name |
| FR-5 | Only show eligible bosses for the current Ante based on game rules (minimum ante, appearance tracking, showdown rules). Antes at or below 0 use the same boss pool as Ante 1 |
| FR-6 | Boss selection grid sorted by minimum Ante (ascending), then alphabetically within each group |
| FR-7 | Selecting the faced boss auto-advances the Ante by 1 |
| FR-8 | A "-1" button allows the user to reduce the current Ante (for Hieroglyph/Petroglyph vouchers). Limited to 2 uses per run. Requires confirmation before applying |
| FR-9 | Repeated Antes produce separate sequential entries (not overwritten) |
| FR-10 | Showdown Blinds appear only at Antes 8, 16, 24, 32; rerolling on a Showdown Ante always yields another Showdown Blind |

### Interaction Model

| ID | Requirement |
| --- | --- |
| FR-11 | On mobile: tap a boss to mark as faced; long-press to mark as rerolled |
| FR-12 | On desktop: explicit "Faced" and "Rerolled" buttons per boss |
| FR-13 | Run history (past Antes with boss encounters) is behind a toggle/tab, not always visible |

### Error Correction

| ID | Requirement |
| --- | --- |
| FR-14 | Undo button to revert the most recent Ante entry |
| FR-15 | Inline edit of any past Ante entry (change faced boss, add/remove rerolls) |
| FR-16 | Editing a past entry silently accepts the change; boss availability for the current Ante is recalculated based on updated history |

### Run Management

| ID | Requirement |
| --- | --- |
| FR-17 | Support multiple concurrent active runs (max 10) |
| FR-18 | Maintain history of completed runs (max 10; oldest evicted when exceeded) |
| FR-19 | Allow switching between active runs |
| FR-20 | Runs are identified by a user-provided name |
| FR-21 | Run switcher displays run name and start date/time (device local time) |
| FR-22 | Runs remain active until the user explicitly ends them or Ante 39 boss is faced (auto-complete) |
| FR-23 | User can manually end a run at any time (moving it to history) |
| FR-24 | Confirmation prompt when ending a run before Ante 39 is completed |
| FR-25 | No outcome label (won/lost) required when ending a run |
| FR-26 | When the active run limit (10) is reached, prompt to delete the oldest active run or all active runs |

### Data Management

| ID | Requirement |
| --- | --- |
| FR-27 | Persist all run state across browser sessions via localStorage |
| FR-28 | User can delete individual runs (active or completed) |
| FR-29 | "Clear all" option (wipes active and completed runs) with confirmation |
| FR-30 | "Clear completed" option (wipes only completed runs) with confirmation |
| FR-31 | No cross-device sync; all data local to one browser |

### Boss Availability Rules (from Balatro wiki)

- Each boss has a minimum Ante at which it can first appear
- Ante 1 eligible bosses: The Hook, The Club, The Psychic, The Goad, The Window, The Manacle, The Head, The Pillar
- Additional bosses unlock at Antes 2, 3, 4, 5, and 6
- A boss won't repeat until all eligible bosses have appeared once (played or rerolled counts as an appearance)
- Showdown Blinds (Amber Acorn, Verdant Leaf, Violet Vessel, Crimson Heart, Cerulean Bell) appear only at Antes that are multiples of 8
- Rerolling on a Showdown Ante always yields another Showdown Blind; other Antes always yield a regular Boss Blind

### Out of Scope (for now)

- Stake level tracking
- Small/Big Blind skip tracking
- Cross-device sync / export-import

## Technical Requirements

| ID | Requirement |
| --- | --- |
| TR-1 | Single-page application, no server back-end |
| TR-2 | Minimal page size; optimize for loading speed |
| TR-3 | Responsive design for mobile, tablet, and desktop |
| TR-4 | Preact with hooks as the UI framework |
| TR-5 | TypeScript for type safety |
| TR-6 | Vite as the build tool |
| TR-7 | Plain CSS with custom properties for styling |
| TR-8 | Boss icons stored as local assets in the repo (extracted from Balatro wiki) |
| TR-9 | Dark and light theme support via `prefers-color-scheme` and manual toggle (CSS custom properties) |
| TR-10 | Theme preference persisted in a cookie (localStorage reserved for run data) |
| TR-11 | No authentication, analytics, or user tracking |
| TR-12 | No cookies except theme preference |
| TR-13 | Deployable to GitHub Pages; portable to other static hosting |
| TR-14 | Unit tests (Vitest) for boss availability logic |
| TR-15 | Component tests (Preact Testing Library) for key interactions |
| TR-16 | No E2E tests initially |
| TR-17 | GitHub Actions CI: lint, type-check, test on every PR |
| TR-18 | Auto-deploy to GitHub Pages on merge to `main` |
| TR-19 | Gitflow branching: feature branches → `develop` → `main` |
| TR-20 | Local development via Vite dev server (build & run locally) |

## Non-Functional Requirements

| ID | Requirement |
| --- | --- |
| NFR-1 | Accessibility is a priority: semantic HTML, keyboard navigation, ARIA labels on all interactive elements |
| NFR-2 | Page load speed prioritized over visual complexity |
| NFR-3 | Responsive layout functional on mobile, tablet, and desktop |

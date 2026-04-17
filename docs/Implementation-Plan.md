# Implementation Plan

> **Status:** Ready for review

## Feature Description

Blind Keeper is a lightweight web application that helps Balatro players track which boss blinds they have encountered during a run. It accounts for the game's boss availability rules to show only eligible bosses for each Ante, supports multiple concurrent runs, and persists state in the browser for seamless resumption.

## Requirements Summary

See [Requirements.md](./Requirements.md) for full details. See [Architecture.md](./Architecture.md) for technical design and data model.

## Documentation and Tests

### Documentation

- **README.md** — Project overview, usage instructions, local development setup
- **docs/Architecture.md** — Technical architecture and data model
- **docs/Requirements.md** — Functional, technical, and non-functional requirements
- **docs/Decisions.md** — Design decisions log from planning interview

### Test Plan

| Area | Tool | Coverage |
| --- | --- | --- |
| Boss availability logic | Vitest | All ante ranges, showdown detection, appearance cycling, edge cases (ante reduction, repeated antes) |
| localStorage persistence | Vitest | Serialization/deserialization, run limits, eviction logic |
| Boss selection interactions | Preact Testing Library | Tap/click to face, long-press to reroll, undo, inline edit |
| Run management | Preact Testing Library | Create, switch, end, delete runs; confirmation prompts |
| Theme toggle | Preact Testing Library | Toggle between dark/light; cookie persistence |

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| localStorage limits (~5 MB) | Low — data is small | Cap at 10 active + 10 completed runs; monitor serialized size |
| Boss data changes in future Balatro updates | Medium | Externalize boss data into a separate TypeScript data file for easy updates |
| Long-press detection varies across devices/browsers | Medium | Use well-tested timing threshold (~500ms); provide visual feedback during press; desktop has explicit buttons as fallback |
| Boss icon licensing / availability | Low | Icons are from a CC BY-NC-SA wiki; attribute appropriately; store locally to avoid external dependency |
| Browser compatibility | Low–Medium | Target modern evergreen browsers (Chrome, Firefox, Safari, Edge); test on iOS Safari specifically |
| Accessibility of custom interactions | Medium | Ensure all actions are keyboard-accessible; long-press has a keyboard equivalent; ARIA roles on boss grid items |

## Implementation Phases

### Phase 1: Project Scaffolding & Infrastructure

**Goal:** Set up the development environment, build pipeline, and deployment infrastructure so all subsequent work lands on a solid foundation.

**Steps:**

1. Initialize Vite + Preact + TypeScript project
2. Configure ESLint, Prettier, and TypeScript strict mode
3. Set up Vitest and Preact Testing Library
4. Create CSS custom property foundation (theme variables for dark/light)
5. Set up GitHub Actions workflow: lint, type-check, test on PR
6. Set up GitHub Actions workflow: deploy to GitHub Pages on merge to `main`
7. Create `develop` branch; configure repo branch protection rules
8. Add `.gitignore` for build output, `node_modules`, `.tmp` files
9. Write initial README with project overview and local dev instructions

**Exit Criteria:**

- `npm run dev` starts local dev server
- `npm run build` produces a working static site
- `npm test` runs and passes (placeholder test)
- PR to `develop` triggers CI; merge to `main` triggers deploy
- Empty app renders in the browser with dark/light theme switching

---

### Phase 2: Boss Data & Availability Engine

**Goal:** Implement the core game logic as pure TypeScript modules with comprehensive tests, independent of any UI.

**Steps:**

1. Create the boss blind dataset (`src/data/bosses.ts`) with all 28 boss blinds (23 regular + 5 showdown), including id, name, icon path, minAnte, and isShowdown
2. Extract and optimize boss icons from the wiki; add to `public/icons/`
3. Implement the availability engine (`src/engine/availability.ts`):
   - Given a list of past entries and a current ante number, return the eligible boss list
   - Handle minimum ante filtering
   - Handle appearance cycling (boss won't repeat until all eligible have appeared)
   - Handle showdown antes (multiples of 8)
   - Handle rerolled bosses counting as appearances
4. Implement sorting logic (by minAnte ascending, then alphabetical)
5. Write comprehensive unit tests for the availability engine:
   - Ante 1 with 8 eligible bosses
   - Bosses unlocking at Antes 2–6
   - Appearance cycling after all bosses have been seen
   - Showdown Ante detection and filtering
   - Ante reduction scenarios (repeated antes)
   - Edge cases: Ante 39, empty history, all bosses exhausted in a cycle

**Exit Criteria:**

- Boss dataset is complete and type-safe
- All icons are present and optimized
- Availability engine passes all unit tests
- No UI dependencies — engine is a pure function

---

### Phase 3: State Management & Persistence

**Goal:** Implement the run data model, state hooks, and localStorage persistence layer.

**Steps:**

1. Define TypeScript interfaces: `BossBlind`, `AnteEntry`, `Run`, `AppState` (per Architecture.md)
2. Implement `useAppState()` custom hook:
   - Load from localStorage on mount
   - Auto-persist on every mutation
   - Expose functions: createRun, switchRun, endRun, deleteRun, clearCompleted, clearAll
3. Implement `useAnteActions()` hook:
   - addEntry (faced boss + rerolled bosses → auto-advance ante)
   - undoLastEntry
   - editEntry
   - decrementAnte (-1 button)
4. Implement run limit enforcement (max 10 active, max 10 completed; eviction/prompts)
5. Implement theme preference cookie (read/write)
6. Write unit tests for state mutations and persistence logic

**Exit Criteria:**

- Creating, switching, ending, and deleting runs works correctly
- State survives browser refresh (localStorage round-trip)
- Run limits are enforced with appropriate behavior
- Theme cookie is read on load and written on toggle
- All state tests pass

---

### Phase 4: Core UI — Boss Selection & Ante Tracking

**Goal:** Build the primary interaction screen where the user selects bosses for the current Ante.

**Steps:**

1. Build the app shell: top bar (run name, Ante indicator, -1 button, theme toggle), main content area
2. Implement the boss selection grid component:
   - Renders eligible bosses with icon + name
   - Sorted by minAnte then alphabetical
   - Responsive grid layout (more columns on wider screens)
3. Implement tap-to-face interaction (mobile)
4. Implement long-press-to-reroll interaction (mobile) with visual feedback
5. Implement button-based faced/rerolled interactions (desktop)
6. Show rerolled bosses for the current Ante (before faced boss is selected)
7. Wire up auto-advance on faced boss selection
8. Wire up -1 Ante button
9. Ensure keyboard accessibility for all interactions
10. Write component tests for boss selection flow

**Exit Criteria:**

- User can select faced boss and see Ante advance
- User can reroll one or more bosses before selecting faced boss
- Boss grid correctly reflects availability rules
- -1 Ante button works
- Layout is responsive across mobile/tablet/desktop
- All interactions are keyboard-accessible
- Component tests pass

---

### Phase 5: Run Management UI

**Goal:** Build the run creation, switching, ending, and deletion interfaces.

**Steps:**

1. Implement "New Run" flow: name input, creation, auto-switch
2. Implement run switcher: list of active runs with name + start date/time
3. Implement "End Run" with confirmation prompt (before Ante 39)
4. Implement run deletion (individual)
5. Implement "Clear completed" and "Clear all" with confirmation dialogs
6. Handle active run limit (10) — prompt on new run creation
7. Implement completed run history view
8. Write component tests for run management flows

**Exit Criteria:**

- User can create, name, switch, end, and delete runs
- Confirmation prompts appear where required
- Run limits are enforced in the UI
- History of completed runs is viewable
- Component tests pass

---

### Phase 6: History, Undo & Edit

**Goal:** Build the Ante history view with undo and inline editing capabilities.

**Steps:**

1. Implement history toggle/tab showing past Ante entries (Ante number, faced boss with icon, rerolled bosses)
2. Implement undo button (reverts most recent entry, decrements Ante)
3. Implement inline edit mode for past entries:
   - Tap/click an entry to enter edit mode
   - Change faced boss from eligible bosses at that point in history
   - Add/remove rerolled bosses
   - Save triggers recalculation of current Ante availability
4. Ensure history is scrollable and handles long runs (up to 39+ entries)
5. Write component tests for undo and edit flows

**Exit Criteria:**

- History view shows all past entries accurately
- Undo reverts the last entry and updates Ante
- Inline edit allows modifying any past entry
- Current Ante availability recalculates after edits
- Component tests pass

---

### Phase 7: Polish, Accessibility Audit & Documentation

**Goal:** Final quality pass — visual polish, accessibility review, documentation, and production readiness.

**Steps:**

1. Refine dark and light theme colors and contrast ratios (WCAG AA minimum)
2. Audit all interactive elements for keyboard navigation and screen reader compatibility
3. Add appropriate ARIA labels, roles, and live regions (e.g., Ante change announcements)
4. Test on real devices: iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari
5. Optimize production build size (review bundle, lazy-load icons if needed)
6. Finalize README: usage instructions, screenshots, contributing guide
7. Verify GitHub Pages deployment works end-to-end
8. Create `develop` → `main` PR for initial release

**Exit Criteria:**

- All WCAG AA contrast requirements met
- Full keyboard navigation works for all features
- Tested on mobile (iOS + Android) and desktop (Chrome, Firefox, Safari)
- Production build is under target size (HTML + CSS + JS < 50 KB gzipped, excluding icons)
- README is complete
- App is live on GitHub Pages

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-04-28

### Added

- Abandon-run shortcut button (🗑️) in the top bar — confirms with the user, deletes the active run, and immediately starts a new generic run

### Changed

- Run name no longer shown in the top bar; only the current Ante is displayed in the center

## [1.0.1] - 2026-04-26

### Fixed

- Fixed a mobile interaction bug where swiping on a boss card could incorrectly mark that boss as faced (Issue #7)
- Fixed a mobile interaction bug where a long-press reroll could be followed by an unintended boss action on finger release (Issue #8)

## [1.0.0] - 2026-04-21

### Added

- Boss availability engine that computes eligible bosses per Ante based on minimum ante requirements, appearance cycling, and showdown rules
- Boss selection grid sorted by minimum Ante (ascending), then alphabetically within each group
- Tap-to-face (mobile) and button-based (desktop) boss selection interactions
- Long-press-to-reroll (mobile) with visual feedback for recording rerolled bosses before selecting the faced boss
- Auto-advance Ante on faced boss selection
- Ante decrement button for Hieroglyph/Petroglyph vouchers (limited to 2 uses per run, with confirmation)
- Support for multiple concurrent active runs (max 10) with user-provided names
- Run switcher displaying run name and start date/time
- Completed run history (max 10, oldest evicted)
- Run creation, switching, ending, and deletion
- Confirmation prompt when ending a run before Ante 39
- Auto-complete run when Ante 39 boss is faced
- Clear all and clear completed options with confirmation dialogs
- Ante history view behind a toggle showing past entries with faced and rerolled bosses
- Undo button to revert the most recent Ante entry
- Inline editing of any past Ante entry with availability recalculation
- Dark and light theme support with system preference detection
- Manual theme toggle with cookie-based preference persistence
- localStorage persistence for all run state across browser sessions
- About dialog with app information
- Responsive layout for mobile, tablet, and desktop
- GitHub Pages deployment via GitHub Actions
- CI pipeline with TypeScript type checking and Vitest tests on pull requests
- Automated release pipeline creating GitHub Releases with changelog-derived notes on merge to main
- Release validation CI check for PRs targeting main (version increment, changelog entry, empty Unreleased section)
- CHANGELOG.md following Keep a Changelog 1.1.0 conventions

[Unreleased]: https://github.com/bwyatt/blind-keeper/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/bwyatt/blind-keeper/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/bwyatt/blind-keeper/releases/tag/v1.0.1
[1.0.0]: https://github.com/bwyatt/blind-keeper/releases/tag/v1.0.0

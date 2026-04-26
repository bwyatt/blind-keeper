# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/bwyatt/blind-keeper/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bwyatt/blind-keeper/releases/tag/v1.0.0

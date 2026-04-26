# Blind Keeper

A lightweight web app for tracking boss blinds during [Balatro](https://www.playbalatro.com/) runs. Know exactly which bosses can appear at each Ante based on the game's availability rules.

## Features

- **Boss Availability Engine** — Only shows eligible bosses for the current Ante, respecting minimum ante requirements, appearance cycling, and showdown rules
- **Multiple Runs** — Track up to 10 concurrent active runs with named identifiers
- **Reroll Tracking** — Record rerolled bosses before selecting the faced boss
- **Ante Management** — Auto-advance on boss selection, −1 button for Hieroglyph/Petroglyph vouchers
- **History & Editing** — View past entries, undo the last entry, or inline-edit any past ante
- **Dark/Light Theme** — Toggle between themes or auto-detect from system preference
- **Offline-Ready** — All data stored in browser localStorage; no server required

## Local Development

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Type-check + production build
npm test           # Run Vitest tests
npm run typecheck  # TypeScript type checking only
```

## Tech Stack

- **UI:** [Preact](https://preactjs.com/) with hooks
- **Language:** TypeScript (strict mode)
- **Build:** [Vite](https://vite.dev/)
- **Testing:** [Vitest](https://vitest.dev/) + [Preact Testing Library](https://testing-library.com/docs/preact-testing-library/intro)
- **Styling:** Plain CSS with custom properties
- **Hosting:** GitHub Pages

## Releases

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). All notable changes are documented in [CHANGELOG.md](CHANGELOG.md), which follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

Releases are created automatically when code is merged to `main`. PRs targeting `main` must include:

- A version bump in `package.json`
- A matching versioned entry in `CHANGELOG.md`
- An empty `[Unreleased]` section (all changes moved to the versioned entry)

## Documentation

- [Architecture](docs/Architecture.md) — Technical design and data model
- [Requirements](docs/Requirements.md) — Functional, technical, and non-functional requirements
- [Implementation Plan](docs/Implementation-Plan.md) — Phased build plan
- [Decisions](docs/Decisions.md) — Design decisions log

## License

See [LICENSE](LICENSE) for details.

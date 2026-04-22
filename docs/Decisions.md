# Decisions Log

A record of design questions and answers for the Blind Keeper project.

## Initial Requirements (Provided Unprompted)

| # | Topic | Decision |
| --- | --- | --- |
| 1 | Page weight | "Page size should be minimized. Emphasize loading speed over fancy visuals." |
| 2 | App type | "This should be a single-page application." |
| 3 | Back-end | "There should be no server back-end. Everything runs in the user's browser." |
| 4 | Boss display | "Boss selection should display both the icon and name of the boss." |
| 5 | Responsiveness | "The interface should be responsive, to enhance usability on mobile, tablet, and desktop" |
| 6 | Boss availability | "The displayed boss list should take into account the rules regarding which bosses will be available to play." |
| 7 | Persistence | "Use local storage in the browser to enable users to browse away and return with the same state." |
| 8 | Privacy | "There will be no authentication, analytics, or user tracking." |
| 9 | Cookies | "No cookies should be created except those absolutely required to enable functionality." |
| 10 | Audience | "My primary purpose is to use the tool myself, but I will share the link with others" |
| 11 | Hosting | "Initially, the tool should be published via GitHub Pages, but we should be able to migrate it in the future if needed." |
| 12 | CSS | "Use CSS custom properties to minimize repetition of things like colors" |
| 13 | Error correction | "The user should be able to correct errors from previous Antes" |

## Interview Q&A

| # | Question | Answer |
| --- | --- | --- |
| Q1 | Should the app support Endless Mode (Antes 9+)? If so, is there an upper bound? | "It should go up to ante 39, which is the maximum in the game." |
| Q2 | Should the app track one run at a time, or multiple concurrent runs? Should there be history/archival of past runs? | "Multiple active runs, plus history, could be useful. I'm often playing on multiple devices, so I have more than one run active at a time." |
| Q3 | Would you want a mechanism to share/sync run state across devices (e.g., export/import, URL encoding)? | "No, I'm fine with having data isolated to one device. I'm imagining a use case where I play on multiple devices, but I track all the runs from my phone browser. I should be able to switch between active runs." |
| Q4 | How should runs be identified — auto-generated names, user-provided names, or both? | "User-provided text. The switching UI should show both the name of the run and the date/time it started (device local time)." |
| Q5 | Should the app track the Stake level (White, Red, Green, etc.) as run metadata? | "That's not needed for now." |
| Q6 | Should the app track whether Small/Big Blinds were skipped each Ante? | "I just want to focus on boss encounters" |
| Q7 | Front-end technology preference: vanilla, lightweight framework, or full framework? | "A very lightweight framework would be okay. Walk me through some options and I'll choose one." |
| Q7a | Framework choice: Alpine.js, Preact, or Lit? | "Preact sounds like it could be a good choice. I don't mind a build step, and I could envision growing the scope of the app at some point, making its alignment with React valuable." |
| Q8 | JavaScript or TypeScript? | "Typescript" |
| Q9 | UI workflow: (1) Show all eligible bosses or full list? (2) Manual or auto-advance Ante on boss selection? (3) Record rerolled boss before selecting the one actually faced? | "1 - I should see only the eligible bosses. 2 - Auto-advance when I choose which one I actually faced. 3 - Yes, re-roll first." |
| Q10 | Can there be multiple rerolls per Ante? Any other Ante progression quirks? | "Yes, you can have multiple re-rolls per Ante. You can also reduce the ante by 1 by buying specific vouchers, so we need to account for that possibility. (e.g., you beat Ante 1, go to Ante 2, buy a voucher, and the Ante count goes back to 1.)" |
| Q11 | How should Ante reduction work in the UI? Should a repeated Ante be a separate entry or overwrite the previous? | "-1 button sounds good. In the case you described, there should be two Ante 1 records, because the first Ante 1 still happened." |
| Q12 | How should boss icons be sourced — local assets, wiki-hosted links, or CSS/emoji placeholders? | "Local images would be my preference. We'll need to extract the images." |
| Q13 | UI interaction: How to distinguish reroll vs. faced? Should history log be always visible or behind a toggle? | "1 - On mobile, a tap/hold model makes sense. But re-rolls are rarer, so they should be the hold. Tap a boss to mark it as faced. On desktop, we can experiment with buttons for re-rolled/faced. 2 - Keep it behind a toggle or tab." |
| Q14 | How should error correction work — inline edit, undo last, or both? | "Offer both options (undo and edit)" |
| Q15 | When a past entry is edited, should the app re-validate downstream Antes, flag conflicts, or silently accept? | "Accept their edits, but also re-calculate available bosses for the \"current\" ante." |
| Q16 | How should ending a run work — explicit buttons, auto-detect win, or leave active indefinitely? | "Leave them active until the user ends them *or* they mark a boss as faced on ante 39, since there's no ante 40 to advance to." |
| Q17 | Should the user specify an outcome (Won/Lost/Abandoned) when ending a run? | "We don't need it. But do ask for confirmation if they're ending it before selecting a faced boss for ante 39." |
| Q18 | Color palette / visual tone — dark, light, or both with toggle/system preference? | "Support both" |
| Q19 | Should there be a manual theme toggle? How should the preference be persisted? | "Yes, offer a toggle. This seems like an ok place to use a cookie, to avoid having non-data items in localStorage." |
| Q20 | Testing strategy — unit tests for boss logic, component tests for interactions, no E2E? | "That feels right to me." |
| Q21 | Should users be able to delete runs from history? Should there be a "reset all" option? | "The user should be able to delete everything. Offer options to clear all (including active) or just clear completed. I think it also makes sense to limit the number of runs we keep. This isn't useful data long-term. Let's store a limit of 10 past runs for now. This should help us avoid running into the local storage space limit." |
| Q22 | Should there be a limit on the number of active runs? | "I think a limit of 10 would be generous enough. If the user tries to start a run after that, ask if we can should delete just the oldest active one or all active ones." |
| Q23 | CI/CD: auto-deploy on merge, or manual? Branching strategy? | "Yep, auto-deploy on merge to main. I also want to adopt the GitHub Flow branching strategy. Feature branches should target develop, not main." |
| Q23a | Clarification: GitHub Flow or Gitflow (with develop branch)? Local dev needs? | "That's right, I meant gitflow. CI should run on every PR, with deployment only on merge to main. I also need the ability to build & run locally on my dev machine." |
| Q24 | Any specific accessibility requirements? | "No specific accessibility requirements, but accessibility is very important to me and should be considered in all UI decisions." |
| Q25 | How should the boss selection grid be sorted? | "Option 2, then alphabetical within the group" |

## Interview Complete

All 25 questions have been addressed. The decisions above are reflected in the following documents:

- [Architecture.md](./Architecture.md) — Technical architecture and data model
- [Requirements.md](./Requirements.md) — Functional, technical, and non-functional requirements
- [Implementation-Plan.md](./Implementation-Plan.md) — Phased implementation plan with exit criteria

## Release Pipeline Decisions

| # | Topic | Decision |
| --- | --- | --- |
| RP-1 | Versioning | SemVer (MAJOR.MINOR.PATCH) |
| RP-2 | Version bump | Manual — developer updates `package.json` and `CHANGELOG.md` in the PR to `main` |
| RP-3 | Git tagging | Auto-tag on release (e.g., `v1.0.0`) |
| RP-4 | Release notes source | Parsed from CHANGELOG.md — extract the section for the version being released |
| RP-5 | Release publishing | Auto-publish immediately (not draft) |
| RP-6 | Workflow structure | Combine deploy (GitHub Pages) + release (GitHub Release + tag) into one workflow |
| RP-7 | Initial changelog | Start with a `1.0.0` entry summarizing current functionality |
| RP-8 | PR-to-main checks | Version increment, changelog entry match, no Unreleased content, standard CI |
| RP-9 | Scripts | PowerShell (cross-platform via `pwsh`) |

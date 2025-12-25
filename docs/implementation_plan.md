# Static HTML Version Implementation Plan

The goal is to create a standalone, pure static version of the Roulette Simulator that doesn't require a build tool or a development server.

## Proposed Changes

### [NEW] html/
A new directory containing the vanilla implementation.

#### [NEW] index.html
- Main structure using semantic HTML.
- CDN links for Chart.js.
- Containers for the control panel, roulette table, and results.

#### [NEW] style.css
- Ported from `src/index.css`.
- Adjusted for vanilla HTML structure (no React component scoping needed).
- Premium dark mode casino theme.

#### [NEW] logic.js
- Ported from `src/logic/roulette.ts`.
- Pure JavaScript implementation of `RouletteEngine` and `runSimulation`.

#### [NEW] ui.js
- State management (active bets, balance, etc.).
- DOM manipulation to render the roulette table.
- Event listeners for clicks and right-clicks.
- Chart.js integration for the equity curve.

## Verification Plan

### Manual Verification
- Open `html/index.html` directly in a browser.
- Verify that clicking the table adds chips.
- Verify that right-clicking removes chips.
- Verify that running the simulation produces a correct equity curve and statistics.
- Test different roulette variants (American, European, French).

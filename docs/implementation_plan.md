# Roulette Simulation Platform Implementation Plan

This project aims to build a high-quality web-based Roulette simulation platform where users can test different betting strategies across various roulette types.

## Proposed Changes

### Project Setup
- Initialize a Vite project with React and TypeScript.
- Install `chart.js` and `react-chartjs-2` for data visualization.
- Install `lucide-react` for icons.
- Install `framer-motion` for smooth animations.

### Core Logic
- **Roulette Engine**: A class or set of functions to handle the physics-less simulation of spins.
    - American: 0, 00, 1-36
    - European: 0, 1-36
    - French: 0, 1-36 (with La Partage rule for even-money bets)
- **Betting System**: Support for various bets:
    - Straight up (Single number)
    - Even/Odd, Red/Black, High/Low
    - Columns, Dozens
- **Simulation Runner**: A worker or async function to run thousands of iterations without freezing the UI.

### UI/UX Design
- **Theme**: Dark, premium aesthetic with gold and deep green accents (classic casino feel).
- **Dashboard**:
    - Sidebar for configuration (Roulette type, Bet amount, Bet type, Iterations).
    - Main area for the Equity Curve and statistics (Total Profit/Loss, Win Rate, Max Drawdown).
- **Interactive Elements**: Hover effects on charts, animated transitions when simulation completes.

### Visual Betting Interface [NEW]
- **Roulette Table Component**: Create a responsive, interactive SVG or CSS Grid-based roulette table.
    - Support for American (0, 00) and European/French (0) layouts.
    - Clickable zones for all supported bet types.
- **State Integration**: Sync the visual selection with the existing `betType` and `straightValue` state.
- **Visual Feedback**: Add a "chip" indicator on the selected bet area and highlight the area on hover.
- **Responsive Design**: Ensure the table scales well on different screen sizes.

### Multi-Bet Support [NEW]
- **Logic Update**: Modify `runSimulation` to accept an array of `Bet` objects and calculate the aggregate payout for each spin.
- **UI State**: Transition from a single `betType` to a `bets` array in `App.tsx`.
- **Table Interaction**: Update `RouletteTable` to allow toggling bets on and off. Clicking an already selected area will remove the bet.
- **Bet List UI**: Add a section to display all active bets and allow removing them individually.

## Verification Plan

### Automated Tests
- Unit tests for payout calculations.
- Validation of win probabilities for each roulette type.

### Manual Verification
- Run 10,000 simulations and check if the results align with theoretical house edges (e.g., 5.26% for American, 2.7% for European).
- Verify UI responsiveness and chart rendering.

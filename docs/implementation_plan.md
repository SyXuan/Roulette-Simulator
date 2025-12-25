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

## Verification Plan

### Automated Tests
- Unit tests for payout calculations.
- Validation of win probabilities for each roulette type.

### Manual Verification
- Run 10,000 simulations and check if the results align with theoretical house edges (e.g., 5.26% for American, 2.7% for European).
- Verify UI responsiveness and chart rendering.

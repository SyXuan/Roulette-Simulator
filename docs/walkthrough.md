# Roulette Simulation Platform Walkthrough

I have successfully built a premium Roulette simulation platform that allows users to test various betting strategies across different roulette variants.

## Features Implemented

- **Static HTML Version**: A standalone, pure HTML/JS version for maximum portability.
- **Incremental Betting**: Click multiple times on the table to add chips. The total amount is displayed on each chip.
- **Right-Click to Remove**: Right-click on any bet area to decrease the amount or remove the chip.
- **Multi-Bet Support**: Place multiple chips on the table simultaneously and simulate the combined outcome.
- **Visual Betting Table**: Interactive virtual table for placing bets by clicking on numbers or zones.
- **Multiple Roulette Variants**: Support for American (0, 00), European (0), and French (0 + La Partage rule).
- **Flexible Betting**: Support for Straight Up, Red/Black, Even/Odd, High/Low, and Dozens.
- **High-Fidelity Simulation**: Run up to thousands of iterations instantly.
- **Data Visualization**: Real-time equity curve chart using Chart.js.
- **Key Statistics**: Track Final Balance, Total Profit/Loss, Win Rate, and Max Drawdown.
- **Premium UI**: Dark mode casino theme with gold accents and smooth animations.

## Visual Demonstration

![Static Version Interface](static_version_final_1766636444161.png)

![Multi-Bet Interface](multi_bet_interface_1766623733657.png)

![European Roulette Simulation Results](european_results_1766622562473.png)

![American Roulette Simulation Results](american_results_1766622572818.png)

![Simulation Demo Video](roulette_simulation_demo_1766622509690.webp)

## Technical Implementation

### Static Version
The static version is located in the [html/](../html/) directory. It uses vanilla JavaScript and CSS to provide the same experience as the React version without any build dependencies.

### Core Logic
The simulation engine is located in [roulette.ts](../src/logic/roulette.ts). It handles the probability distributions for each roulette type and calculates payouts accurately, including special rules like *La Partage*.

### UI Component
The main application logic and UI are in [App.tsx](../src/App.tsx), utilizing `react-chartjs-2` for the equity curve and `lucide-react` for icons.

### Styling
The premium look and feel are defined in [index.css](../src/index.css), featuring a radial gradient background and custom gold color palette.

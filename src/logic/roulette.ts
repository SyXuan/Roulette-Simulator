export type RouletteType = 'American' | 'European' | 'French';

export type BetType = 
  | 'Straight' 
  | 'Red' | 'Black' 
  | 'Even' | 'Odd' 
  | 'High' | 'Low' 
  | 'Dozen1' | 'Dozen2' | 'Dozen3'
  | 'Column1' | 'Column2' | 'Column3';

export interface Bet {
  type: BetType;
  value?: number; // For Straight bet
  amount: number;
}

export interface SimulationResult {
  equityCurve: number[];
  totalProfit: number;
  winRate: number;
  maxDrawdown: number;
  finalBalance: number;
}

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export class RouletteEngine {
  private type: RouletteType;

  constructor(type: RouletteType) {
    this.type = type;
  }

  spin(): string {
    const numbers = this.getNumbers();
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  }

  private getNumbers(): string[] {
    const base = Array.from({ length: 36 }, (_, i) => (i + 1).toString());
    if (this.type === 'American') {
      return ['0', '00', ...base];
    } else {
      return ['0', ...base];
    }
  }

  calculatePayout(bet: Bet, result: string): number {
    const num = parseInt(result);
    const isZero = result === '0' || result === '00';

    if (isZero) {
      // French Roulette La Partage rule: half back on even-money bets
      if (this.type === 'French' && result === '0' && this.isEvenMoneyBet(bet.type)) {
        return bet.amount / 2;
      }
      
      // Straight bet on 0 or 00
      if (bet.type === 'Straight' && bet.value?.toString() === result) {
        return bet.amount * 36;
      }

      return 0;
    }

    switch (bet.type) {
      case 'Straight':
        return bet.value === num ? bet.amount * 36 : 0;
      case 'Red':
        return RED_NUMBERS.has(num) ? bet.amount * 2 : 0;
      case 'Black':
        return !RED_NUMBERS.has(num) ? bet.amount * 2 : 0;
      case 'Even':
        return num % 2 === 0 ? bet.amount * 2 : 0;
      case 'Odd':
        return num % 2 !== 0 ? bet.amount * 2 : 0;
      case 'High':
        return num >= 19 ? bet.amount * 2 : 0;
      case 'Low':
        return num <= 18 ? bet.amount * 2 : 0;
      case 'Dozen1':
        return num >= 1 && num <= 12 ? bet.amount * 3 : 0;
      case 'Dozen2':
        return num >= 13 && num <= 24 ? bet.amount * 3 : 0;
      case 'Dozen3':
        return num >= 25 && num <= 36 ? bet.amount * 3 : 0;
      case 'Column1':
        return num % 3 === 1 ? bet.amount * 3 : 0;
      case 'Column2':
        return num % 3 === 2 ? bet.amount * 3 : 0;
      case 'Column3':
        return num % 3 === 0 ? bet.amount * 3 : 0;
      default:
        return 0;
    }
  }

  private isEvenMoneyBet(type: BetType): boolean {
    return ['Red', 'Black', 'Even', 'Odd', 'High', 'Low'].includes(type);
  }
}

export function runSimulation(
  type: RouletteType,
  bet: Bet,
  iterations: number,
  initialBalance: number = 1000
): SimulationResult {
  const engine = new RouletteEngine(type);
  let balance = initialBalance;
  const equityCurve = [balance];
  let wins = 0;
  let maxBalance = initialBalance;
  let maxDrawdown = 0;

  for (let i = 0; i < iterations; i++) {
    if (balance < bet.amount) break; // Out of money

    balance -= bet.amount;
    const result = engine.spin();
    const payout = engine.calculatePayout(bet, result);
    
    if (payout > 0) {
      wins++;
      balance += payout;
    }

    equityCurve.push(balance);
    
    if (balance > maxBalance) {
      maxBalance = balance;
    }
    const drawdown = maxBalance - balance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return {
    equityCurve,
    totalProfit: balance - initialBalance,
    winRate: wins / iterations,
    maxDrawdown,
    finalBalance: balance
  };
}

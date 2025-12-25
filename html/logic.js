class RouletteEngine {
    constructor(type) {
        this.type = type;
        this.pockets = this.getPockets();
    }

    getPockets() {
        const pockets = Array.from({ length: 37 }, (_, i) => i);
        if (this.type === 'American') {
            pockets.push(37); // 37 represents 00
        }
        return pockets;
    }

    spin() {
        const randomIndex = Math.floor(Math.random() * this.pockets.length);
        return this.pockets[randomIndex];
    }

    calculatePayout(bet, result) {
        const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result);
        const isZero = result === 0 || result === 37;
        const isEven = result !== 0 && result !== 37 && result % 2 === 0;
        const isHigh = result >= 19 && result <= 36;

        switch (bet.type) {
            case 'Straight':
                return result === bet.value ? bet.amount * 36 : 0;
            case 'Red':
                if (isRed) return bet.amount * 2;
                if (isZero && this.type === 'French') return bet.amount * 0.5;
                return 0;
            case 'Black':
                if (!isRed && !isZero) return bet.amount * 2;
                if (isZero && this.type === 'French') return bet.amount * 0.5;
                return 0;
            case 'Even':
                if (isEven) return bet.amount * 2;
                if (isZero && this.type === 'French') return bet.amount * 0.5;
                return 0;
            case 'Odd':
                if (!isEven && !isZero) return bet.amount * 2;
                if (isZero && this.type === 'French') return bet.amount * 0.5;
                return 0;
            case 'High':
                if (isHigh) return bet.amount * 2;
                if (isZero && this.type === 'French') return bet.amount * 0.5;
                return 0;
            case 'Low':
                if (!isHigh && !isZero) return bet.amount * 2;
                if (isZero && this.type === 'French') return bet.amount * 0.5;
                return 0;
            case 'Dozen1':
                return result >= 1 && result <= 12 ? bet.amount * 3 : 0;
            case 'Dozen2':
                return result >= 13 && result <= 24 ? bet.amount * 3 : 0;
            case 'Dozen3':
                return result >= 25 && result <= 36 ? bet.amount * 3 : 0;
            case 'Column1':
                return result >= 1 && result <= 36 && result % 3 === 1 ? bet.amount * 3 : 0;
            case 'Column2':
                return result >= 1 && result <= 36 && result % 3 === 2 ? bet.amount * 3 : 0;
            case 'Column3':
                return result >= 1 && result <= 36 && result % 3 === 0 ? bet.amount * 3 : 0;
            default:
                return 0;
        }
    }
}

function runSimulation(type, bets, iterations, initialBalance = 1000) {
    const engine = new RouletteEngine(type);
    let balance = initialBalance;
    const equityCurve = [balance];
    let wins = 0;
    let maxBalance = initialBalance;
    let maxDrawdown = 0;

    const totalBetAmount = bets.reduce((sum, b) => sum + b.amount, 0);

    for (let i = 0; i < iterations; i++) {
        if (balance < totalBetAmount) break;

        balance -= totalBetAmount;
        const result = engine.spin();

        let totalPayout = 0;
        bets.forEach(bet => {
            totalPayout += engine.calculatePayout(bet, result);
        });

        if (totalPayout > 0) {
            wins++;
            balance += totalPayout;
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

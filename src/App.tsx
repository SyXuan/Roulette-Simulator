import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Play, RotateCcw, TrendingUp, Percent, ArrowDownCircle, Wallet, Trash2 } from 'lucide-react';
import { runSimulation } from './logic/roulette';
import type { RouletteType, BetType, Bet, SimulationResult } from './logic/roulette';
import { RouletteTable } from './components/RouletteTable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function App() {
  const [rouletteType, setRouletteType] = useState<RouletteType>('European');
  const [betAmount, setBetAmount] = useState<number>(10);
  const [iterations, setIterations] = useState<number>(1000);
  const [initialBalance, setInitialBalance] = useState<number>(1000);

  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    if (activeBets.length === 0) {
      alert('Please place at least one bet!');
      return;
    }
    setIsSimulating(true);
    setTimeout(() => {
      const res = runSimulation(rouletteType, activeBets, iterations, initialBalance);
      setResult(res);
      setIsSimulating(false);
    }, 100);
  };

  const handleAddBet = (type: BetType, value?: number) => {
    setActiveBets(prev => {
      const existingIndex = prev.findIndex(b => b.type === type && b.value === value);
      if (existingIndex > -1) {
        const newBets = [...prev];
        newBets[existingIndex] = {
          ...newBets[existingIndex],
          amount: newBets[existingIndex].amount + betAmount
        };
        return newBets;
      } else {
        return [...prev, { type, value, amount: betAmount }];
      }
    });
  };

  const handleRemoveBet = (type: BetType, value?: number) => {
    setActiveBets(prev => {
      const existingIndex = prev.findIndex(b => b.type === type && b.value === value);
      if (existingIndex > -1) {
        const newBets = [...prev];
        if (newBets[existingIndex].amount > betAmount) {
          newBets[existingIndex] = {
            ...newBets[existingIndex],
            amount: newBets[existingIndex].amount - betAmount
          };
          return newBets;
        } else {
          return prev.filter((_, i) => i !== existingIndex);
        }
      }
      return prev;
    });
  };

  const removeBetByIndex = (index: number) => {
    setActiveBets(prev => prev.filter((_, i) => i !== index));
  };

  const clearBets = () => {
    setActiveBets([]);
  };

  const chartData = useMemo(() => {
    if (!result) return null;
    return {
      labels: result.equityCurve.map((_, i) => i),
      datasets: [
        {
          label: 'Balance',
          data: result.equityCurve,
          borderColor: '#d4af37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          fill: true,
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };
  }, [result]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        grid: {
          color: '#333',
        },
        ticks: {
          color: '#aaa',
        },
      },
    },
  };

  const totalCurrentBet = activeBets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="container">
      <header>
        <h1>Roulette Simulator</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Test your strategies with high-fidelity simulation</p>
      </header>

      <div className="grid grid-cols-12">
        {/* Control Panel */}
        <div className="col-span-4 grid gap-1.5">
          <div className="card">
            <h2 style={{ color: 'var(--gold)', marginBottom: '1rem', fontSize: '1.2rem' }}>Configuration</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label>Roulette Type</label>
              <select value={rouletteType} onChange={(e) => {
                setRouletteType(e.target.value as RouletteType);
                clearBets();
              }}>
                <option value="American">American (0, 00)</option>
                <option value="European">European (0)</option>
                <option value="French">French (0 + La Partage)</option>
              </select>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '1rem' }}>
              <div>
                <label>Chip Value</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label>Initial Balance</label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Simulations</label>
              <input
                type="number"
                step="100"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
              />
            </div>

            <div className="bet-summary card" style={{ background: '#2a2a2a', marginBottom: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Active Bets: {activeBets.length}</span>
                <button onClick={clearBets} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', background: '#444', color: '#fff' }}>Clear All</button>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                Total Bet: ${totalCurrentBet}
              </div>

              <div className="bet-list" style={{ marginTop: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                {activeBets.map((bet, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', borderBottom: '1px solid #333', fontSize: '0.8rem' }}>
                    <span>{bet.type === 'Straight' ? `Number ${bet.value === 37 ? '00' : bet.value}` : bet.type}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>${bet.amount}</span>
                      <Trash2 size={14} color="#f44336" style={{ cursor: 'pointer' }} onClick={() => removeBetByIndex(idx)} />
                    </div>
                  </div>
                ))}
                {activeBets.length === 0 && <div style={{ textAlign: 'center', color: '#555', padding: '1rem' }}>Click the table to place bets</div>}
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating || activeBets.length === 0}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isSimulating ? <RotateCcw className="animate-spin" /> : <Play size={18} />}
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="col-span-8 grid gap-1.5">
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#aaa' }}>Visual Betting Table</h3>
            <RouletteTable
              type={rouletteType}
              activeBets={activeBets}
              onAddBet={handleAddBet}
              onRemoveBet={handleRemoveBet}
            />
          </div>

          {result ? (
            <>
              <div className="grid grid-cols-2 gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '50%' }}>
                    <Wallet color="var(--gold)" size={24} />
                  </div>
                  <div>
                    <label>Final Balance</label>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${result.finalBalance.toLocaleString()}</div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '50%' }}>
                    <TrendingUp color={result.totalProfit >= 0 ? '#4caf50' : '#f44336'} size={24} />
                  </div>
                  <div>
                    <label>Total Profit/Loss</label>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: result.totalProfit >= 0 ? '#4caf50' : '#f44336' }}>
                      {result.totalProfit >= 0 ? '+' : ''}${result.totalProfit.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '50%' }}>
                    <Percent color="var(--gold)" size={24} />
                  </div>
                  <div>
                    <label>Win Rate</label>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{(result.winRate * 100).toFixed(2)}%</div>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '50%' }}>
                    <ArrowDownCircle color="#f44336" size={24} />
                  </div>
                  <div>
                    <label>Max Drawdown</label>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f44336' }}>${result.maxDrawdown.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ height: '400px', marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#aaa' }}>Equity Curve</h3>
                <div style={{ height: '320px' }}>
                  {chartData && <Line data={chartData} options={chartOptions} />}
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#555', borderStyle: 'dashed' }}>
              <RotateCcw size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>Place your bets on the table and run a simulation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

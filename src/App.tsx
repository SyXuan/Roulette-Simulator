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
import { Play, RotateCcw, TrendingUp, Percent, ArrowDownCircle, Wallet } from 'lucide-react';
import { runSimulation } from './logic/roulette';
import type { RouletteType, BetType, Bet, SimulationResult } from './logic/roulette';

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
  const [betType, setBetType] = useState<BetType>('Red');
  const [betAmount, setBetAmount] = useState<number>(10);
  const [iterations, setIterations] = useState<number>(1000);
  const [initialBalance, setInitialBalance] = useState<number>(1000);
  const [straightValue, setStraightValue] = useState<number>(0);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    // Use setTimeout to allow UI to show "Simulating..." state if needed
    setTimeout(() => {
      const bet: Bet = {
        type: betType,
        amount: betAmount,
        value: betType === 'Straight' ? straightValue : undefined
      };
      const res = runSimulation(rouletteType, bet, iterations, initialBalance);
      setResult(res);
      setIsSimulating(false);
    }, 100);
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
              <select value={rouletteType} onChange={(e) => setRouletteType(e.target.value as RouletteType)}>
                <option value="American">American (0, 00)</option>
                <option value="European">European (0)</option>
                <option value="French">French (0 + La Partage)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Bet Type</label>
              <select value={betType} onChange={(e) => setBetType(e.target.value as BetType)}>
                <option value="Red">Red</option>
                <option value="Black">Black</option>
                <option value="Even">Even</option>
                <option value="Odd">Odd</option>
                <option value="High">High (19-36)</option>
                <option value="Low">Low (1-18)</option>
                <option value="Dozen1">1st Dozen (1-12)</option>
                <option value="Dozen2">2nd Dozen (13-24)</option>
                <option value="Dozen3">3rd Dozen (25-36)</option>
                <option value="Straight">Straight Up (Single Number)</option>
              </select>
            </div>

            {betType === 'Straight' && (
              <div style={{ marginBottom: '1rem' }}>
                <label>Number (0-36)</label>
                <input
                  type="number"
                  min="0"
                  max="36"
                  value={straightValue}
                  onChange={(e) => setStraightValue(parseInt(e.target.value))}
                />
              </div>
            )}

            <div className="grid grid-cols-2" style={{ marginBottom: '1rem' }}>
              <div>
                <label>Bet Amount</label>
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

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isSimulating ? <RotateCcw className="animate-spin" /> : <Play size={18} />}
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="col-span-8 grid gap-1.5">
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
              <p>Configure and run a simulation to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

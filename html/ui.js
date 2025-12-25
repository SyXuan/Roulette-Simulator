const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

let activeBets = [];
let chart = null;

function initUI() {
    renderTable();
    updateBetList();

    document.getElementById('run-btn').addEventListener('click', handleSimulate);
    document.getElementById('clear-btn').addEventListener('click', clearBets);
    document.getElementById('roulette-type').addEventListener('change', (e) => {
        clearBets();
        renderTable();
    });
}

function renderTable() {
    const type = document.getElementById('roulette-type').value;
    const isAmerican = type === 'American';
    const tableGrid = document.querySelector('.roulette-table-grid');

    // Clear existing
    tableGrid.innerHTML = '';

    // Zeros Column
    const zerosCol = document.createElement('div');
    zerosCol.className = 'zeros-column';

    const zeroCell = createCell('Straight', 0, 'table-cell zero', '0');
    zeroCell.style.height = isAmerican ? '50%' : '100%';
    zerosCol.appendChild(zeroCell);

    if (isAmerican) {
        const doubleZeroCell = createCell('Straight', 37, 'table-cell zero', '00');
        doubleZeroCell.style.height = '50%';
        zerosCol.appendChild(doubleZeroCell);
    }
    tableGrid.appendChild(zerosCol);

    // Numbers Grid
    const numbersGrid = document.createElement('div');
    numbersGrid.className = 'numbers-grid';

    const rows = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ];

    rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'table-row';

        row.forEach(num => {
            const isRed = RED_NUMBERS.includes(num);
            const cell = createCell('Straight', num, `table-cell number ${isRed ? 'red' : 'black'}`, num);
            rowDiv.appendChild(cell);
        });

        const colBet = createCell(`Column${3 - rowIndex}`, undefined, 'table-cell side-bet', '2:1');
        rowDiv.appendChild(colBet);
        numbersGrid.appendChild(rowDiv);
    });
    tableGrid.appendChild(numbersGrid);

    // Outside Bets
    const outsideGrid = document.createElement('div');
    outsideGrid.className = 'outside-bets-grid';

    const dozenRow = document.createElement('div');
    dozenRow.className = 'dozen-row';
    ['Dozen1', 'Dozen2', 'Dozen3'].forEach((d, i) => {
        const labels = ['1st 12', '2nd 12', '3rd 12'];
        dozenRow.appendChild(createCell(d, undefined, 'table-cell side-bet', labels[i]));
    });
    outsideGrid.appendChild(dozenRow);

    const evenMoneyRow = document.createElement('div');
    evenMoneyRow.className = 'even-money-row';
    const emBets = [
        { type: 'Low', label: '1-18' },
        { type: 'Even', label: 'Even' },
        { type: 'Red', label: 'Red', class: 'red-bet' },
        { type: 'Black', label: 'Black', class: 'black-bet' },
        { type: 'Odd', label: 'Odd' },
        { type: 'High', label: '19-36' }
    ];
    emBets.forEach(bet => {
        evenMoneyRow.appendChild(createCell(bet.type, undefined, `table-cell side-bet ${bet.class || ''}`, bet.label));
    });
    outsideGrid.appendChild(evenMoneyRow);
    tableGrid.appendChild(outsideGrid);
}

function createCell(type, value, className, label) {
    const cell = document.createElement('div');
    cell.className = className;
    cell.innerHTML = label;

    const updateChip = () => {
        const bet = activeBets.find(b => b.type === type && b.value === value);
        const existingChip = cell.querySelector('.chip');
        if (bet) {
            if (existingChip) {
                existingChip.querySelector('.chip-amount').textContent = `$${bet.amount}`;
            } else {
                const chip = document.createElement('div');
                chip.className = 'chip';
                chip.innerHTML = `<span class="chip-amount">$${bet.amount}</span>`;
                cell.appendChild(chip);
            }
            cell.classList.add('selected');
        } else {
            if (existingChip) existingChip.remove();
            cell.classList.remove('selected');
        }
    };

    cell.addEventListener('mousedown', (e) => {
        const chipValue = parseInt(document.getElementById('chip-value').value);
        if (e.button === 0) { // Left click
            const existing = activeBets.find(b => b.type === type && b.value === value);
            if (existing) {
                existing.amount += chipValue;
            } else {
                activeBets.push({ type, value, amount: chipValue });
            }
        } else if (e.button === 2) { // Right click
            const idx = activeBets.findIndex(b => b.type === type && b.value === value);
            if (idx > -1) {
                if (activeBets[idx].amount > chipValue) {
                    activeBets[idx].amount -= chipValue;
                } else {
                    activeBets.splice(idx, 1);
                }
            }
        }
        updateChip();
        updateBetList();
    });

    cell.addEventListener('contextmenu', e => e.preventDefault());

    // Initial chip state
    updateChip();

    return cell;
}

function updateBetList() {
    const list = document.getElementById('bet-list');
    const totalEl = document.getElementById('total-bet-amount');
    const countEl = document.getElementById('active-bets-count');

    list.innerHTML = '';
    let total = 0;

    activeBets.forEach((bet, idx) => {
        total += bet.amount;
        const item = document.createElement('div');
        item.className = 'bet-item';
        const label = bet.type === 'Straight' ? `Number ${bet.value === 37 ? '00' : bet.value}` : bet.type;
        item.innerHTML = `
            <span>${label}</span>
            <span>$${bet.amount}</span>
        `;
        list.appendChild(item);
    });

    totalEl.textContent = `$${total}`;
    countEl.textContent = activeBets.length;
}

function clearBets() {
    activeBets = [];
    renderTable();
    updateBetList();
}

function handleSimulate() {
    if (activeBets.length === 0) {
        alert('Please place at least one bet!');
        return;
    }

    const type = document.getElementById('roulette-type').value;
    const iterations = parseInt(document.getElementById('iterations').value);
    const initialBalance = parseInt(document.getElementById('initial-balance').value);

    const result = runSimulation(type, activeBets, iterations, initialBalance);
    displayResults(result);
}

function displayResults(result) {
    document.getElementById('final-balance').textContent = `$${result.finalBalance.toLocaleString()}`;
    document.getElementById('total-profit').textContent = `${result.totalProfit >= 0 ? '+' : ''}$${result.totalProfit.toLocaleString()}`;
    document.getElementById('total-profit').style.color = result.totalProfit >= 0 ? '#4caf50' : '#f44336';
    document.getElementById('win-rate').textContent = `${(result.winRate * 100).toFixed(2)}%`;
    document.getElementById('max-drawdown').textContent = `$${result.maxDrawdown.toLocaleString()}`;

    renderChart(result.equityCurve);
}

function renderChart(data) {
    const ctx = document.getElementById('equity-chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                label: 'Balance',
                data: data,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                fill: true,
                tension: 0.1,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { grid: { color: '#333' }, ticks: { color: '#aaa' } }
            }
        }
    });
}

window.onload = initUI;

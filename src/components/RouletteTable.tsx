import React from 'react';
import type { RouletteType, BetType, Bet } from '../logic/roulette';

interface RouletteTableProps {
    type: RouletteType;
    activeBets: Bet[];
    onAddBet: (type: BetType, value?: number) => void;
    onRemoveBet: (type: BetType, value?: number) => void;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const RouletteTable: React.FC<RouletteTableProps> = ({
    type,
    activeBets,
    onAddBet,
    onRemoveBet
}) => {
    const isAmerican = type === 'American';

    const getBetForNumber = (num: number) => {
        return activeBets.find(b => b.type === 'Straight' && b.value === num);
    };

    const getBetForType = (betType: BetType) => {
        return activeBets.find(b => b.type === betType);
    };

    const handleMouseDown = (e: React.MouseEvent, betType: BetType, value?: number) => {
        // Prevent default to avoid text selection or other browser behaviors
        if (e.button === 0) {
            // Left click
            onAddBet(betType, value);
        } else if (e.button === 2) {
            // Right click
            onRemoveBet(betType, value);
        }
    };

    const renderNumber = (num: number) => {
        const isRed = RED_NUMBERS.includes(num);
        const bet = getBetForNumber(num);

        return (
            <div
                key={num}
                onMouseDown={(e) => handleMouseDown(e, 'Straight', num)}
                onContextMenu={(e) => e.preventDefault()}
                className={`table-cell number ${isRed ? 'red' : 'black'} ${bet ? 'selected' : ''}`}
            >
                {num}
                {bet && (
                    <div className="chip">
                        <span className="chip-amount">${bet.amount}</span>
                    </div>
                )}
            </div>
        );
    };

    const rows = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ];

    return (
        <div className="roulette-table-container fade-in">
            <div className="roulette-table-grid">
                {/* Zeros */}
                <div className="zeros-column">
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'Straight', 0)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`table-cell zero ${getBetForNumber(0) ? 'selected' : ''}`}
                        style={{ height: isAmerican ? '50%' : '100%' }}
                    >
                        0
                        {getBetForNumber(0) && (
                            <div className="chip">
                                <span className="chip-amount">${getBetForNumber(0)?.amount}</span>
                            </div>
                        )}
                    </div>
                    {isAmerican && (
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Straight', 37)}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell zero ${getBetForNumber(37) ? 'selected' : ''}`}
                            style={{ height: '50%' }}
                        >
                            00
                            {getBetForNumber(37) && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForNumber(37)?.amount}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Numbers Grid */}
                <div className="numbers-grid">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="table-row">
                            {row.map(num => renderNumber(num))}
                            <div
                                onMouseDown={(e) => handleMouseDown(e, `Column${3 - rowIndex}` as BetType)}
                                onContextMenu={(e) => e.preventDefault()}
                                className={`table-cell side-bet column-bet ${getBetForType(`Column${3 - rowIndex}` as BetType) ? 'selected' : ''}`}
                            >
                                2:1
                                {getBetForType(`Column${3 - rowIndex}` as BetType) && (
                                    <div className="chip">
                                        <span className="chip-amount">${getBetForType(`Column${3 - rowIndex}` as BetType)?.amount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Outside Bets */}
                <div className="outside-bets-grid">
                    <div className="dozen-row">
                        <div className="spacer" />
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Dozen1')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('Dozen1') ? 'selected' : ''}`}
                        >
                            1st 12
                            {getBetForType('Dozen1') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Dozen1')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Dozen2')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('Dozen2') ? 'selected' : ''}`}
                        >
                            2nd 12
                            {getBetForType('Dozen2') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Dozen2')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Dozen3')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('Dozen3') ? 'selected' : ''}`}
                        >
                            3rd 12
                            {getBetForType('Dozen3') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Dozen3')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div className="spacer" />
                    </div>

                    <div className="even-money-row">
                        <div className="spacer" />
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Low')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('Low') ? 'selected' : ''}`}
                        >
                            1-18
                            {getBetForType('Low') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Low')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Even')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('Even') ? 'selected' : ''}`}
                        >
                            Even
                            {getBetForType('Even') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Even')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Red')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet red-bet ${getBetForType('Red') ? 'selected' : ''}`}
                        >
                            Red
                            {getBetForType('Red') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Red')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Black')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet black-bet ${getBetForType('Black') ? 'selected' : ''}`}
                        >
                            Black
                            {getBetForType('Black') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Black')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'Odd')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('Odd') ? 'selected' : ''}`}
                        >
                            Odd
                            {getBetForType('Odd') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('Odd')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'High')}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`table-cell side-bet ${getBetForType('High') ? 'selected' : ''}`}
                        >
                            19-36
                            {getBetForType('High') && (
                                <div className="chip">
                                    <span className="chip-amount">${getBetForType('High')?.amount}</span>
                                </div>
                            )}
                        </div>
                        <div className="spacer" />
                    </div>
                </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem', textAlign: 'center' }}>
                Tip: Left-click to add chips, Right-click to remove chips.
            </p>
        </div>
    );
};

import React from 'react';
import type { RouletteType, BetType, Bet } from '../logic/roulette';

interface RouletteTableProps {
    type: RouletteType;
    activeBets: Bet[];
    onToggleBet: (type: BetType, value?: number) => void;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const RouletteTable: React.FC<RouletteTableProps> = ({
    type,
    activeBets,
    onToggleBet
}) => {
    const isAmerican = type === 'American';

    const getBetForNumber = (num: number) => {
        return activeBets.find(b => b.type === 'Straight' && b.value === num);
    };

    const getBetForType = (betType: BetType) => {
        return activeBets.find(b => b.type === betType);
    };

    const renderNumber = (num: number) => {
        const isRed = RED_NUMBERS.includes(num);
        const bet = getBetForNumber(num);

        return (
            <div
                key={num}
                onClick={() => onToggleBet('Straight', num)}
                className={`table-cell number ${isRed ? 'red' : 'black'} ${bet ? 'selected' : ''}`}
            >
                {num}
                {bet && <div className="chip" />}
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
                        onClick={() => onToggleBet('Straight', 0)}
                        className={`table-cell zero ${getBetForNumber(0) ? 'selected' : ''}`}
                        style={{ height: isAmerican ? '50%' : '100%' }}
                    >
                        0
                        {getBetForNumber(0) && <div className="chip" />}
                    </div>
                    {isAmerican && (
                        <div
                            onClick={() => onToggleBet('Straight', 37)} // Using 37 for 00
                            className={`table-cell zero ${getBetForNumber(37) ? 'selected' : ''}`}
                            style={{ height: '50%' }}
                        >
                            00
                            {getBetForNumber(37) && <div className="chip" />}
                        </div>
                    )}
                </div>

                {/* Numbers Grid */}
                <div className="numbers-grid">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="table-row">
                            {row.map(num => renderNumber(num))}
                            <div
                                onClick={() => onToggleBet(`Column${3 - rowIndex}` as BetType)}
                                className={`table-cell side-bet column-bet ${getBetForType(`Column${3 - rowIndex}` as BetType) ? 'selected' : ''}`}
                            >
                                2:1
                                {getBetForType(`Column${3 - rowIndex}` as BetType) && <div className="chip" />}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Outside Bets */}
                <div className="outside-bets-grid">
                    <div className="dozen-row">
                        <div className="spacer" />
                        <div onClick={() => onToggleBet('Dozen1')} className={`table-cell side-bet ${getBetForType('Dozen1') ? 'selected' : ''}`}>
                            1st 12
                            {getBetForType('Dozen1') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('Dozen2')} className={`table-cell side-bet ${getBetForType('Dozen2') ? 'selected' : ''}`}>
                            2nd 12
                            {getBetForType('Dozen2') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('Dozen3')} className={`table-cell side-bet ${getBetForType('Dozen3') ? 'selected' : ''}`}>
                            3rd 12
                            {getBetForType('Dozen3') && <div className="chip" />}
                        </div>
                        <div className="spacer" />
                    </div>

                    <div className="even-money-row">
                        <div className="spacer" />
                        <div onClick={() => onToggleBet('Low')} className={`table-cell side-bet ${getBetForType('Low') ? 'selected' : ''}`}>
                            1-18
                            {getBetForType('Low') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('Even')} className={`table-cell side-bet ${getBetForType('Even') ? 'selected' : ''}`}>
                            Even
                            {getBetForType('Even') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('Red')} className={`table-cell side-bet red-bet ${getBetForType('Red') ? 'selected' : ''}`}>
                            Red
                            {getBetForType('Red') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('Black')} className={`table-cell side-bet black-bet ${getBetForType('Black') ? 'selected' : ''}`}>
                            Black
                            {getBetForType('Black') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('Odd')} className={`table-cell side-bet ${getBetForType('Odd') ? 'selected' : ''}`}>
                            Odd
                            {getBetForType('Odd') && <div className="chip" />}
                        </div>
                        <div onClick={() => onToggleBet('High')} className={`table-cell side-bet ${getBetForType('High') ? 'selected' : ''}`}>
                            19-36
                            {getBetForType('High') && <div className="chip" />}
                        </div>
                        <div className="spacer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

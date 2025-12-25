import React from 'react';
import type { RouletteType, BetType } from '../logic/roulette';

interface RouletteTableProps {
    type: RouletteType;
    selectedBet: BetType;
    selectedNumber?: number;
    onSelectBet: (type: BetType, value?: number) => void;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const RouletteTable: React.FC<RouletteTableProps> = ({
    type,
    selectedBet,
    selectedNumber,
    onSelectBet
}) => {
    const isAmerican = type === 'American';

    const renderNumber = (num: number) => {
        const isRed = RED_NUMBERS.includes(num);
        const isSelected = selectedBet === 'Straight' && selectedNumber === num;

        return (
            <div
                key={num}
                onClick={() => onSelectBet('Straight', num)}
                className={`table-cell number ${isRed ? 'red' : 'black'} ${isSelected ? 'selected' : ''}`}
            >
                {num}
                {isSelected && <div className="chip" />}
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
                        onClick={() => onSelectBet('Straight', 0)}
                        className={`table-cell zero ${selectedBet === 'Straight' && selectedNumber === 0 ? 'selected' : ''}`}
                        style={{ height: isAmerican ? '50%' : '100%' }}
                    >
                        0
                        {selectedBet === 'Straight' && selectedNumber === 0 && <div className="chip" />}
                    </div>
                    {isAmerican && (
                        <div
                            onClick={() => onSelectBet('Straight', 37)} // Using 37 for 00 internally or handle string
                            className={`table-cell zero ${selectedBet === 'Straight' && selectedNumber === 37 ? 'selected' : ''}`}
                            style={{ height: '50%' }}
                        >
                            00
                            {selectedBet === 'Straight' && selectedNumber === 37 && <div className="chip" />}
                        </div>
                    )}
                </div>

                {/* Numbers Grid */}
                <div className="numbers-grid">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="table-row">
                            {row.map(num => renderNumber(num))}
                            <div
                                onClick={() => onSelectBet(`Column${3 - rowIndex}` as BetType)}
                                className={`table-cell side-bet column-bet ${selectedBet === `Column${3 - rowIndex}` ? 'selected' : ''}`}
                            >
                                2:1
                                {selectedBet === `Column${3 - rowIndex}` && <div className="chip" />}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Outside Bets */}
                <div className="outside-bets-grid">
                    <div className="dozen-row">
                        <div className="spacer" />
                        <div onClick={() => onSelectBet('Dozen1')} className={`table-cell side-bet ${selectedBet === 'Dozen1' ? 'selected' : ''}`}>
                            1st 12
                            {selectedBet === 'Dozen1' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('Dozen2')} className={`table-cell side-bet ${selectedBet === 'Dozen2' ? 'selected' : ''}`}>
                            2nd 12
                            {selectedBet === 'Dozen2' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('Dozen3')} className={`table-cell side-bet ${selectedBet === 'Dozen3' ? 'selected' : ''}`}>
                            3rd 12
                            {selectedBet === 'Dozen3' && <div className="chip" />}
                        </div>
                        <div className="spacer" />
                    </div>

                    <div className="even-money-row">
                        <div className="spacer" />
                        <div onClick={() => onSelectBet('Low')} className={`table-cell side-bet ${selectedBet === 'Low' ? 'selected' : ''}`}>
                            1-18
                            {selectedBet === 'Low' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('Even')} className={`table-cell side-bet ${selectedBet === 'Even' ? 'selected' : ''}`}>
                            Even
                            {selectedBet === 'Even' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('Red')} className={`table-cell side-bet red-bet ${selectedBet === 'Red' ? 'selected' : ''}`}>
                            Red
                            {selectedBet === 'Red' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('Black')} className={`table-cell side-bet black-bet ${selectedBet === 'Black' ? 'selected' : ''}`}>
                            Black
                            {selectedBet === 'Black' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('Odd')} className={`table-cell side-bet ${selectedBet === 'Odd' ? 'selected' : ''}`}>
                            Odd
                            {selectedBet === 'Odd' && <div className="chip" />}
                        </div>
                        <div onClick={() => onSelectBet('High')} className={`table-cell side-bet ${selectedBet === 'High' ? 'selected' : ''}`}>
                            19-36
                            {selectedBet === 'High' && <div className="chip" />}
                        </div>
                        <div className="spacer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

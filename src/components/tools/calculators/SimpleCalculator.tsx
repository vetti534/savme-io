'use client';

import { useState } from 'react';
import styles from './SimpleCalculator.module.css';

interface HistoryItem {
    id: number;
    expression: string;
    result: number | string;
}

export default function SimpleCalculator() {
    const [num1, setNum1] = useState<string>('');
    const [num2, setNum2] = useState<string>('');
    const [result, setResult] = useState<number | string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState<string>('');

    const calculate = (operation: '+' | '-' | '×' | '÷') => {
        setError('');
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);

        if (isNaN(n1) || isNaN(n2)) {
            setError('Please enter valid numbers in both fields.');
            return;
        }

        let calculatedResult: number;
        let operatorSymbol = operation;

        switch (operation) {
            case '+':
                calculatedResult = n1 + n2;
                break;
            case '-':
                calculatedResult = n1 - n2;
                break;
            case '×':
                calculatedResult = n1 * n2;
                operatorSymbol = '×'; // For display if preferred, but sticking to button symbol
                break;
            case '÷':
                if (n2 === 0) {
                    setError('Cannot divide by zero.');
                    return;
                }
                calculatedResult = n1 / n2;
                break;
            default:
                return;
        }

        // Format result to avoid long decimals
        const formattedResult = parseFloat(calculatedResult.toFixed(4));

        setResult(formattedResult);

        // Add to history
        const newItem: HistoryItem = {
            id: Date.now(),
            expression: `${n1} ${operation} ${n2}`,
            result: formattedResult,
        };

        setHistory((prev) => [newItem, ...prev].slice(0, 5)); // Keep last 5
    };

    const clear = () => {
        setNum1('');
        setNum2('');
        setResult(null);
        setError('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.inputsRow}>
                    <div className={styles.inputGroup}>
                        <label>Number 1</label>
                        <input
                            type="number"
                            value={num1}
                            onChange={(e) => setNum1(e.target.value)}
                            placeholder="e.g. 10"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Number 2</label>
                        <input
                            type="number"
                            value={num2}
                            onChange={(e) => setNum2(e.target.value)}
                            placeholder="e.g. 5"
                        />
                    </div>
                </div>

                <div className={styles.operations}>
                    <button onClick={() => calculate('+')} className={styles.opBtn}>+</button>
                    <button onClick={() => calculate('-')} className={styles.opBtn}>-</button>
                    <button onClick={() => calculate('×')} className={styles.opBtn}>×</button>
                    <button onClick={() => calculate('÷')} className={styles.opBtn}>÷</button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.resultSection}>
                    <span className={styles.resultLabel}>Result</span>
                    <div className={styles.resultValue}>
                        {result !== null ? result : '---'}
                    </div>
                </div>

                <button onClick={clear} className={styles.clearBtn}>Clear All</button>
            </div>

            {history.length > 0 && (
                <div className={styles.history}>
                    <h3>Calculations History</h3>
                    <ul>
                        {history.map((item) => (
                            <li key={item.id}>
                                <span>{item.expression} = </span>
                                <strong>{item.result}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

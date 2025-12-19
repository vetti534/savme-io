'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function SimpleInterestCalculator() {
    const [principal, setPrincipal] = useState<number>(10000);
    const [rate, setRate] = useState<number>(5);
    const [time, setTime] = useState<number>(2);
    const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

    const [interest, setInterest] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    useEffect(() => {
        calculateInterest();
    }, []);

    const calculateInterest = () => {
        if (principal < 0 || rate < 0 || time < 0) return;

        // Formula: SI = (P * R * T) / 100
        // T is in years
        const t = timeUnit === 'years' ? time : time / 12;

        const si = (principal * rate * t) / 100;
        const total = principal + si; // Since A = P(1 + rt) can be P + SI

        setInterest(Math.round(si));
        setTotalAmount(Math.round(total));
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Principal Amount</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Annual Interest Rate (%)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Time Period</label>
                        <div className={styles.tenureWrapper}>
                            <input
                                type="number"
                                value={time}
                                onChange={(e) => setTime(Number(e.target.value))}
                            />
                            <div className={styles.toggles}>
                                <button
                                    className={timeUnit === 'years' ? styles.active : ''}
                                    onClick={() => setTimeUnit('years')}
                                >Yr</button>
                                <button
                                    className={timeUnit === 'months' ? styles.active : ''}
                                    onClick={() => setTimeUnit('months')}
                                >Mo</button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button className={styles.calculateBtn} onClick={calculateInterest}>
                        Calculate
                    </button>
                    <button className={styles.resetBtn} onClick={() => {
                        setPrincipal(10000);
                        setRate(5);
                        setTime(2);
                        setInterest(0);
                        setTotalAmount(0);
                    }}>
                        Reset
                    </button>
                </div>

                <div className={styles.results}>
                    {/* Result Display */}
                    <ToolResult
                        title={`₹ ${interest.toLocaleString()}`}
                        subTitle="Total Interest"
                        toolName="Simple Interest Calculator"
                        extraStats={[
                            { label: 'Principal', value: `₹ ${principal.toLocaleString()}` },
                            { label: 'Total Amount', value: `₹ ${totalAmount.toLocaleString()}` },
                        ]}
                        aiPrompt={`Simple Interest Analysis. Principal: ${principal}, Rate: ${rate}%, Time: ${time} ${timeUnit}. Total Interest: ${interest}. Total Amount: ${totalAmount}. Explanation of return.`}
                    />
                </div>
            </div>
        </div>
    );
}

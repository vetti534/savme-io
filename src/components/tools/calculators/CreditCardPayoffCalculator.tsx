'use client';

import { useState, useEffect } from 'react';
import styles from './CreditCardPayoffCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function CreditCardPayoffCalculator() {
    const [balance, setBalance] = useState<number>(50000);
    const [rate, setRate] = useState<number>(18);
    const [payment, setPayment] = useState<number>(2000);
    // Mode: 'time' (Calculate how long) or 'payment' (Calculate monthly payment for X months)
    const [mode, setMode] = useState<'time' | 'payment'>('time');
    const [targetMonths, setTargetMonths] = useState<number>(12);

    const [monthsToPayoff, setMonthsToPayoff] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [requiredPayment, setRequiredPayment] = useState<number>(0);
    const [warning, setWarning] = useState<string>('');

    useEffect(() => {
        calculatePayoff();
    }, [balance, rate, payment, mode, targetMonths]);

    const calculatePayoff = () => {
        setWarning('');
        if (balance <= 0 || rate < 0) return;

        const r = rate / 100 / 12;

        if (mode === 'time') {
            // N = -log(1 - (r * A) / P) / log(1 + r)
            // If P <= A * r, impossible
            const minPayment = balance * r;
            if (payment <= minPayment) {
                setWarning(`Monthly payment must be more than interest (₹${Math.ceil(minPayment)})`);
                setMonthsToPayoff(Infinity);
                setTotalInterest(0);
                return;
            }

            const numerator = Math.log(1 - (balance * r) / payment);
            const denominator = Math.log(1 + r);
            const n = -numerator / denominator;

            const months = Math.ceil(n);
            const totalPaid = months * payment; // Approximation
            // Precise total paid requires simulation or exact last payment calc, but approx is fine for simple tool

            setMonthsToPayoff(months);
            setTotalInterest(Math.round(totalPaid - balance));

        } else {
            // Calculate Payment for fixed months
            // P = (r * A) / (1 - (1+r)^-N)
            const n = targetMonths;
            if (n <= 0) return;

            const p = (r * balance) / (1 - Math.pow(1 + r, -n));

            setRequiredPayment(Math.ceil(p));
            setTotalInterest(Math.round((p * n) - balance));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Calculation Mode</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as any)}
                            className={styles.select}
                        >
                            <option value="time">How long will it take?</option>
                            <option value="payment">How much should I pay?</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Credit Card Balance</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Interest Rate (APR %)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                    {mode === 'time' ? (
                        <div className={styles.inputGroup}>
                            <label>Monthly Payment</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={payment}
                                    onChange={(e) => setPayment(Number(e.target.value))}
                                />
                            </div>
                            {warning && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.5rem' }}>{warning}</p>}
                        </div>
                    ) : (
                        <div className={styles.inputGroup}>
                            <label>Goal: Pay off in (Months)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    value={targetMonths}
                                    onChange={(e) => setTargetMonths(Number(e.target.value))}
                                />
                                <span>Mo</span>
                            </div>
                        </div>
                    )}

                </div>

                <div className={styles.results}>
                    {mode === 'time' ? (
                        <ToolResult
                            title={monthsToPayoff === Infinity ? 'Infinite' : `${monthsToPayoff} Months`}
                            subTitle={monthsToPayoff < 12 ? 'Time to Freedom' : `${(monthsToPayoff / 12).toFixed(1)} Years`}
                            toolName="Credit Card Payoff"
                            extraStats={[
                                { label: 'Total Interest', value: `₹ ${totalInterest.toLocaleString()}` },
                                { label: 'Total Payment', value: `₹ ${(balance + totalInterest).toLocaleString()}` },
                            ]}
                            aiPrompt={`Payoff Analysis. Balance: ${balance}, APR: ${rate}%, Payment: ${payment}. Time: ${monthsToPayoff} months. Interest: ${totalInterest}. Tips to pay faster.`}
                        />
                    ) : (
                        <ToolResult
                            title={`₹ ${requiredPayment.toLocaleString()}`}
                            subTitle="Monthly Payment Required"
                            toolName="Credit Card Payoff"
                            extraStats={[
                                { label: 'Total Interest', value: `₹ ${totalInterest.toLocaleString()}` },
                                { label: 'Total Paid', value: `₹ ${(requiredPayment * targetMonths).toLocaleString()}` },
                            ]}
                            aiPrompt={`Payoff Plan. Balance: ${balance}, APR: ${rate}%, Goal: ${targetMonths} months. Required Payment: ${requiredPayment}. Is this realistic?`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

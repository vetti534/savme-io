'use client';

import { useState } from 'react';
import CalculatorLayout from './shared/CalculatorLayout';

export default function InflationCalculator() {
    const [amount, setAmount] = useState<number>(100);
    const [rate, setRate] = useState<number>(3); // Annual inflation rate %
    const [years, setYears] = useState<number>(10);
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        // Future Value = Present Value * (1 + rate/100)^years
        const fv = amount * Math.pow(1 + rate / 100, years);
        setResult(parseFloat(fv.toFixed(2)));
    };

    return (
        <CalculatorLayout
            title="Inflation Calculator"
            description="Calculate the breakdown of your purchasing power over time."
        >
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Current Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Inflation Rate (%)</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={e => setRate(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Years</label>
                        <input
                            type="number"
                            value={years}
                            onChange={e => setYears(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>

                <button
                    onClick={calculate}
                    style={{ width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginBottom: '2rem' }}
                >
                    Calculate Future Value
                </button>

                {result !== null && (
                    <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bae6fd', textAlign: 'center' }}>
                        <p style={{ color: '#0369a1', marginBottom: '0.5rem' }}>
                            In <strong>{years} years</strong>, you will need:
                        </p>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7' }}>
                            {result.toLocaleString()}
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            to equal the purchasing power of {amount.toLocaleString()} today.
                        </p>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}

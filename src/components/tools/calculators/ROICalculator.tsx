'use client';

import { useState } from 'react';
import CalculatorLayout from './shared/CalculatorLayout';
import styles from './shared/CalculatorLayout.module.css'; // Reusing shared layout, can create specific if needed

export default function ROICalculator() {
    const [invested, setInvested] = useState<number>(0);
    const [returned, setReturned] = useState<number>(0);
    const [roi, setRoi] = useState<number | null>(null);

    const calculate = () => {
        if (invested === 0) return;
        const gain = returned - invested;
        const result = (gain / invested) * 100;
        setRoi(parseFloat(result.toFixed(2)));
    };

    const reset = () => {
        setInvested(0);
        setReturned(0);
        setRoi(null);
    };

    return (
        <CalculatorLayout
            title="ROI Calculator"
            description="Calculate Return on Investment (ROI) to evaluate the efficiency of an investment."
        >
            <div style={{ padding: '2rem', display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Amount Invested</label>
                        <input
                            type="number"
                            value={invested || ''}
                            onChange={e => setInvested(parseFloat(e.target.value))}
                            className="std-input"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            placeholder="e.g. 1000"
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Amount Returned</label>
                        <input
                            type="number"
                            value={returned || ''}
                            onChange={e => setReturned(parseFloat(e.target.value))}
                            className="std-input"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            placeholder="e.g. 1500"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={calculate}
                            style={{ padding: '0.8rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Calculate ROI
                        </button>
                        <button
                            onClick={reset}
                            style={{ padding: '0.8rem 1.5rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>ROI Result</span>
                    {roi !== null ? (
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: roi >= 0 ? '#10b981' : '#ef4444' }}>
                            {roi > 0 ? '+' : ''}{roi}%
                        </div>
                    ) : (
                        <div style={{ fontSize: '1.5rem', color: '#cbd5e1' }}>--.--%</div>
                    )}
                    {roi !== null && (
                        <p style={{ marginTop: '1rem', color: '#64748b' }}>
                            Total Gain/Loss: <strong style={{ color: '#1e293b' }}>{returned - invested}</strong>
                        </p>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}

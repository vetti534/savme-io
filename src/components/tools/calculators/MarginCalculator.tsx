'use client';

import { useState } from 'react';
import CalculatorLayout from './shared/CalculatorLayout';

export default function MarginCalculator() {
    const [cost, setCost] = useState<number>(100);
    const [revenue, setRevenue] = useState<number>(150);

    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    const markup = (profit / cost) * 100;

    return (
        <CalculatorLayout
            title="Margin Calculator"
            description="Calculate profit margin, markup, and revenue based on cost."
        >
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Cost</label>
                        <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value))} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Revenue (Selling Price)</label>
                        <input type="number" value={revenue} onChange={e => setRevenue(parseFloat(e.target.value))} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                        <span style={{ color: '#047857', fontSize: '0.9rem' }}>Gross Margin</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#059669' }}>
                            {isFinite(margin) ? margin.toFixed(2) : 0}%
                        </div>
                    </div>
                    <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <span style={{ color: '#b45309', fontSize: '0.9rem' }}>Markup</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d97706' }}>
                            {isFinite(markup) ? markup.toFixed(2) : 0}%
                        </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#475569', fontSize: '0.9rem' }}>Profit</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#334155' }}>
                            {profit.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
}

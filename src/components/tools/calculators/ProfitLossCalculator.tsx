'use client';

import { useState, useEffect } from 'react';
import styles from './ProfitLossCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function ProfitLossCalculator() {
    const [costPrice, setCostPrice] = useState<number>(500);
    const [sellingPrice, setSellingPrice] = useState<number>(600);

    const [profit, setProfit] = useState<number>(0);
    const [profitPercent, setProfitPercent] = useState<number>(0);
    const [status, setStatus] = useState<'Profit' | 'Loss' | 'Break-even'>('Profit');

    useEffect(() => {
        calculatePL();
    }, [costPrice, sellingPrice]);

    const calculatePL = () => {
        if (costPrice < 0 || sellingPrice < 0) return;

        const diff = sellingPrice - costPrice;
        setProfit(parseFloat(Math.abs(diff).toFixed(2)));

        if (diff > 0) {
            setStatus('Profit');
            const p = (diff / costPrice) * 100;
            setProfitPercent(parseFloat(p.toFixed(2)));
        } else if (diff < 0) {
            setStatus('Loss');
            const p = (Math.abs(diff) / costPrice) * 100;
            setProfitPercent(parseFloat(p.toFixed(2)));
        } else {
            setStatus('Break-even');
            setProfitPercent(0);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Cost Price (CP)</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={costPrice}
                                onChange={(e) => setCostPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Selling Price (SP)</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${status === 'Profit' ? '+' : status === 'Loss' ? '-' : ''} ₹${profit.toLocaleString()}`}
                        subTitle={`${status} Amount`}
                        toolName="Profit & Loss Calculator"
                        extraStats={[
                            { label: `${status} %`, value: `${profitPercent}%` },
                            { label: 'Return on Cost', value: `${(sellingPrice / costPrice).toFixed(2)}x` },
                        ]}
                        aiPrompt={`P&L Analysis. Cost: ${costPrice}, Sold: ${sellingPrice}. Result: ${status} of ${profit} (${profitPercent}%). Tips.`}
                    />
                </div>
            </div>
        </div>
    );
}

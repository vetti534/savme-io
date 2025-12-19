'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css'; // Reusing generic styles
import ToolResult from '@/components/tools/ToolResult';

export default function SalesTaxCalculator() {
    const [amount, setAmount] = useState<number>(100);
    const [taxRate, setTaxRate] = useState<number>(10); // %
    const [mode, setMode] = useState<'add' | 'remove'>('add');

    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [finalAmount, setFinalAmount] = useState<number>(0);
    const [netAmount, setNetAmount] = useState<number>(0);

    useEffect(() => {
        calculateTax();
    }, [amount, taxRate, mode]);

    const calculateTax = () => {
        if (amount < 0 || taxRate < 0) return;

        if (mode === 'add') {
            // Gross = Net * (1 + rate)
            const tax = (amount * taxRate) / 100;
            const total = amount + tax;

            setTaxAmount(tax);
            setFinalAmount(total); // Total to pay
            setNetAmount(amount); // Original
        } else {
            // Net = Gross / (1 + rate)
            const net = amount / (1 + (taxRate / 100));
            const tax = amount - net;

            setTaxAmount(tax);
            setFinalAmount(amount); // Original Total
            setNetAmount(net); // Pre-tax
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Calculation Mode</label>
                        <div className={styles.toggles}>
                            <button
                                className={mode === 'add' ? styles.active : ''}
                                onClick={() => setMode('add')}
                                style={{ flex: 1, padding: '0.75rem' }}
                            >Add Tax (Exclusive)</button>
                            <button
                                className={mode === 'remove' ? styles.active : ''}
                                onClick={() => setMode('remove')}
                                style={{ flex: 1, padding: '0.75rem' }}
                            >Remove Tax (Inclusive)</button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{mode === 'add' ? 'Net Amount (Before Tax)' : 'Gross Amount (After Tax)'}</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Tax Rate (%)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`₹ ${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                        subTitle="Tax Amount"
                        toolName="Sales Tax Calculator"
                        extraStats={[
                            { label: 'Net Amount', value: `₹ ${netAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
                            { label: 'Gross Amount', value: `₹ ${finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
                        ]}
                        aiPrompt={`Sales Tax Calc. Amount: ${amount}, Rate: ${taxRate}%, Mode: ${mode}. Tax: ${taxAmount}.`}
                    />
                </div>
            </div>
        </div>
    );
}

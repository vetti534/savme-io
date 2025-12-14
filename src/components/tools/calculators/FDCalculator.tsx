'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import styles from './FDCalculator.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

type Frequency = 'yearly' | 'half-yearly' | 'quarterly' | 'monthly';

export default function FDCalculator() {
    const [principal, setPrincipal] = useState<number>(100000);
    const [rate, setRate] = useState<number>(6.5);
    const [tenureYears, setTenureYears] = useState<number>(5);
    const [tenureMonths, setTenureMonths] = useState<number>(0);
    const [frequency, setFrequency] = useState<Frequency>('quarterly');
    const [isTdsApplicable, setIsTdsApplicable] = useState<boolean>(false);
    const [tdsRate, setTdsRate] = useState<number>(10);

    const [maturityAmount, setMaturityAmount] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [postTaxMaturity, setPostTaxMaturity] = useState<number>(0);
    const [effectiveYield, setEffectiveYield] = useState<number>(0);

    const calculateFD = () => {
        if (principal <= 0 || rate <= 0) return;

        const totalYears = tenureYears + tenureMonths / 12;
        if (totalYears <= 0) return;

        let periodsPerYear = 1;
        if (frequency === 'half-yearly') periodsPerYear = 2;
        if (frequency === 'quarterly') periodsPerYear = 4;
        if (frequency === 'monthly') periodsPerYear = 12;

        const r = rate / 100;
        const n = periodsPerYear;
        const t = totalYears;

        // A = P * (1 + r/n)^(n*t)
        const amount = principal * Math.pow(1 + r / n, n * t);
        const interest = amount - principal;

        setMaturityAmount(Math.round(amount));
        setTotalInterest(Math.round(interest));

        // Effective Yield = (Total Interest / Principal) / Total Years * 100
        // Or CAGR: (Maturity/Principal)^(1/t) - 1
        const cagr = (Math.pow(amount / principal, 1 / t) - 1) * 100;
        setEffectiveYield(Number(cagr.toFixed(2)));

        // Tax Calculation
        if (isTdsApplicable) {
            const tax = interest * (tdsRate / 100);
            setPostTaxMaturity(Math.round(amount - tax));
        } else {
            setPostTaxMaturity(Math.round(amount));
        }
    };

    useEffect(() => {
        calculateFD();
    }, [principal, rate, tenureYears, tenureMonths, frequency, isTdsApplicable, tdsRate]);

    const chartData = {
        labels: ['Principal Amount', 'Total Interest'],
        datasets: [
            {
                data: [principal, totalInterest],
                backgroundColor: ['#2c3e50', '#e53935'],
                borderWidth: 1,
            },
        ],
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Fixed Deposit Calculation', 14, 15);

        doc.setFontSize(10);
        doc.text(`Principal Amount: ₹${principal}`, 14, 25);
        doc.text(`Interest Rate: ${rate}%`, 14, 30);
        doc.text(`Tenure: ${tenureYears} Years ${tenureMonths} Months`, 14, 35);
        doc.text(`Compounding: ${frequency}`, 14, 40);

        doc.text(`Maturity Amount: ₹${maturityAmount}`, 14, 50);
        doc.text(`Total Interest: ₹${totalInterest}`, 14, 55);

        if (isTdsApplicable) {
            doc.text(`Post-Tax Maturity (TDS ${tdsRate}%): ₹${postTaxMaturity}`, 14, 60);
        }

        doc.save('fd-calculation.pdf');
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
                        <input
                            type="range"
                            min="5000"
                            max="10000000"
                            step="5000"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Interest Rate (%)</label>
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
                        <label>Tenure</label>
                        <div className={styles.tenureContainer}>
                            <div className={styles.tenureField}>
                                <input
                                    type="number"
                                    value={tenureYears}
                                    onChange={(e) => setTenureYears(Number(e.target.value))}
                                />
                                <span>Years</span>
                            </div>
                            <div className={styles.tenureField}>
                                <input
                                    type="number"
                                    value={tenureMonths}
                                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                                />
                                <span>Months</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Compounding Frequency</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as Frequency)}
                            className={styles.select}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="half-yearly">Half Yearly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id="tds"
                                checked={isTdsApplicable}
                                onChange={(e) => setIsTdsApplicable(e.target.checked)}
                            />
                            <label htmlFor="tds" style={{ marginBottom: 0 }}>Apply TDS?</label>
                        </div>
                        {isTdsApplicable && (
                            <div className={styles.inputWrapper} style={{ marginTop: '0.5rem' }}>
                                <input
                                    type="number"
                                    value={tdsRate}
                                    onChange={(e) => setTdsRate(Number(e.target.value))}
                                    placeholder="Tax Rate"
                                />
                                <span>%</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.results}>
                    <div className={styles.chartContainer}>
                        <Doughnut data={chartData} />
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.summaryItem}>
                            <span>Maturity Amount</span>
                            <span className={styles.highlight}>₹ {maturityAmount.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Interest</span>
                            <span>₹ {totalInterest.toLocaleString()}</span>
                        </div>
                        {isTdsApplicable && (
                            <div className={styles.summaryItem}>
                                <span>Post-Tax Maturity</span>
                                <span>₹ {postTaxMaturity.toLocaleString()}</span>
                            </div>
                        )}
                        <div className={styles.summaryItem}>
                            <span>Effective Yield</span>
                            <span style={{ color: '#27ae60', fontWeight: 700 }}>{effectiveYield}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnPrimary} onClick={downloadPDF}>
                    Download PDF Report
                </button>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './SIPCalculator.module.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler
);

interface YearProjection {
    year: number;
    invested: number;
    value: number;
}

export default function SIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [expectedReturn, setExpectedReturn] = useState<number>(12);
    const [tenureYears, setTenureYears] = useState<number>(10);
    const [stepUpRate, setStepUpRate] = useState<number>(0);
    const [inflationRate, setInflationRate] = useState<number>(0);

    const [investedAmount, setInvestedAmount] = useState<number>(0);
    const [estReturns, setEstReturns] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [inflationAdjustedValue, setInflationAdjustedValue] = useState<number>(0);
    const [projections, setProjections] = useState<YearProjection[]>([]);

    const calculateSIP = () => {
        if (monthlyInvestment <= 0 || expectedReturn <= 0 || tenureYears <= 0) return;

        let currentInvestment = monthlyInvestment;
        let totalInvested = 0;
        let currentValue = 0;
        const monthlyRate = expectedReturn / 12 / 100;
        const months = tenureYears * 12;
        const yearlyProjections: YearProjection[] = [];

        for (let i = 1; i <= months; i++) {
            // Add investment
            currentValue += currentInvestment;
            totalInvested += currentInvestment;

            // Apply interest
            currentValue = currentValue * (1 + monthlyRate);

            // Annual Step Up
            if (stepUpRate > 0 && i % 12 === 0 && i !== months) {
                currentInvestment = currentInvestment * (1 + stepUpRate / 100);
            }

            // Store yearly data
            if (i % 12 === 0) {
                yearlyProjections.push({
                    year: i / 12,
                    invested: Math.round(totalInvested),
                    value: Math.round(currentValue)
                });
            }
        }

        setInvestedAmount(Math.round(totalInvested));
        setTotalValue(Math.round(currentValue));
        setEstReturns(Math.round(currentValue - totalInvested));
        setProjections(yearlyProjections);

        // Inflation Adjustment
        if (inflationRate > 0) {
            // Real Value = Nominal Value / (1 + inflation)^years
            const realValue = currentValue / Math.pow(1 + inflationRate / 100, tenureYears);
            setInflationAdjustedValue(Math.round(realValue));
        } else {
            setInflationAdjustedValue(0);
        }
    };

    useEffect(() => {
        calculateSIP();
    }, [monthlyInvestment, expectedReturn, tenureYears, stepUpRate, inflationRate]);

    const doughnutData = {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [
            {
                data: [investedAmount, estReturns],
                backgroundColor: ['#e0e0e0', '#e53935'],
                borderWidth: 0,
            },
        ],
    };

    const lineData = {
        labels: projections.map(p => `Year ${p.year}`),
        datasets: [
            {
                label: 'Total Value',
                data: projections.map(p => p.value),
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Invested Amount',
                data: projections.map(p => p.invested),
                borderColor: '#555',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
            }
        ],
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('SIP Investment Projection', 14, 15);

        doc.setFontSize(10);
        doc.text(`Monthly Investment: ₹${monthlyInvestment}`, 14, 25);
        doc.text(`Expected Return: ${expectedReturn}%`, 14, 30);
        doc.text(`Tenure: ${tenureYears} Years`, 14, 35);
        if (stepUpRate > 0) doc.text(`Annual Step-up: ${stepUpRate}%`, 14, 40);

        doc.text(`Invested Amount: ₹${investedAmount}`, 14, 50);
        doc.text(`Est. Returns: ₹${estReturns}`, 14, 55);
        doc.text(`Total Value: ₹${totalValue}`, 14, 60);

        autoTable(doc, {
            startY: 70,
            head: [['Year', 'Invested Amount', 'Total Value']],
            body: projections.map(row => [
                row.year,
                row.invested,
                row.value
            ]),
        });

        doc.save('sip-projection.pdf');
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <div className={styles.inputGroup}>
                        <label>Monthly Investment</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={monthlyInvestment}
                                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            />
                        </div>
                        <div className={styles.presets}>
                            {[1000, 2000, 5000, 10000].map(val => (
                                <button key={val} onClick={() => setMonthlyInvestment(val)}>₹{val / 1000}k</button>
                            ))}
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Expected Return (p.a)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                        <div className={styles.presets}>
                            {[8, 12, 15, 20].map(val => (
                                <button key={val} onClick={() => setExpectedReturn(val)}>{val}%</button>
                            ))}
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.1"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Tenure (Years)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={tenureYears}
                                onChange={(e) => setTenureYears(Number(e.target.value))}
                            />
                            <span>Yr</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={tenureYears}
                            onChange={(e) => setTenureYears(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    <div className={styles.advancedOptions}>
                        <details>
                            <summary>Advanced Options (Step-up, Inflation)</summary>
                            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                                <label>Annual Step-up (%)</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        value={stepUpRate}
                                        onChange={(e) => setStepUpRate(Number(e.target.value))}
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Inflation Rate (%)</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        value={inflationRate}
                                        onChange={(e) => setInflationRate(Number(e.target.value))}
                                    />
                                    <span>%</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                                    Used to calculate inflation-adjusted value.
                                </p>
                            </div>
                        </details>
                    </div>
                </div>

                <div className={styles.results}>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <span>Invested Amount</span>
                            <h3>₹ {investedAmount.toLocaleString()}</h3>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Est. Returns</span>
                            <h3 style={{ color: '#27ae60' }}>₹ {estReturns.toLocaleString()}</h3>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Value</span>
                            <h3 className={styles.highlight}>₹ {totalValue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className={styles.chartWrapper}>
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                    </div>

                    {inflationAdjustedValue > 0 && (
                        <div className={styles.inflationBox}>
                            <span>Inflation Adjusted Value: </span>
                            <strong>₹ {inflationAdjustedValue.toLocaleString()}</strong>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.projectionSection}>
                <h3>Growth Projection</h3>
                <div className={styles.lineChart}>
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnPrimary} onClick={downloadPDF}>
                    Download Report
                </button>
            </div>
        </div>
    );
}

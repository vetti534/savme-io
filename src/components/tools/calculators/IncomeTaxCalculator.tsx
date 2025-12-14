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
import autoTable from 'jspdf-autotable';
import styles from './IncomeTaxCalculator.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

type Regime = 'old' | 'new';

export default function IncomeTaxCalculator() {
    const [income, setIncome] = useState<number>(1200000);
    const [regime, setRegime] = useState<Regime>('new');

    // Deductions (Old Regime mainly)
    const [standardDeduction, setStandardDeduction] = useState<number>(50000); // Available in both now? Yes for FY23-24 New Regime too? Yes 50k.
    const [deduction80C, setDeduction80C] = useState<number>(150000);
    const [deduction80D, setDeduction80D] = useState<number>(25000);
    const [hra, setHra] = useState<number>(0);
    const [otherDeductions, setOtherDeductions] = useState<number>(0);

    // Results
    const [taxableIncome, setTaxableIncome] = useState<number>(0);
    const [taxPayable, setTaxPayable] = useState<number>(0);
    const [cess, setCess] = useState<number>(0);
    const [totalTax, setTotalTax] = useState<number>(0);
    const [inHand, setInHand] = useState<number>(0);

    // Slabs for Display
    const [slabBreakdown, setSlabBreakdown] = useState<any[]>([]);

    const calculateTax = () => {
        let taxable = income;
        const isNew = regime === 'new';

        // 1. Deductions
        // Standard Deduction
        // FY 2023-24: Old Regime = 50k, New Regime = 50k (Salary income)
        taxable -= standardDeduction;

        if (!isNew) {
            // Old Regime Deductions
            taxable -= Math.min(deduction80C, 150000);
            taxable -= Math.min(deduction80D, 100000); // Max limit varies but reasonable cap
            taxable -= hra;
            taxable -= otherDeductions; // 80E, 24b, etc.
        } else {
            // New Regime is largely deduction free except Std Deduction and 80CCD(2)
            // We'll calculate on gross - std ded (if applicable).
            // Note: Family pension deduction also there but let's keep simple.
        }

        if (taxable < 0) taxable = 0;
        setTaxableIncome(taxable);

        // 2. Calculate Tax Slabs
        let tax = 0;
        let slabs = [];
        let remIncome = taxable;

        if (isNew) {
            // New Regime Slabs (FY 2023-24 / AY 2024-25)
            // 0-3L: 0%
            // 3-6L: 5%
            // 6-9L: 10%
            // 9-12L: 15%
            // 12-15L: 20%
            // >15L: 30%

            const limit1 = 300000;
            const limit2 = 600000;
            const limit3 = 900000;
            const limit4 = 1200000;
            const limit5 = 1500000;

            // Slab 1
            if (remIncome > limit1) {
                let taxableAmt = Math.min(remIncome, limit2) - limit1;
                if (taxableAmt > 0) {
                    let t = taxableAmt * 0.05;
                    tax += t;
                    slabs.push({ label: '₹3L - ₹6L (5%)', amount: t });
                }
            }

            // Slab 2
            if (remIncome > limit2) {
                let taxableAmt = Math.min(remIncome, limit3) - limit2;
                if (taxableAmt > 0) {
                    let t = taxableAmt * 0.10;
                    tax += t;
                    slabs.push({ label: '₹6L - ₹9L (10%)', amount: t });
                }
            }

            // Slab 3
            if (remIncome > limit3) {
                let taxableAmt = Math.min(remIncome, limit4) - limit3;
                if (taxableAmt > 0) {
                    let t = taxableAmt * 0.15;
                    tax += t;
                    slabs.push({ label: '₹9L - ₹12L (15%)', amount: t });
                }
            }

            // Slab 4
            if (remIncome > limit4) {
                let taxableAmt = Math.min(remIncome, limit5) - limit4;
                if (taxableAmt > 0) {
                    let t = taxableAmt * 0.20;
                    tax += t;
                    slabs.push({ label: '₹12L - ₹15L (20%)', amount: t });
                }
            }

            // Slab 5
            if (remIncome > limit5) {
                let taxableAmt = remIncome - limit5;
                let t = taxableAmt * 0.30;
                tax += t;
                slabs.push({ label: '> ₹15L (30%)', amount: t });
            }

            // Rebate u/s 87A (New): Tax 0 if Taxable Income <= 7L
            if (taxable <= 700000) {
                tax = 0;
                slabs = [{ label: 'Rebate u/s 87A', amount: 0 }]; // clear previous
            }

            // Marginal Relief logic omitted for simplicity but valid for >7L

        } else {
            // Old Regime Slabs
            // 0-2.5L: 0%
            // 2.5-5L: 5%
            // 5-10L: 20%
            // >10L: 30%

            const limit1 = 250000;
            const limit2 = 500000;
            const limit3 = 1000000;

            if (remIncome > limit1) {
                let taxableAmt = Math.min(remIncome, limit2) - limit1;
                if (taxableAmt > 0) {
                    let t = taxableAmt * 0.05;
                    tax += t;
                    slabs.push({ label: '₹2.5L - ₹5L (5%)', amount: t });
                }
            }

            if (remIncome > limit2) {
                let taxableAmt = Math.min(remIncome, limit3) - limit2;
                if (taxableAmt > 0) {
                    let t = taxableAmt * 0.20;
                    tax += t;
                    slabs.push({ label: '₹5L - ₹10L (20%)', amount: t });
                }
            }

            if (remIncome > limit3) {
                let taxableAmt = remIncome - limit3;
                let t = taxableAmt * 0.30;
                tax += t;
                slabs.push({ label: '> ₹10L (30%)', amount: t });
            }

            // Rebate u/s 87A (Old): Tax 0 if Taxable Income <= 5L
            if (taxable <= 500000) {
                tax = 0;
                slabs = [{ label: 'Rebate u/s 87A', amount: 0 }];
            }
        }

        setTaxPayable(Math.round(tax));
        setSlabBreakdown(slabs);

        // Cess 4%
        const c = tax * 0.04;
        setCess(Math.round(c));

        const tot = tax + c;
        setTotalTax(Math.round(tot));
        setInHand(Math.round(income - tot));
    };

    useEffect(() => {
        calculateTax();
    }, [income, regime, standardDeduction, deduction80C, deduction80D, hra, otherDeductions]);

    const chartData = {
        labels: ['Take Home', 'Income Tax', 'Cess'],
        datasets: [
            {
                data: [inHand, taxPayable, cess],
                backgroundColor: ['#27ae60', '#e53935', '#f39c12'],
                borderWidth: 0,
            },
        ],
    };

    const downloadReport = () => {
        const doc = new jsPDF();
        doc.text('Income Tax Estimation Report', 14, 15);
        doc.setFontSize(10);

        doc.text(`Regime: ${regime.toUpperCase()}`, 14, 25);
        doc.text(`Annual Income: ₹${income}`, 14, 30);
        doc.text(`Taxable Income: ₹${taxableIncome}`, 14, 35);

        autoTable(doc, {
            startY: 45,
            head: [['Component', 'Amount']],
            body: [
                ['Income Tax', `Rs. ${taxPayable}`],
                ['Health & Edu Cess', `Rs. ${cess}`],
                ['Total Tax Payable', `Rs. ${totalTax}`],
                ['In-Hand Salary', `Rs. ${inHand}`]
            ],
            theme: 'grid'
        });

        doc.text('Tax Slabs Breakdown:', 14, (doc as any).lastAutoTable.finalY + 10);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Slab', 'Tax Amount']],
            body: slabBreakdown.map(s => [s.label, `Rs. ${Math.round(s.amount)}`]),
            theme: 'striped'
        });

        doc.save('income-tax-report.pdf');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.regimeToggle}>
                    <button
                        className={regime === 'old' ? styles.activeRegime : styles.regimeBtn}
                        onClick={() => setRegime('old')}
                    >
                        Old Regime
                        <small>Deductions Allowed</small>
                    </button>
                    <button
                        className={regime === 'new' ? styles.activeRegime : styles.regimeBtn}
                        onClick={() => setRegime('new')}
                    >
                        New Regime
                        <small>Lower Rates, No Deductions</small>
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <h3>Income Details</h3>
                    <div className={styles.inputGroup}>
                        <label>Annual Gross Income</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <h3>Deductions</h3>
                    <div className={styles.deductionSection}>
                        <div className={styles.inputGroup}>
                            <label>Standard Deduction</label>
                            <div className={styles.inputWrapperDisabled}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={standardDeduction}
                                    readOnly
                                />
                            </div>
                            <small>Fixed for Salaried</small>
                        </div>

                        <div className={`${styles.inputGroup} ${regime === 'new' ? styles.disabledGroup : ''}`}>
                            <label>Section 80C</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={deduction80C}
                                    onChange={(e) => setDeduction80C(Number(e.target.value))}
                                    disabled={regime === 'new'}
                                />
                            </div>
                            <small>Max 1.5L (LIC, PF, PPF)</small>
                        </div>

                        <div className={`${styles.inputGroup} ${regime === 'new' ? styles.disabledGroup : ''}`}>
                            <label>Section 80D</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={deduction80D}
                                    onChange={(e) => setDeduction80D(Number(e.target.value))}
                                    disabled={regime === 'new'}
                                />
                            </div>
                            <small>Medical Insurance</small>
                        </div>

                        <div className={`${styles.inputGroup} ${regime === 'new' ? styles.disabledGroup : ''}`}>
                            <label>HRA Exemption</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={hra}
                                    onChange={(e) => setHra(Number(e.target.value))}
                                    disabled={regime === 'new'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.results}>
                    <div className={styles.summaryBox}>
                        <div className={styles.chartContainer}>
                            <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                        <div className={styles.metrics}>
                            <div className={styles.metricRow}>
                                <span>Taxable Income</span>
                                <strong>₹ {taxableIncome.toLocaleString()}</strong>
                            </div>
                            <div className={styles.metricRow}>
                                <span>Total Tax</span>
                                <strong style={{ color: '#e53935' }}>₹ {totalTax.toLocaleString()}</strong>
                            </div>
                            <div className={styles.metricRow}>
                                <span>Monthly In-Hand</span>
                                <strong style={{ color: '#27ae60' }}>₹ {Math.round(inHand / 12).toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>

                    <div className={styles.breakdown}>
                        <h4>Tax Calculation Slabs</h4>
                        <ul>
                            {slabBreakdown.map((s, i) => (
                                <li key={i}>
                                    <span>{s.label}</span>
                                    <span>₹ {Math.round(s.amount).toLocaleString()}</span>
                                </li>
                            ))}
                            <li className={styles.cessRow}>
                                <span>Health & Edu Cess (4%)</span>
                                <span>₹ {cess.toLocaleString()}</span>
                            </li>
                        </ul>
                    </div>

                    <button className={styles.printBtn} onClick={downloadReport}>
                        Download Tax Report
                    </button>
                </div>
            </div>
        </div>
    );
}

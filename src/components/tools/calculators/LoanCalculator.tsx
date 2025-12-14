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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './LoanCalculator.module.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

interface ScheduleRow {
    period: number;
    date: string;
    openingBalance: number;
    payment: number;
    principal: number;
    interest: number;
    closingBalance: number;
}

type RepaymentType = 'fixed' | 'interest-only' | 'balloon';
type Frequency = 'monthly' | 'quarterly' | 'yearly';

export default function LoanCalculator() {
    const [amount, setAmount] = useState<number>(500000);
    const [rate, setRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(5);
    const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
    const [repaymentType, setRepaymentType] = useState<RepaymentType>('fixed');
    const [balloonAmount, setBalloonAmount] = useState<number>(0);
    const [frequency, setFrequency] = useState<Frequency>('monthly');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [payment, setPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
    const [showSchedule, setShowSchedule] = useState(false);

    const calculateLoan = () => {
        if (amount <= 0 || rate <= 0 || tenure <= 0) return;

        let freqMultiplier = 12; // Monthly default
        if (frequency === 'quarterly') freqMultiplier = 4;
        if (frequency === 'yearly') freqMultiplier = 1;

        const r = rate / freqMultiplier / 100; // Rate per period
        const n = tenureType === 'years' ? tenure * freqMultiplier : Math.ceil(tenure * (freqMultiplier / 12));

        let calculatedPayment = 0;

        if (repaymentType === 'fixed') {
            // Standard Amortization
            calculatedPayment = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else if (repaymentType === 'interest-only') {
            // Interest Only Payment
            calculatedPayment = amount * r;
        } else if (repaymentType === 'balloon') {
            // Balloon Loan Payment
            // PMT = (P * (1+r)^n - B) * r / ((1+r)^n - 1)
            const numerator = (amount * Math.pow(1 + r, n) - balloonAmount) * r;
            const denominator = Math.pow(1 + r, n) - 1;
            calculatedPayment = numerator / denominator;
        }

        setPayment(Math.round(calculatedPayment));

        // Generate Schedule
        const newSchedule: ScheduleRow[] = [];
        let balance = amount;
        let currentDate = new Date(startDate);
        let totInterest = 0;
        let totPay = 0;

        for (let i = 1; i <= n; i++) {
            const interest = balance * r;
            let principal = 0;
            let currentPayment = calculatedPayment;

            if (repaymentType === 'interest-only') {
                principal = 0;
                if (i === n) {
                    // Last payment includes principal
                    currentPayment += amount;
                    principal = amount;
                }
            } else {
                // Fixed or Balloon
                principal = currentPayment - interest;
            }

            // Adjust for last month precision or Balloon final payment
            if (i === n && repaymentType === 'balloon') {
                // In balloon formula, the regular payment should leave exactly balloonAmount
                // But due to rounding, we might need adjustment? 
                // Actually, the formula ensures balance reaches BalloonAmount.
                // Let's stick to standard calc.
            }

            let closing = balance - principal;

            // Handle precision issues at end
            if (i === n) {
                if (repaymentType === 'fixed' || repaymentType === 'interest-only') {
                    if (Math.abs(closing) < 10) closing = 0; // Snap to 0
                    // Adjust final principal to match
                    principal = balance - closing;
                    currentPayment = principal + interest;
                } else if (repaymentType === 'balloon') {
                    // Closing should be balloonAmount
                    // Let's just let it flow, usually formula is precise enough or close.
                }
            }

            newSchedule.push({
                period: i,
                date: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                openingBalance: Math.round(balance),
                payment: Math.round(currentPayment),
                principal: Math.round(principal),
                interest: Math.round(interest),
                closingBalance: Math.round(closing),
            });

            balance = closing;
            totInterest += interest;
            totPay += currentPayment;

            // Increment date
            if (frequency === 'monthly') currentDate.setMonth(currentDate.getMonth() + 1);
            if (frequency === 'quarterly') currentDate.setMonth(currentDate.getMonth() + 3);
            if (frequency === 'yearly') currentDate.setFullYear(currentDate.getFullYear() + 1);
        }

        setSchedule(newSchedule);
        setTotalInterest(Math.round(totInterest));
        setTotalPayment(Math.round(totPay));
    };

    useEffect(() => {
        calculateLoan();
    }, [amount, rate, tenure, tenureType, repaymentType, balloonAmount, frequency, startDate]);

    const chartData = {
        labels: schedule.filter((_, i) => i % Math.ceil(schedule.length / 10) === 0).map(row => row.date),
        datasets: [
            {
                label: 'Outstanding Balance',
                data: schedule.filter((_, i) => i % Math.ceil(schedule.length / 10) === 0).map(row => row.closingBalance),
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Loan Calculation Schedule', 14, 15);

        doc.setFontSize(10);
        doc.text(`Loan Amount: ${amount}`, 14, 25);
        doc.text(`Interest Rate: ${rate}%`, 14, 30);
        doc.text(`Type: ${repaymentType.toUpperCase()}`, 14, 35);
        doc.text(`Payment: ${payment} / ${frequency}`, 14, 40);

        autoTable(doc, {
            startY: 45,
            head: [['Period', 'Date', 'Opening', 'Payment', 'Principal', 'Interest', 'Closing']],
            body: schedule.map(row => [
                row.period,
                row.date,
                row.openingBalance,
                row.payment,
                row.principal,
                row.interest,
                row.closingBalance
            ]),
        });

        doc.save('loan-schedule.pdf');
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <div className={styles.inputGroup}>
                        <label>Loan Amount</label>
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
                        <div className={styles.tenureWrapper}>
                            <input
                                type="number"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                            />
                            <div className={styles.toggles}>
                                <button
                                    className={tenureType === 'years' ? styles.active : ''}
                                    onClick={() => setTenureType('years')}
                                >Yr</button>
                                <button
                                    className={tenureType === 'months' ? styles.active : ''}
                                    onClick={() => setTenureType('months')}
                                >Mo</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Repayment Type</label>
                        <select
                            value={repaymentType}
                            onChange={(e) => setRepaymentType(e.target.value as RepaymentType)}
                            className={styles.select}
                        >
                            <option value="fixed">Fixed (Amortizing)</option>
                            <option value="interest-only">Interest Only</option>
                            <option value="balloon">Balloon Payment</option>
                        </select>
                    </div>

                    {repaymentType === 'balloon' && (
                        <div className={styles.inputGroup}>
                            <label>Balloon Amount (Final Payment)</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={balloonAmount}
                                    onChange={(e) => setBalloonAmount(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>Payment Frequency</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as Frequency)}
                            className={styles.select}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>
                </div>

                <div className={styles.results}>
                    <div className={styles.chartContainer}>
                        <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Balance Over Time' } } }} />
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.summaryItem}>
                            <span>Payment ({frequency})</span>
                            <span className={styles.highlight}>₹ {payment.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Interest</span>
                            <span>₹ {totalInterest.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Cost</span>
                            <span>₹ {totalPayment.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnSecondary} onClick={() => setShowSchedule(!showSchedule)}>
                    {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
                </button>
                <button className={styles.btnPrimary} onClick={downloadPDF}>
                    Download PDF
                </button>
            </div>

            {showSchedule && (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Date</th>
                                <th>Opening</th>
                                <th>Payment</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Closing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row) => (
                                <tr key={row.period}>
                                    <td>{row.period}</td>
                                    <td>{row.date}</td>
                                    <td>₹{row.openingBalance.toLocaleString()}</td>
                                    <td>₹{row.payment.toLocaleString()}</td>
                                    <td>₹{row.principal.toLocaleString()}</td>
                                    <td>₹{row.interest.toLocaleString()}</td>
                                    <td>₹{row.closingBalance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

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
import styles from './RDCalculator.module.css';

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
    month: number;
    date: string;
    deposit: number;
    interestEarned: number;
    balance: number;
}

type Frequency = 'quarterly' | 'monthly';

export default function RDCalculator() {
    const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
    const [rate, setRate] = useState<number>(7.0);
    const [tenureYears, setTenureYears] = useState<number>(1);
    const [tenureMonths, setTenureMonths] = useState<number>(0);
    const [frequency, setFrequency] = useState<Frequency>('quarterly');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [maturityAmount, setMaturityAmount] = useState<number>(0);
    const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [effectiveYield, setEffectiveYield] = useState<number>(0);
    const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
    const [showSchedule, setShowSchedule] = useState(false);

    const calculateRD = () => {
        if (monthlyDeposit <= 0 || rate <= 0) return;

        const totalMonths = tenureYears * 12 + tenureMonths;
        if (totalMonths < 3) return; // Minimum 3 months usually

        const r = rate / 100;
        let balance = 0;
        let totPrincipal = 0;
        const newSchedule: ScheduleRow[] = [];
        let currentDate = new Date(startDate);

        // Iterative calculation
        // For quarterly compounding, interest is added every 3 months.
        // For monthly, every month.

        // However, banks usually calculate RD interest using the formula:
        // I = P * n(n+1) / 24 * r/100 (Simple Interest approximation for monthly)
        // OR Compound interest on each installment.
        // Let's use the Compound Interest on each installment method which is standard for modern banks.
        // Each installment P earns interest for (N-i) months.

        // Actually, for iterative display, we can simulate the account balance.

        let currentInterest = 0;

        for (let i = 1; i <= totalMonths; i++) {
            // Add deposit
            balance += monthlyDeposit;
            totPrincipal += monthlyDeposit;

            // Calculate interest for this month
            // Rate per month = r / 12? 
            // If compounding is quarterly, we accumulate interest but only credit it every quarter?
            // Standard RD formula often assumes quarterly compounding.
            // Let's stick to a standard simulation:
            // Monthly rate = r/12.
            // If quarterly, effective quarterly rate = r/4.

            // Simplified approach often used:
            // A = P * (1+r/n)^(n*t) for each installment.

            // Let's use the iterative approach for the table.
            // We will accrue interest monthly, but compound it based on frequency.

            let interestForMonth = 0;

            if (frequency === 'monthly') {
                interestForMonth = balance * (r / 12);
                balance += interestForMonth;
            } else if (frequency === 'quarterly') {
                // Accrue simple interest for months 1, 2. Compound on month 3.
                // Actually, standard practice: 
                // Month 1: Balance = P. Interest = P * r/12.
                // Month 2: Balance = P + P. Interest = 2P * r/12.
                // Month 3: Balance = 3P. Interest = 3P * r/12.
                // End of Q1: Credit accumulated interest.

                // Let's simplify: Use the standard formula for Maturity Amount to get the final value correct,
                // and use a simplified linear projection for the chart/table if needed, or simulate correctly.

                // Simulation for Quarterly Compounding:
                // We need to track "uncredited interest".
            }
        }

        // Let's use the exact formula for Maturity Amount first to ensure accuracy.
        // M = P * n + Interest
        // General Formula for Quarterly Compounding RD:
        // This is complex to iterate perfectly matching bank software without exact day count.
        // We will use the standard approximation:
        // Iterate months.

        balance = 0;
        totPrincipal = 0;
        let accumulatedInterest = 0; // For quarterly

        for (let i = 1; i <= totalMonths; i++) {
            balance += monthlyDeposit;
            totPrincipal += monthlyDeposit;

            let monthlyRate = r / 12;
            let interest = 0;

            if (frequency === 'monthly') {
                interest = balance * monthlyRate;
                balance += interest;
            } else {
                // Quarterly
                // Interest is calculated on the balance but only added to principal every quarter?
                // Actually, most banks compound quarterly.
                // So for months 1, 2, interest is calculated on simple basis?
                // Let's use a robust library logic or standard approximation.
                // Approximation: Monthly compounding is close enough for visual, but let's try to be precise.

                // If we use the formula: A = P * (1+r/4)^(4*t) - P for each installment?
                // Let's stick to Monthly Compounding for the table as it's easiest to understand,
                // but allow the user to select.

                // If Quarterly:
                // We can treat it as: Every 3 months, interest is capitalized.
                interest = balance * monthlyRate; // Accrue
                accumulatedInterest += interest;

                if (i % 3 === 0) {
                    balance += accumulatedInterest;
                    accumulatedInterest = 0;
                }
            }

            newSchedule.push({
                month: i,
                date: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                deposit: monthlyDeposit,
                interestEarned: Math.round(frequency === 'monthly' ? interest : accumulatedInterest), // Show accrued
                balance: Math.round(balance + accumulatedInterest)
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Final adjustment for remaining accumulated interest if any (e.g. 4 month tenure)
        if (frequency === 'quarterly' && accumulatedInterest > 0) {
            balance += accumulatedInterest;
            // Update last row
            if (newSchedule.length > 0) {
                newSchedule[newSchedule.length - 1].balance = Math.round(balance);
            }
        }

        setMaturityAmount(Math.round(balance));
        setTotalPrincipal(totPrincipal);
        setTotalInterest(Math.round(balance - totPrincipal));

        // Yield
        const yieldVal = ((balance - totPrincipal) / totPrincipal) * (12 / totalMonths) * 100;
        setEffectiveYield(Number(yieldVal.toFixed(2)));

        setSchedule(newSchedule);
    };

    useEffect(() => {
        calculateRD();
    }, [monthlyDeposit, rate, tenureYears, tenureMonths, frequency, startDate]);

    const chartData = {
        labels: schedule.filter((_, i) => i % Math.ceil(schedule.length / 10) === 0).map(row => row.date),
        datasets: [
            {
                label: 'Balance Growth',
                data: schedule.filter((_, i) => i % Math.ceil(schedule.length / 10) === 0).map(row => row.balance),
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Total Principal',
                data: schedule.filter((_, i) => i % Math.ceil(schedule.length / 10) === 0).map((row, i) => (i + 1) * Math.ceil(schedule.length / 10) * monthlyDeposit), // Approx
                borderColor: '#2c3e50',
                borderDash: [5, 5],
                fill: false,
            }
        ],
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Recurring Deposit Schedule', 14, 15);

        doc.setFontSize(10);
        doc.text(`Monthly Deposit: ₹${monthlyDeposit}`, 14, 25);
        doc.text(`Interest Rate: ${rate}%`, 14, 30);
        doc.text(`Tenure: ${tenureYears} Years ${tenureMonths} Months`, 14, 35);
        doc.text(`Compounding: ${frequency}`, 14, 40);

        doc.text(`Maturity Amount: ₹${maturityAmount}`, 14, 50);
        doc.text(`Total Interest: ₹${totalInterest}`, 14, 55);

        autoTable(doc, {
            startY: 60,
            head: [['Month', 'Date', 'Deposit', 'Balance']],
            body: schedule.map(row => [
                row.month,
                row.date,
                row.deposit,
                row.balance
            ]),
        });

        doc.save('rd-schedule.pdf');
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <div className={styles.inputGroup}>
                        <label>Monthly Deposit</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={monthlyDeposit}
                                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                            />
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyDeposit}
                            onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
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
                            <option value="quarterly">Quarterly</option>
                            <option value="monthly">Monthly</option>
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
                        <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Growth Over Time' } } }} />
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.summaryItem}>
                            <span>Maturity Amount</span>
                            <span className={styles.highlight}>₹ {maturityAmount.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Deposit</span>
                            <span>₹ {totalPrincipal.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Interest</span>
                            <span>₹ {totalInterest.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Effective Yield</span>
                            <span style={{ color: '#27ae60', fontWeight: 700 }}>{effectiveYield}%</span>
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
                                <th>Month</th>
                                <th>Date</th>
                                <th>Deposit</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row) => (
                                <tr key={row.month}>
                                    <td>{row.month}</td>
                                    <td>{row.date}</td>
                                    <td>₹{row.deposit.toLocaleString()}</td>
                                    <td>₹{row.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './EMICalculator.module.css';
import AIInsights from '../AIInsights';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AmortizationRow {
    month: number;
    date: string;
    openingBalance: number;
    emi: number;
    principal: number;
    interest: number;
    closingBalance: number;
}

export default function EMICalculator() {
    const [amount, setAmount] = useState<number>(1000000);
    const [rate, setRate] = useState<number>(10.5);
    const [tenure, setTenure] = useState<number>(5);
    const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
    const [showSchedule, setShowSchedule] = useState(false);

    const calculateEMI = () => {
        const r = rate / 12 / 100;
        const n = tenureType === 'years' ? tenure * 12 : tenure;

        if (amount <= 0 || rate <= 0 || tenure <= 0) return;

        const emiValue = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(Math.round(emiValue));

        const totalPay = emiValue * n;
        setTotalPayment(Math.round(totalPay));
        setTotalInterest(Math.round(totalPay - amount));

        // Generate Amortization Schedule
        const newSchedule: AmortizationRow[] = [];
        let balance = amount;
        let currentDate = new Date(startDate);

        for (let i = 1; i <= n; i++) {
            const interest = balance * r;
            const principal = emiValue - interest;
            const closing = balance - principal;

            newSchedule.push({
                month: i,
                date: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                openingBalance: Math.round(balance),
                emi: Math.round(emiValue),
                principal: Math.round(principal),
                interest: Math.round(interest),
                closingBalance: Math.max(0, Math.round(closing)),
            });

            balance = closing;
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        setSchedule(newSchedule);
    };

    useEffect(() => {
        calculateEMI();
    }, [amount, rate, tenure, tenureType, startDate]);

    const chartData = {
        labels: ['Principal Loan Amount', 'Total Interest'],
        datasets: [
            {
                data: [amount, totalInterest],
                backgroundColor: ['#e53935', '#2c3e50'], // Red and Dark Blue
                borderWidth: 1,
            },
        ],
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('EMI Calculation Schedule', 14, 15);

        doc.setFontSize(10);
        doc.text(`Loan Amount: ${amount}`, 14, 25);
        doc.text(`Interest Rate: ${rate}%`, 14, 30);
        doc.text(`Tenure: ${tenure} ${tenureType}`, 14, 35);
        doc.text(`Monthly EMI: ${emi}`, 14, 40);

        autoTable(doc, {
            startY: 45,
            head: [['Month', 'Date', 'Opening', 'EMI', 'Principal', 'Interest', 'Closing']],
            body: schedule.map(row => [
                row.month,
                row.date,
                row.openingBalance,
                row.emi,
                row.principal,
                row.interest,
                row.closingBalance
            ]),
        });

        doc.save('emi-schedule.pdf');
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
                        <input
                            type="range"
                            min="10000"
                            max="10000000"
                            step="10000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
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
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className={styles.slider}
                        />
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
                        <Doughnut data={chartData} />
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.summaryItem}>
                            <span>Monthly EMI</span>
                            <span className={styles.highlight}>₹ {emi.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Interest</span>
                            <span>₹ {totalInterest.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Payment</span>
                            <span>₹ {totalPayment.toLocaleString()}</span>
                        </div>
                    </div>
                    {emi > 0 && (
                        <AIInsights
                            toolName="EMI Calculator"
                            inputData={{ loanAmount: amount, interestRate: rate, tenure: tenure }}
                            resultData={{ emi, totalInterest, totalAmount: totalPayment }}
                        />
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnSecondary} onClick={() => setShowSchedule(!showSchedule)}>
                    {showSchedule ? 'Hide Schedule' : 'Show Amortization Schedule'}
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
                                <th>Opening</th>
                                <th>EMI</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Closing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row) => (
                                <tr key={row.month}>
                                    <td>{row.month}</td>
                                    <td>{row.date}</td>
                                    <td>₹{row.openingBalance.toLocaleString()}</td>
                                    <td>₹{row.emi.toLocaleString()}</td>
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

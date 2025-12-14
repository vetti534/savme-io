'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './CompoundInterestCalculator.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Frequency = 'daily' | 'monthly' | 'quarterly' | 'semiannually' | 'annually';

const FREQUENCY_MAP: Record<Frequency, number> = {
    daily: 365,
    monthly: 12,
    quarterly: 4,
    semiannually: 2,
    annually: 1,
};

export default function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState<number>(10000);
    const [rate, setRate] = useState<number>(8); // Annual rate in %
    const [years, setYears] = useState<number>(5);
    const [compoundFreq, setCompoundFreq] = useState<Frequency>('annually');
    const [contribution, setContribution] = useState<number>(0);
    const [contributionFreq, setContributionFreq] = useState<Frequency>('monthly');

    const [maturityAmount, setMaturityAmount] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalInvested, setTotalInvested] = useState<number>(0);
    const [chartLabels, setChartLabels] = useState<string[]>([]);
    const [chartDataInvested, setChartDataInvested] = useState<number[]>([]);
    const [chartDataInterest, setChartDataInterest] = useState<number[]>([]);

    const calculateCI = () => {
        // We will simulate the growth period by period to be accurate and generate chart data
        // To keep it simple but accurate enough:
        // We'll iterate YEARLY for the chart, but calculate precise values internally.

        // BUT for accurate compounding mixed with contributions, a small time-step simulation is best.
        // Let's iterate MONTHLY as the base resolution for simulation (unless daily compounding).
        // Actually, "Daily" compounding with "Monthly" contribution is complex.

        // Robust Approach: 
        // 1. Calculate final exact math for the summary.
        // 2. Run a loop for yearly snapshot for the chart.

        // EXACT MATH:
        // A = P(1 + r/n)^(nt)  <-- Principal growth
        // Contributions are trickier with mismatched frequencies. 
        // So we will use a loop simulation for everything to ensure the chart and final result match perfectly.

        const n = FREQUENCY_MAP[compoundFreq]; // Compounding times per year
        const stepsPerYear = 12; // Simulation resolution (Monthly)
        const totalSteps = years * stepsPerYear;

        let currentBalance = principal;
        let totalContribution = 0;
        let accruedInterest = 0; // accumulated interest not yet added to principal (if n < 12)

        const yearlySnapshotLabels = [];
        const yearlySnapshotInvested = [];
        const yearlySnapshotInterest = [];

        // Reset loop vars
        currentBalance = principal;
        let principalInvested = principal;

        // We need to handle compounding and contributions correctly.
        // We'll increment time by 1/365 year (1 day) to be universally correct? Too slow for 30 years.
        // Let's use monthly resolution (step = 1/12 year).

        // Precision Mode:
        // If daily compounding, n=365. Rate per day = r / 365.
        // If monthly contribution, add at start/end of month.

        let chartInvested = [];
        let chartInterest = [];
        let labels = [];

        // Let's do a loop over YEARS for the chart, and inside calculate the value.
        for (let yr = 0; yr <= years; yr++) {
            // Calculate Value at Year 'yr'
            // Using formula for Principal: P * (1 + r/n)^(n*yr)

            // Future Value of Principal
            const r_decimal = rate / 100;
            const fv_principal = principal * Math.pow(1 + r_decimal / n, n * yr);

            // Future Value of Series (Contributions)
            // This fails if Contribution Freq != Compounding Freq easily.
            // Let's switch to the Iterative Day/Month Simulation for output generation 
            // because it allows "Daily Compounding" + "Monthly Deposit".
        }

        // SIMULATION APPROACH
        // Resolution: Monthly (1/12 year) represents decent accuracy for charts.
        // However, if compounding is Daily, we calculate growth over that month as balance * ((1+r/365)^(365/12) - 1)?
        // Yes available approximate growth factor for that month.

        let simBalance = principal;
        let simInvested = principal;

        labels.push('Start');
        chartInvested.push(principal);
        chartInterest.push(0);

        for (let y = 1; y <= years; y++) {
            // Simulate this year
            // Add contributions and compound

            for (let m = 0; m < 12; m++) {
                // 1. Add Contribution (Assuming Start of Period? or End?)
                // Let's assume Start of Period for max growth
                let added = 0;
                if (contribution > 0) {
                    const cFreq = FREQUENCY_MAP[contributionFreq];
                    // If monthly (12), add every month.
                    // If annually (1), add only at month 0 (Jan).
                    // If quarterly (4), add at month 0, 3, 6, 9.

                    const periodCheck = 12 / cFreq; // e.g. 12/12=1 (every 1 mo), 12/4=3 (every 3 mo)
                    // If cFreq is 'daily', we just add approx monthly sum? No, let's strictly follow freq logic for standard types.
                    // Assuming Daily contribution is rare. We handled 'daily' in compFreq but let's assume 'contributionFreq' is max monthly/yearly in UI?
                    // UI allows strict types.

                    // Logic: Is this month a contribution month?
                    // Using floating point check approx

                    // Simplification: We only check standard divisions.
                    const isContributionMonth = (m % (12 / cFreq) === 0);

                    // Wait, daily/weekly contribution is hard on monthly loop.
                    // Let's assume contribution freq matches loop if simpler. 
                    // Let's restrict contribution inputs in logic if needed, but let's try:

                    if (contributionFreq === 'daily') {
                        added = contribution * 30; // Approx
                    } else if (Math.floor(12 / cFreq) > 0 && m % (12 / cFreq) === 0) {
                        added = contribution;
                    }

                    simBalance += added;
                    simInvested += added;
                }

                // 2. Apply Interest for this Month
                // Effective Monthly Rate based on Compounding Freq
                // r_eff_month = (1 + r/n)^(n/12) - 1
                const r_decimal = rate / 100;
                const effective_rate = Math.pow(1 + r_decimal / n, n / 12) - 1;

                simBalance = simBalance * (1 + effective_rate);
            }

            labels.push(`Yr ${y}`);
            chartInvested.push(Math.round(simInvested));
            chartInterest.push(Math.round(simBalance - simInvested));
        }

        setMaturityAmount(Math.round(simBalance));
        setTotalInvested(Math.round(simInvested));
        setTotalInterest(Math.round(simBalance - simInvested));

        setChartLabels(labels);
        setChartDataInvested(chartInvested);
        setChartDataInterest(chartInterest);
    };

    useEffect(() => {
        calculateCI();
    }, [principal, rate, years, compoundFreq, contribution, contributionFreq]);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Total Invested',
                data: chartDataInvested,
                backgroundColor: '#718096',
                stack: 'Stack 0',
            },
            {
                label: 'Interest Earned',
                data: chartDataInterest,
                backgroundColor: '#27ae60',
                stack: 'Stack 0',
            },
        ],
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Compound Interest Calculation', 14, 15);
        doc.setFontSize(10);
        doc.text(`Principal: ₹${principal}`, 14, 25);
        doc.text(`Rate: ${rate}% (${compoundFreq})`, 14, 30);
        doc.text(`Tenure: ${years} Years`, 14, 35);

        doc.text(`Maturity Amount: ₹${maturityAmount.toLocaleString()}`, 14, 45);
        doc.text(`Total Investment: ₹${totalInvested.toLocaleString()}`, 14, 50);
        doc.text(`Interest Earned: ₹${totalInterest.toLocaleString()}`, 14, 55);

        const tableData = chartLabels.map((label, i) => [
            label,
            `Rs. ${chartDataInvested[i].toLocaleString()}`,
            `Rs. ${chartDataInterest[i].toLocaleString()}`,
            `Rs. ${(chartDataInvested[i] + chartDataInterest[i]).toLocaleString()}`
        ]);
        // Remove "Start" row if wanted, or keep. Table needs headers.

        autoTable(doc, {
            startY: 65,
            head: [['Year', 'Invested', 'Interest', 'Total Balance']],
            body: tableData.slice(1), // Skip "Start" 0th row for cleaner table
        });

        doc.save('compound-interest.pdf');
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
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Interest Rate (%)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Duration (Years)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Compounding Frequency</label>
                        <select
                            className={styles.select}
                            value={compoundFreq}
                            onChange={(e) => setCompoundFreq(e.target.value as Frequency)}
                        >
                            <option value="annually">Annually (1/yr)</option>
                            <option value="semiannually">Semi-Annually (2/yr)</option>
                            <option value="quarterly">Quarterly (4/yr)</option>
                            <option value="monthly">Monthly (12/yr)</option>
                            <option value="daily">Daily (365/yr)</option>
                        </select>
                    </div>

                    <div className={styles.separator}></div>

                    <div className={styles.inputGroup}>
                        <label>Additional Contribution (Optional)</label>
                        <div className={styles.row}>
                            <div className={styles.inputWrapper} style={{ flex: 1 }}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={contribution}
                                    onChange={(e) => setContribution(Number(e.target.value))}
                                />
                            </div>
                            <select
                                className={styles.select}
                                style={{ width: '120px' }}
                                value={contributionFreq}
                                onChange={(e) => setContributionFreq(e.target.value as Frequency)}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annually">Annually</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.results}>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <span>Principal</span>
                            <h3>₹ {principal.toLocaleString()}</h3>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Interest</span>
                            <h3 style={{ color: '#27ae60' }}>₹ {totalInterest.toLocaleString()}</h3>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Maturity Amount</span>
                            <h3 className={styles.highlight}>₹ {maturityAmount.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className={styles.chartWrapper}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { stacked: true },
                                    y: { stacked: true }
                                }
                            }}
                        />
                    </div>

                    <button className={styles.btnPrimary} onClick={downloadPDF}>
                        Download Schedule (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}

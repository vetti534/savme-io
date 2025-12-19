'use client';

import { useState, useEffect } from 'react';
import styles from './RDCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

type Frequency = 'quarterly' | 'monthly';

export default function RDCalculator() {
    const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
    const [rate, setRate] = useState<number>(7.0);
    const [tenureYears, setTenureYears] = useState<number>(1);
    const [tenureMonths, setTenureMonths] = useState<number>(0);
    const [frequency, setFrequency] = useState<Frequency>('quarterly');

    // Snapshot State
    const [displayState, setDisplayState] = useState({
        monthlyDeposit: 5000,
        rate: 7.0,
        tenure: '1 Yr 0 Mo',
        frequency: 'Quarterly'
    });

    const [maturityAmount, setMaturityAmount] = useState<number>(0);
    const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [effectiveYield, setEffectiveYield] = useState<number>(0);

    const calculateRD = () => {
        if (monthlyDeposit <= 0 || rate <= 0) return;

        const totalMonths = tenureYears * 12 + tenureMonths;
        if (totalMonths < 1) return;

        let finalMaturity = 0;
        const totPrincipal = monthlyDeposit * totalMonths;

        if (frequency === 'quarterly') {
            // General Formula for Quarterly Compounding RD used by Indian Banks
            // A = P * (1+r/400)^(n/3) ? No, standard formula is complex sum of series.
            // But widely accepted formula: each Installment compounds for remaining quarters.
            // Simplified approximation often used:
            // A = P * [ ((1+i)^n - 1) / (1 - (1+i)^(-1/3)) ] ... complex.
            // Let's use the robust iterative approach which is accurate.

            // Quarterly Compounding: Interest is added every 3 months.
            // But deposits are monthly.
            let balance = 0;
            // Iterate months
            for (let i = 1; i <= totalMonths; i++) {
                balance += monthlyDeposit;
                // Add simple interest for this month? 
                // Standard logic: Interest is compounded quarterly.
                // Month 1, 2, 3...
                // At end of Q1, interest on (Month1_Bal + Month2_Bal + Month3_Bal) ?
                // Let's use a standard library logic equivalent:
                // M = P * ((1+R/400)^(N/3)) ?? No.

                // Let's use the most standard formula:
                // Sum of compound interest for every installment.
                // Installment 1: Invested for N months.
                // Installment 2: Invested for N-1 months.
                // ...
                // Installment N: Invested for 1 month.
                // Formula: A = P * (1 + r/4)^t
                // Where t is in quarters.
            }

            // Revert to reliable iterative compounding
            balance = 0;
            const r = rate / 100;
            const monthlyRate = r / 12;

            // We'll simulate monthly checks.
            // If quarterly, we technically compound every 3 months.
            // But for RDs, interest often calculates monthly on running balance and compounds quarterly.

            let accruedInterest = 0;
            for (let m = 1; m <= totalMonths; m++) {
                balance += monthlyDeposit;
                const interest = balance * monthlyRate; // Interest for this month
                accruedInterest += interest;

                // Compound every 3rd month
                if (m % 3 === 0) {
                    balance += accruedInterest;
                    accruedInterest = 0;
                }
            }
            // Add remaining interest at end
            balance += accruedInterest;

            finalMaturity = Math.round(balance);

        } else {
            // Calculator for Monthly compounding
            // M = P * ((1+i)^n - 1) / i * (1+i) -- Annuity due formula?
            // No, RD is annuity. 
            // Formula: M = P * [ (1+r/n)^(nt) - 1 ] / (1-(1+r/n)^(-1)) ?
            // Let's use iterative for guaranteed accuracy.
            let balance = 0;
            const monthlyRate = (rate / 100) / 12;
            for (let i = 0; i < totalMonths; i++) {
                balance += monthlyDeposit;
                balance += balance * monthlyRate;
            }
            finalMaturity = Math.round(balance);
        }

        const interestEarned = finalMaturity - totPrincipal;

        // CAGR / Yield
        // Simple Absolute Yield = (Interest/Principal) * 100 / (Years) roughly?
        // Let's show Absolute Return % for clarity or effective annualized.
        // Effective Annualized Yield (XIRR usually required for RD). 
        // Let's show Simple Absolute Return %: (Interest / Principal) * 100
        // Or better: annualized yield estimate.
        const absReturn = (interestEarned / totPrincipal) * 100;
        const annualized = absReturn / (totalMonths / 12);

        setMaturityAmount(finalMaturity);
        setTotalPrincipal(totPrincipal);
        setTotalInterest(interestEarned);
        setEffectiveYield(Number(annualized.toFixed(2)));

        setDisplayState({
            monthlyDeposit,
            rate,
            tenure: `${tenureYears} Yr ${tenureMonths} Mo`,
            frequency: frequency.charAt(0).toUpperCase() + frequency.slice(1)
        });
    };

    // Auto-calculate on mount
    useEffect(() => {
        calculateRD();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        setMonthlyDeposit(5000);
        setRate(7.0);
        setTenureYears(1);
        setTenureMonths(0);
        setFrequency('quarterly');
        setMaturityAmount(0);
        setTotalPrincipal(0);
        setTotalInterest(0);
        setEffectiveYield(0);
        setDisplayState({
            monthlyDeposit: 5000,
            rate: 7.0,
            tenure: '1 Yr 0 Mo',
            frequency: 'Quarterly'
        });
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>
                {/* Intro */}
                <div className="mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">RD Calculator</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Calculate potential returns on your Recurring Deposits. Plan your monthly savings with accurate maturity estimates.
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Monthly Deposit</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={monthlyDeposit}
                                    onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Amount stored every month</p>
                            <div className={styles.presets}>
                                {[1000, 2000, 5000, 10000].map(val => (
                                    <button key={val} onClick={() => setMonthlyDeposit(val)}>₹{val / 1000}k</button>
                                ))}
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
                            <label>Interest Rate (p.a)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                />
                                <span>%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Annual interest rate</p>
                            <div className={styles.presets}>
                                {[5.5, 6.5, 7.0, 8.0].map(val => (
                                    <button key={val} onClick={() => setRate(val)}>{val}%</button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="15"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Tenure</label>
                            <div className="flex gap-4">
                                <div className={styles.inputWrapper + ' flex-1'}>
                                    <input
                                        type="number"
                                        value={tenureYears}
                                        onChange={(e) => setTenureYears(Number(e.target.value))}
                                    />
                                    <span className="text-sm">Yr</span>
                                </div>
                                <div className={styles.inputWrapper + ' flex-1'}>
                                    <input
                                        type="number"
                                        value={tenureMonths}
                                        onChange={(e) => setTenureMonths(Number(e.target.value))}
                                    />
                                    <span className="text-sm">Mo</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Duration of RD</p>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={tenureYears}
                                onChange={(e) => setTenureYears(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.advancedOptions}>
                            <details className="group">
                                <summary className="flex items-center cursor-pointer text-blue-600 font-semibold mb-2 list-none">
                                    <span className="mr-2 group-open:rotate-90 transition-transform">▸</span>
                                    Advanced: Compounding Frequency
                                </summary>
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className={styles.inputGroup}>
                                        <label>Compounding Frequency</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(['monthly', 'quarterly'] as Frequency[]).map(freq => (
                                                <button
                                                    key={freq}
                                                    onClick={() => setFrequency(freq)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-semibold border ${frequency === freq
                                                        ? 'bg-black text-white border-black'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnPrimary} onClick={calculateRD}>
                                Calculate
                            </button>
                            <button className={styles.btnSecondary} onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className={styles.results}>
                        <ToolResult
                            title={`₹ ${maturityAmount.toLocaleString()}`}
                            subTitle={`Total Interest: ₹ ${totalInterest.toLocaleString()}`}
                            toolName="RD Calculator"
                            actionsPosition="bottom"
                            extraStats={[
                                { label: 'Principal', value: `₹ ${totalPrincipal.toLocaleString()}` },
                                { label: 'Interest Rate', value: `${displayState.rate}%` },
                                { label: 'Eff. Yield (p.a)', value: `${effectiveYield}%` }
                            ]}
                            aiPrompt={`RD Calculator Result. Monthly Deposit: ${displayState.monthlyDeposit}, Rate: ${displayState.rate}%, Tenure: ${displayState.tenure}.
                            Maturity: ${maturityAmount}. Interest: ${totalInterest}. Yield: ${effectiveYield}%.
                            Compounding: ${displayState.frequency}.
                            Give me quick analysis or comparison with FD/SIP.`}
                            explanation={[
                                `<strong>Monthly Deposit:</strong> You set aside <strong>₹${displayState.monthlyDeposit.toLocaleString()}</strong> every month for <strong>${displayState.tenure}</strong>.`,
                                `<strong>Total Principal:</strong> Your total investment over this period is <strong>₹${totalPrincipal.toLocaleString()}</strong>.`,
                                `<strong>Interest:</strong> At <strong>${displayState.rate}%</strong>, your wealth grows by <strong>₹${totalInterest.toLocaleString()}</strong>.`,
                                `<strong>Maturity:</strong> You will receive <strong>₹${maturityAmount.toLocaleString()}</strong> at the end of the term.`
                            ]}
                        />
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">What is an RD?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                A Recurring Deposit (RD) helps you save a small fixed amount every month. It earns interest similar to a Fixed Deposit (FD), making it ideal for disciplined savings.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">How is RD interest calculated?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Interest calculates on the reducing principal (accumulated balance). Most banks compound it quarterly, similar to FDs.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Can I withdraw prematurely?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Yes, most banks allow premature withdrawal but often charge a small penalty (e.g., 1% lower interest rate).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    <div className="hidden md:block mb-8">
                        <AdSlot label="Advertisement" className="min-h-[250px]" variant="clean" />
                    </div>
                    <RelatedTools
                        currentToolSlug="rd-calculator"
                        variant="card"
                        toolSlugs={[
                            'fd-calculator',
                            'sip-calculator',
                            'simple-interest-calculator',
                            'compound-interest-calculator',
                            'emi-calculator',
                            'average-calculator',
                            'budget-calculator',
                            'mortgage-calculator'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

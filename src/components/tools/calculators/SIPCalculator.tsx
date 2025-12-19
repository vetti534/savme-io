'use client';

import { useState, useEffect } from 'react';
import styles from './SIPCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

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

    // Snapshot of inputs for Display Results (prevents jitter/re-render of results on slider move)
    const [displayState, setDisplayState] = useState({
        monthlyInvestment: 5000,
        expectedReturn: 12,
        tenureYears: 10,
        inflationAdjustedValue: 0
    });

    const [investedAmount, setInvestedAmount] = useState<number>(0);
    const [estReturns, setEstReturns] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);
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

        const finalInvested = Math.round(totalInvested);
        const finalValue = Math.round(currentValue);
        const finalEstReturns = Math.round(currentValue - totalInvested);

        setInvestedAmount(finalInvested);
        setTotalValue(finalValue);
        setEstReturns(finalEstReturns);
        setProjections(yearlyProjections);

        // Inflation Adjustment
        let inflationAdj = 0;
        if (inflationRate > 0) {
            // Real Value = Nominal Value / (1 + inflation)^years
            const realValue = currentValue / Math.pow(1 + inflationRate / 100, tenureYears);
            inflationAdj = Math.round(realValue);
        }

        // Update Display Snapshot
        setDisplayState({
            monthlyInvestment,
            expectedReturn,
            tenureYears,
            inflationAdjustedValue: inflationAdj
        });
    };

    // Auto-calculate on mount only
    useEffect(() => {
        calculateSIP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        setMonthlyInvestment(5000);
        setExpectedReturn(12);
        setTenureYears(10);
        setStepUpRate(0);
        setInflationRate(0);
        setInvestedAmount(0);
        setEstReturns(0);
        setTotalValue(0);
        setProjections([]);
        setDisplayState({
            monthlyInvestment: 5000,
            expectedReturn: 12,
            tenureYears: 10,
            inflationAdjustedValue: 0
        });
    };



    return (
        <div className={styles.pageGrid}>
            {/* MAIN CONTENT */}
            <div className={styles.mainColumn}>

                {/* Intro Section */}
                <div className="mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">SIP Calculator</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Use this SIP Calculator to estimate long-term mutual fund returns. Calculate the future value of your monthly SIP investments accurately with our free online tool.
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Monthly Investment</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={monthlyInvestment}
                                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Amount invested every month</p>
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
                                    inputMode="decimal"
                                    value={expectedReturn}
                                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                />
                                <span>%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Average annual return from mutual funds</p>
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
                                    inputMode="numeric"
                                    value={tenureYears}
                                    onChange={(e) => setTenureYears(Number(e.target.value))}
                                />
                                <span>Yr</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Total investment period</p>
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
                            <details className="group">
                                <summary className="flex items-center cursor-pointer text-blue-600 font-semibold mb-2 list-none">
                                    <span className="mr-2 group-open:rotate-90 transition-transform">▸</span>
                                    Advanced: Step-up & Inflation
                                    <span className="ml-2 text-xs text-gray-400 font-normal opacity-0 group-open:opacity-100 transition-opacity">
                                        Optional – for advanced planning
                                    </span>
                                </summary>
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className={styles.inputGroup}>
                                        <label>Annual Step-up (%)</label>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                value={stepUpRate}
                                                onChange={(e) => setStepUpRate(Number(e.target.value))}
                                            />
                                            <span>%</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Increase investment annually</p>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Inflation Rate (%)</label>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                value={inflationRate}
                                                onChange={(e) => setInflationRate(Number(e.target.value))}
                                            />
                                            <span>%</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Adjust final value for inflation
                                        </p>
                                    </div>
                                </div>
                            </details>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnPrimary} onClick={calculateSIP}>
                                Calculate
                            </button>
                            <button className={styles.btnSecondary} onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className={styles.results}>
                        <ToolResult
                            title={`₹ ${totalValue.toLocaleString()}`}
                            subTitle={`Wealth Gained: ₹ ${estReturns.toLocaleString()}`}
                            toolName="SIP Calculator"
                            actionsPosition="bottom"
                            extraStats={[
                                { label: 'Invested Amount', value: `₹ ${investedAmount.toLocaleString()}` },
                                { label: 'Est. Returns', value: `₹ ${estReturns.toLocaleString()}` },
                                { label: 'Total Value', value: `₹ ${totalValue.toLocaleString()}` }
                            ]}
                            aiPrompt={`SIP Calculator Analysis. Monthly: ${displayState.monthlyInvestment}, Rate: ${displayState.expectedReturn}%, Tenure: ${displayState.tenureYears} years.
                            Total Value: ${totalValue}. Invested: ${investedAmount}. Returns: ${estReturns}.
                            Inflation Adjusted: ${displayState.inflationAdjustedValue}.
                            Give me investment advice based on these numbers.`}
                            explanation={[
                                `<strong>Monthly Investment:</strong> You invest <strong>₹${displayState.monthlyInvestment.toLocaleString()}</strong> every month for <strong>${displayState.tenureYears} years</strong>.`,
                                `<strong>Total Investment:</strong> Over ${displayState.tenureYears} years, your total deposited amount will be <strong>₹${investedAmount.toLocaleString()}</strong>.`,
                                `<strong>Power of Compounding:</strong> At an expected return of <strong>${displayState.expectedReturn}%</strong>, your money grows exponentially.`,
                                `<strong>Final Value:</strong> Your estimated maturity amount calculates to <strong>₹${totalValue.toLocaleString()}</strong>.`
                            ]}
                            pdfTable={{
                                head: [['Year', 'Invested Amount', 'Total Value']],
                                body: projections.map(row => [
                                    row.year,
                                    row.invested,
                                    row.value
                                ])
                            }}
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">What is SIP?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                A Systematic Investment Plan (SIP) is a way to invest money in mutual funds. consistency is key – you invest a fixed amount every month, which helps in disciplined wealth creation over time.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">How is SIP return calculated?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                SIP returns are calculated using the Compound Annual Growth Rate (CAGR) method. However, for monthly deposits, the specific formula used is complex, taking into account the time value of each installment.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Is this calculator accurate?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Yes, this calculator uses standard financial formulas to estimate returns. However, actual market returns vary and mutual fund performance is subject to market risks.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">How much should I invest in SIP?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Financial advisors often recommend the 50-30-20 rule: 50% for needs, 30% for wants, and 20% for savings/investments. You can start with as low as ₹500/month.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* SIDEBAR */}
            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    {/* Ad Placeholder - Hidden on mobile, visible on desktop */}
                    <div className="hidden md:block mb-8">
                        <AdSlot label="Advertisement" className="min-h-[250px]" variant="clean" />
                    </div>

                    {/* Specific Tools */}
                    <RelatedTools
                        currentToolSlug="sip-calculator"
                        variant="card"
                        toolSlugs={[
                            'emi-calculator',
                            'loan-calculator',
                            'simple-interest-calculator',
                            'compound-interest-calculator',
                            'fd-calculator',
                            'rd-calculator',
                            'mortgage-calculator',
                            'rent-vs-buy-calculator'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

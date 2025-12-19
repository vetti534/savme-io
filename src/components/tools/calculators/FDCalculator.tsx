'use client';

import { useState, useEffect } from 'react';
import styles from './FDCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

type Frequency = 'yearly' | 'half-yearly' | 'quarterly' | 'monthly';

export default function FDCalculator() {
    const [principal, setPrincipal] = useState<number>(100000);
    const [rate, setRate] = useState<number>(6.5);
    const [tenureYears, setTenureYears] = useState<number>(5);
    const [tenureMonths, setTenureMonths] = useState<number>(0);
    const [frequency, setFrequency] = useState<Frequency>('quarterly');
    const [isTdsApplicable, setIsTdsApplicable] = useState<boolean>(false);
    const [tdsRate, setTdsRate] = useState<number>(10);

    // Snapshot State
    const [displayState, setDisplayState] = useState({
        principal: 100000,
        rate: 6.5,
        tenure: '5 Years 0 Months',
        frequency: 'Quarterly',
        postTaxMaturity: 0
    });

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

        // Formula: A = P * (1 + r/n)^(n*t)
        const amount = principal * Math.pow(1 + r / n, n * t);
        const interest = amount - principal;

        const finalMaturity = Math.round(amount);
        const finalInterest = Math.round(interest);

        // Effective Yield (CAGR)
        const cagr = (Math.pow(amount / principal, 1 / t) - 1) * 100;
        const finalYield = Number(cagr.toFixed(2));

        // Tax Calculation
        let finalPostTax = finalMaturity;
        if (isTdsApplicable) {
            const tax = finalInterest * (tdsRate / 100);
            finalPostTax = Math.round(amount - tax);
        }

        setMaturityAmount(finalMaturity);
        setTotalInterest(finalInterest);
        setEffectiveYield(finalYield);
        setPostTaxMaturity(finalPostTax);

        setDisplayState({
            principal,
            rate,
            tenure: `${tenureYears} Yr ${tenureMonths} Mo`,
            frequency: frequency.charAt(0).toUpperCase() + frequency.slice(1),
            postTaxMaturity: isTdsApplicable ? finalPostTax : 0
        });
    };

    // Auto-calculate on mount
    useEffect(() => {
        calculateFD();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        setPrincipal(100000);
        setRate(6.5);
        setTenureYears(5);
        setTenureMonths(0);
        setFrequency('quarterly');
        setIsTdsApplicable(false);
        setMaturityAmount(0);
        setTotalInterest(0);
        setPostTaxMaturity(0);
        setDisplayState({
            principal: 100000,
            rate: 6.5,
            tenure: '5 Yr 0 Mo',
            frequency: 'Quarterly',
            postTaxMaturity: 0
        });
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>
                {/* Intro */}
                <div className="mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">FD Calculator</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Calculate maturity amount and interest earned on your Fixed Deposits. Compare interest rates and distinct compounding frequencies.
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Principal Amount</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Total deposit amount</p>
                            <div className={styles.presets}>
                                {[10000, 50000, 100000, 500000].map(val => (
                                    <button key={val} onClick={() => setPrincipal(val)}>₹{val / 1000}k</button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="1000000"
                                step="5000"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
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
                                {[5, 6, 7, 8].map(val => (
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
                            <p className="text-xs text-gray-500 mt-1 font-medium">Duration of deposit</p>
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
                                    Advanced: Compounding & Tax
                                </summary>
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className={styles.inputGroup}>
                                        <label>Compounding Frequency</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(['monthly', 'quarterly', 'half-yearly', 'yearly'] as Frequency[]).map(freq => (
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

                                    <div className={styles.inputGroup}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id="tds"
                                                checked={isTdsApplicable}
                                                onChange={(e) => setIsTdsApplicable(e.target.checked)}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <label htmlFor="tds" className="mb-0 cursor-pointer">Apply TDS</label>
                                        </div>
                                        {isTdsApplicable && (
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    value={tdsRate}
                                                    onChange={(e) => setTdsRate(Number(e.target.value))}
                                                />
                                                <span>%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </details>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnPrimary} onClick={calculateFD}>
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
                            toolName="FD Calculator"
                            actionsPosition="bottom"
                            extraStats={[
                                { label: 'Principal', value: `₹ ${displayState.principal.toLocaleString()}` },
                                { label: 'Interest Rate', value: `${displayState.rate}%` },
                                { label: 'Eff. Yield', value: `${effectiveYield}%` },
                                ...(displayState.postTaxMaturity > 0 ? [{ label: 'Post-Tax', value: `₹ ${displayState.postTaxMaturity.toLocaleString()}` }] : [])
                            ]}
                            aiPrompt={`FD Calculator Result. Principal: ${displayState.principal}, Rate: ${displayState.rate}%, Tenure: ${displayState.tenure}.
                            Maturity: ${maturityAmount}. Interest: ${totalInterest}. Yield: ${effectiveYield}%.
                            Compounding: ${displayState.frequency}.
                            Give me quick analysis or comparison with other instruments.`}
                            explanation={[
                                `<strong>Investment:</strong> You deposit <strong>₹${displayState.principal.toLocaleString()}</strong> for <strong>${displayState.tenure}</strong>.`,
                                `<strong>Interest:</strong> At <strong>${displayState.rate}%</strong> (${displayState.frequency} compounding), you earn <strong>₹${totalInterest.toLocaleString()}</strong> in interest.`,
                                `<strong>Maturity:</strong> The final amount you receive is <strong>₹${maturityAmount.toLocaleString()}</strong>.`,
                                `<strong>Yield:</strong> Your effective annual yield is <strong>${effectiveYield}%</strong>.`
                            ]}
                        />
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">How is FD interest calculated?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Most banks use compound interest calculated quarterly. The formula is A = P * (1 + r/n)^(nt), where P is principal, r is rate, n is frequency, and t is time.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">What is TDS on FD?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Tax Deducted at Source (TDS) is applicable if your interest income exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year. Typically deducted at 10%.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Is FD risk-free?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                FDs are considered very safe, especially in large banks. In India, deposits up to ₹5 Lakh are insured by DICGC.
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
                        currentToolSlug="fd-calculator"
                        variant="card"
                        toolSlugs={[
                            'rd-calculator',
                            'sip-calculator',
                            'simple-interest-calculator',
                            'compound-interest-calculator',
                            'emi-calculator',
                            'inflation-calculator',
                            'salary-calculator',
                            'income-tax-calculator'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

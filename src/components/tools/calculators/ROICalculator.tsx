'use client';

import { useState, useEffect } from 'react';
import styles from './ROICalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

export default function ROICalculator() {
    const [invested, setInvested] = useState<number>(10000);
    const [returned, setReturned] = useState<number>(15000);
    const [years, setYears] = useState<number>(1);

    // Snapshot State for Results
    const [displayState, setDisplayState] = useState({
        invested: 10000,
        returned: 15000,
        years: 1
    });

    const [roi, setRoi] = useState<number>(0);
    const [annualizedRoi, setAnnualizedRoi] = useState<number>(0);
    const [profit, setProfit] = useState<number>(0);

    const calculateROI = () => {
        if (invested <= 0) return;

        const netProfit = returned - invested;
        const totalRoiVal = (netProfit / invested) * 100;

        // Annualized ROI = ((Total Value / Cost) ^ (1/t)) - 1
        // But simpler approximation if years < 1? Standard formula works for all t > 0
        let annualRoiVal = 0;
        if (years > 0 && returned > 0) {
            annualRoiVal = (Math.pow(returned / invested, 1 / years) - 1) * 100;
        }

        setProfit(netProfit);
        setRoi(Number(totalRoiVal.toFixed(2)));
        setAnnualizedRoi(Number(annualRoiVal.toFixed(2)));

        setDisplayState({
            invested,
            returned,
            years
        });
    };

    // Auto-calculate on mount
    useEffect(() => {
        calculateROI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        setInvested(10000);
        setReturned(15000);
        setYears(1);
        setProfit(0);
        setRoi(0);
        setAnnualizedRoi(0);
        setDisplayState({
            invested: 10000,
            returned: 15000,
            years: 1
        });
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>
                {/* Intro */}
                <div className="mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">ROI Calculator</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Evaluate the efficiency of your investments. Calculate total Return on Investment (ROI) and Annualized ROI (CAGR) instantly.
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Amount Invested</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={invested}
                                    onChange={(e) => setInvested(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Initial cost of investment</p>
                            <div className={styles.presets}>
                                {[5000, 10000, 50000, 100000].map(val => (
                                    <button key={val} onClick={() => setInvested(val)}>₹{val / 1000}k</button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="1000000"
                                step="1000"
                                value={invested}
                                onChange={(e) => setInvested(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Amount Returned</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={returned}
                                    onChange={(e) => setReturned(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Final value of investment</p>
                            <input
                                type="range"
                                min={invested} // Usually higher, but can be loss
                                max={invested * 5}
                                step="1000"
                                value={returned}
                                onChange={(e) => setReturned(Number(e.target.value))}
                                className={styles.slider}
                                style={{ accentColor: returned >= invested ? '#2563eb' : '#ef4444' }}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Investment Duration (Years)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                />
                                <span className="text-sm">Yr</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Time period held</p>
                            <input
                                type="range"
                                min="0.5"
                                max="30"
                                step="0.5"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnPrimary} onClick={calculateROI}>
                                Calculate ROI
                            </button>
                            <button className={styles.btnSecondary} onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className={styles.results}>
                        <ToolResult
                            title={`${roi}%`}
                            subTitle={`Total Profit: ${profit >= 0 ? '+' : ''}₹${profit.toLocaleString()}`}
                            toolName="ROI Calculator"
                            actionsPosition="bottom"
                            extraStats={[
                                { label: 'Invested', value: `₹ ${displayState.invested.toLocaleString()}` },
                                { label: 'Returned', value: `₹ ${displayState.returned.toLocaleString()}` },
                                { label: 'Annualized ROI', value: `${annualizedRoi}%` }
                            ]}
                            aiPrompt={`ROI Calculator Result. Invested: ${displayState.invested}, Returned: ${displayState.returned}, Duration: ${displayState.years} years.
                            Total ROI: ${roi}%. Annualized ROI: ${annualizedRoi}%. Profit: ${profit}.
                            Analyze this return performance.`}
                            explanation={[
                                `<strong>Total Gain:</strong> You made a profit of <strong>₹${profit.toLocaleString()}</strong> on your investment of <strong>₹${displayState.invested.toLocaleString()}</strong>.`,
                                `<strong>ROI:</strong> Your total return on investment is <strong>${roi}%</strong>.`,
                                `<strong>Annualized:</strong> Over <strong>${displayState.years} years</strong>, your compound annual growth rate (CAGR) is <strong>${annualizedRoi}%</strong>.`
                            ]}
                        />
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">What is ROI?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Return on Investment (ROI) measures the gain or loss generated on an investment relative to the amount of money invested. It is usually expressed as a percentage.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">How is ROI calculated?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                The basic formula is: <code>ROI = (Net Profit / Cost of Investment) x 100</code>. Net Profit is the final value minus the initial cost.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">What is Annualized ROI?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Annualized ROI provides the geometric average amount of money earned by an investment each year over a given time period. It allows you to compare investments held for different durations.
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
                        currentToolSlug="roi-calculator"
                        variant="card"
                        toolSlugs={[
                            'sip-calculator',
                            'fd-calculator',
                            'rd-calculator',
                            'simple-interest-calculator',
                            'compound-interest-calculator',
                            'margin-calculator',
                            'profit-loss-calculator',
                            'percentage-calculator'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

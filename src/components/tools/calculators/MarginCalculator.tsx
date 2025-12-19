'use client';

import { useState, useEffect } from 'react';
import styles from './MarginCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

export default function MarginCalculator() {
    const [cost, setCost] = useState<number>(100);
    const [revenue, setRevenue] = useState<number>(150);
    const [marginPercent, setMarginPercent] = useState<number>(33.33);

    const [profit, setProfit] = useState<number>(0);
    const [margin, setMargin] = useState<number>(0);
    const [markup, setMarkup] = useState<number>(0);

    // Snapshot State
    const [displayState, setDisplayState] = useState({
        cost: 100,
        revenue: 150
    });

    const calculateValues = () => {
        if (cost <= 0 || revenue <= 0) return;

        const calculatedProfit = revenue - cost;
        const calculatedMargin = (calculatedProfit / revenue) * 100;
        const calculatedMarkup = (calculatedProfit / cost) * 100;

        setProfit(Number(calculatedProfit.toFixed(2)));
        setMargin(Number(calculatedMargin.toFixed(2)));
        setMarkup(Number(calculatedMarkup.toFixed(2)));

        setDisplayState({
            cost,
            revenue
        });
    };

    // Auto-calculate on mount
    useEffect(() => {
        calculateValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        setCost(100);
        setRevenue(150);
        setProfit(50);
        setMargin(33.33);
        setMarkup(50);
        setDisplayState({
            cost: 100,
            revenue: 150
        });
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>
                {/* Intro */}
                <div className="mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Margin Calculator</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Calculate your gross profit margin, markup percentage, and total profit instantly. Ideal for pricing products and services.
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Cost (Purchase Price)</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cost}
                                    onChange={(e) => setCost(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Cost to buy or produce</p>
                            <div className={styles.presets}>
                                {[50, 100, 500, 1000].map(val => (
                                    <button key={val} onClick={() => setCost(val)}>₹{val}</button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5000"
                                step="10"
                                value={cost}
                                onChange={(e) => setCost(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Revenue (Selling Price)</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={revenue}
                                    onChange={(e) => setRevenue(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Price you sell for</p>
                            <div className={styles.presets}>
                                {[100, 200, 1000, 2000].map(val => (
                                    <button key={val} onClick={() => setRevenue(val)}>₹{val}</button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min={cost}
                                max={cost * 5}
                                step="10"
                                value={revenue}
                                onChange={(e) => setRevenue(Number(e.target.value))}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnPrimary} onClick={calculateValues}>
                                Calculate Margin
                            </button>
                            <button className={styles.btnSecondary} onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className={styles.results}>
                        <ToolResult
                            title={`${margin}%`}
                            subTitle={`Gross Margin Percentage`}
                            toolName="Margin Calculator"
                            actionsPosition="bottom"
                            extraStats={[
                                { label: 'Profit', value: `₹ ${profit.toLocaleString()}` },
                                { label: 'Markup', value: `${markup}%` },
                                { label: 'Cost', value: `₹ ${displayState.cost.toLocaleString()}` },
                                { label: 'Revenue', value: `₹ ${displayState.revenue.toLocaleString()}` }
                            ]}
                            aiPrompt={`Margin Calculator. Cost: ${displayState.cost}, Revenue: ${displayState.revenue}.
                            Gross Margin: ${margin}%. Markup: ${markup}%. Profit: ${profit}.
                            Explain difference between Margin and Markup simply.`}
                            explanation={[
                                `<strong>Margin:</strong> Your Gross Margin is <strong>${margin}%</strong>. This means you keep ₹${margin} for every ₹100 of revenue.`,
                                `<strong>Markup:</strong> Your Markup is <strong>${markup}%</strong>. You are selling the item for ${markup}% more than its cost.`,
                                `<strong>Profit:</strong> You create <strong>₹${profit.toLocaleString()}</strong> in profit for each unit sold.`
                            ]}
                        />
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Difference between Margin and Markup?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>Margin</strong> (or Gross Margin) is profit divided by Revenue. It shows how much you keep from total sales. <br />
                                <strong>Markup</strong> is profit divided by Cost. It shows how much you added to the cost price.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Why is Margin always lower than Markup?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Because Margin is based on the total selling price (which is Cost + Profit), whereas Markup is based only on the Cost. The denominator for Margin is larger, making the percentage smaller.
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
                        currentToolSlug="margin-calculator"
                        variant="card"
                        toolSlugs={[
                            'roi-calculator',
                            'percentage-calculator',
                            'gst-calculator',
                            'discount-calculator',
                            'sip-calculator',
                            'simple-interest-calculator'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

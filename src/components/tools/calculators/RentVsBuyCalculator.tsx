'use client';

import { useState, useEffect } from 'react';
import styles from './RentVsBuyCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

type Mode = 'basic' | 'rule5' | 'compound' | 'india' | 'horizon';

export default function RentVsBuyCalculator() {
    const [mode, setMode] = useState<Mode>('basic');

    // Basic & India Inputs
    const [rent, setRent] = useState(25000);
    const [rentIncrease, setRentIncrease] = useState(5); // % annual
    const [homePrice, setHomePrice] = useState(7500000);
    const [downPayment, setDownPayment] = useState(1500000);
    const [interestRate, setInterestRate] = useState(8.5); // India style high rate default
    const [tenure, setTenure] = useState(20);
    const [appreciation, setAppreciation] = useState(5); // Home value growth
    const [investmentReturn, setInvestmentReturn] = useState(10); // Opportunity cost return

    // Results
    const [rentCost, setRentCost] = useState(0);
    const [buyCost, setBuyCost] = useState(0);
    const [verdict, setVerdict] = useState('');
    const [explanation, setExplanation] = useState<string[]>([]);
    const [extraStats, setExtraStats] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        // Initial load only
        calculate();
    }, []);

    const calculate = () => {
        let expl: string[] = [];
        let rCost = 0;
        let bCost = 0;

        if (mode === 'rule5') {
            // 5% Rule: Unrecoverable cost of buying ~ 5% of home value annually
            // (1% Prop Tax + 1% Maintenance + 3% Cost of Capital/Interest)
            const annualBuyCost = homePrice * 0.05;
            const monthlyBuyCost = annualBuyCost / 12;

            expl.push(`The <strong>5% Rule</strong> estimates the unrecoverable cost of owning a home is roughly 5% of its total value per year.`);
            expl.push(`Buy Cost (Annual) = 5% of ₹${homePrice.toLocaleString()} = <strong>₹${annualBuyCost.toLocaleString()}</strong>`);
            expl.push(`Buy Cost (Monthly equivalent) = <strong>₹${Math.round(monthlyBuyCost).toLocaleString()}</strong>`);
            expl.push(`Rent Cost (Monthly) = <strong>₹${rent.toLocaleString()}</strong>`);

            rCost = rent * 12;
            bCost = annualBuyCost; // For comparison sake purely on unrecoverable

            if (rent < monthlyBuyCost) {
                setVerdict('Renting is Financially Better (by 5% Rule)');
                expl.push(`Since monthly rent (₹${rent.toLocaleString()}) is LESS than the estimated monthly unrecoverable buying cost (₹${Math.round(monthlyBuyCost).toLocaleString()}), renting is likely cheaper.`);
            } else {
                setVerdict('Buying is Financially Better (by 5% Rule)');
                expl.push(`Since monthly rent is HIGHER than the 5% rule estimate, buying might be a sound financial decision.`);
            }
        }
        else {
            // Basic, India, Compound, Horizon (uses standard NPV/Cashflow logic)
            // Simplified logic for clarity: Total Cash Outflow over Tenure - Asset Value at End

            // 1. RENT Scenario
            // Total Rent Paid over N years with Increase
            let totalRent = 0;
            let currentRent = rent * 12;
            let investableDiff = 0; // If any year buying is costlier, we assume renter invests diff? 
            // Simplified: Renter invests Down Payment + (EMI - Rent) if EMI > Rent. 
            // But let's stick to "Total Cost" first for simplicity as per request "Cost of Renting vs Buying"

            for (let i = 0; i < tenure; i++) {
                totalRent += currentRent;
                currentRent *= (1 + rentIncrease / 100);
            }

            // Renters Opportunity Gain: Detailed calc needed for 'compound' mode, 
            // but for basic we can just show Total Rent Paid.
            // Let's refine for "Net Cost".
            // Net Cost of Renting = Total Rent Paid - Future Value of Invested Down Payment
            const fvDownPayment = downPayment * Math.pow(1 + investmentReturn / 100, tenure);
            const netRentCost = totalRent - (fvDownPayment - downPayment); // actually opportunity cost is lost gain.
            // Let's keep it simple: Cost = Outflow. 
            // But to be fair, Buying builds equity.

            // BETTER METRIC: Net Worth at End.
            // Renter NV = FV(DownPayment) + FV(Monthly Savings if EMI > Rent)
            // Buyer NV = Home Value at End - Outstanding Loan (0)

            // Let's stick to user request: "Total cost of renting, Total cost of buying"
            // Usually "Total Unrecoverable Cost" is the best comparison.

            // BUYING
            const loanAmount = homePrice - downPayment;
            const r = interestRate / 100 / 12;
            const n = tenure * 12;
            const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalEmi = emi * n;
            const totalRepayment = totalEmi + downPayment;

            // Final Home Value
            const finalHomeValue = homePrice * Math.pow(1 + appreciation / 100, tenure);
            const netBuyCost = totalRepayment - finalHomeValue; // Can be negative (Profit)

            // RENTING
            // We assume renter invests the Down Payment.
            const renterSavings = fvDownPayment;
            // Total Rent Paid
            const totalRentPaid = totalRent;
            const netRentCostFinal = totalRentPaid - (renterSavings - downPayment); // Deduct generic investment profit from cost strictly? 
            // Standard approach: 
            // Buy Net Cost = Maintenance + Tax + Interest + OpportunityCostOfDownPayment - Appreciation
            // Rent Net Cost = Rent
            // This is getting complex for a generic "Basic" mode.

            // Let's implement the "Cash Flow" Approach which is easy to understand.
            // You Pay: X for Rent vs Y for Buy.
            // You Get: 0 for Rent vs House for Buy.

            rCost = totalRentPaid;
            bCost = totalRepayment; // This is cash outflow.

            // Adjust for asset value
            const buyGain = finalHomeValue - totalRepayment;
            const rentLoss = totalRentPaid;
            // If we consider opportunity cost of Down Payment for renter:
            const rentGain = fvDownPayment - downPayment;

            // Verdict based on Net Fin Position
            // Renter Position = (fvDownPayment) - (totalRentPaid)
            // Buyer Position = (finalHomeValue) - (totalRepayment) - (Maintenance approx 1% home val/yr?)
            // Let's ignore maintenance in Basic to be simpler or add flat 1%
            let maintenance = 0;
            // if (mode === 'india' || mode === 'basic') maintenance = homePrice * 0.01 * tenure; // Very rough

            const renterNet = fvDownPayment - totalRentPaid;
            const buyerNet = finalHomeValue - totalRepayment - maintenance;

            expl.push(`<strong>Scenario over ${tenure} years:</strong>`);
            expl.push(`If you <strong>RENT</strong>: You pay approx <strong>₹${Math.round(totalRentPaid).toLocaleString()}</strong> in rent.`);
            expl.push(`However, if you invested your down payment (₹${downPayment.toLocaleString()}) @ ${investmentReturn}%, it grows to approx <strong>₹${Math.round(fvDownPayment).toLocaleString()}</strong>.`);
            expl.push(`<strong>Renter's Net Outcome</strong> = Savings - Rent Paid = <strong>₹${Math.round(renterNet).toLocaleString()}</strong>`);

            expl.push(`<br>If you <strong>BUY</strong>: You pay <strong>₹${Math.round(totalRepayment).toLocaleString()}</strong> (Principal + Interest).`);
            expl.push(`Your home value grows @ ${appreciation}% to approx <strong>₹${Math.round(finalHomeValue).toLocaleString()}</strong>.`);
            expl.push(`<strong>Buyer's Net Outcome</strong> = Home Value - Total Paid = <strong>₹${Math.round(buyerNet).toLocaleString()}</strong>`);

            if (buyerNet > renterNet) {
                const diff = buyerNet - renterNet;
                setVerdict(`Buying is Better by ₹${Math.round(diff).toLocaleString()}`);
                expl.push(`<br><strong>Conclusion:</strong> Buying leaves you richer by ₹${Math.round(diff).toLocaleString()} after ${tenure} years.`);
            } else {
                const diff = renterNet - buyerNet;
                setVerdict(`Renting is Better by ₹${Math.round(diff).toLocaleString()}`);
                expl.push(`<br><strong>Conclusion:</strong> Renting & Investing leaves you richer by ₹${Math.round(diff).toLocaleString()} after ${tenure} years.`);
            }

            rCost = Math.abs(renterNet); // Using Net for visuals
            bCost = Math.abs(buyerNet);  // slightly hacking 'Cost' to mean 'Net Value' magnitude for the visual card? 
            // Actually, let's display Net Worth directly in stats
        }

        setExplanation(expl);

        // Stats for ToolResult
        if (mode === 'rule5') {
            setExtraStats([
                { label: 'Unrecoverable Buy (Mo)', value: `₹ ${Math.round(homePrice * 0.05 / 12).toLocaleString()}` },
                { label: 'Current Rent (Mo)', value: `₹ ${rent.toLocaleString()}` },
                { label: 'Rule Recommendation', value: rent < (homePrice * 0.05 / 12) ? 'Rent' : 'Buy' }
            ]);
        } else {
            setExtraStats([
                { label: 'Total Rent Paid', value: `₹ ${Math.round(rent * 12 * ((Math.pow(1 + rentIncrease / 100, tenure) - 1) / (rentIncrease / 100))).toLocaleString()}` }, // Approx sum gp
                { label: 'Home Value (End)', value: `₹ ${Math.round(homePrice * Math.pow(1 + appreciation / 100, tenure)).toLocaleString()}` },
                { label: 'Total Benefit Diff', value: verdict.split('by ')[1] || '-' }
            ]);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button className={`${styles.tabBtn} ${mode === 'basic' ? styles.active : ''}`} onClick={() => setMode('basic')}>Basic</button>
                <button className={`${styles.tabBtn} ${mode === 'rule5' ? styles.active : ''}`} onClick={() => setMode('rule5')}>5% Rule</button>
                <button className={`${styles.tabBtn} ${mode === 'compound' ? styles.active : ''}`} onClick={() => setMode('compound')}>Compound Impact</button>
                <button className={`${styles.tabBtn} ${mode === 'india' ? styles.active : ''}`} onClick={() => { setMode('india'); setInterestRate(8.5); setRentIncrease(5); }}>India Mode</button>
                <button className={`${styles.tabBtn} ${mode === 'horizon' ? styles.active : ''}`} onClick={() => setMode('horizon')}>Time Horizon</button>
            </div>

            <div className={styles.grid}>
                <div className={styles.inputs}>
                    {/* Common Inputs */}
                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label>Monthly Rent</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Home Price</label>
                            <div className={styles.inputWrapper}>
                                <span>₹</span>
                                <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    {mode !== 'rule5' && (
                        <>
                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>Down Payment</label>
                                    <div className={styles.inputWrapper}>
                                        <span>₹</span>
                                        <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Loan Interest (%)</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
                                        <span>%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>Tenure (Years)</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                                        <span>Yr</span>
                                    </div>
                                </div>
                                {(mode === 'compound' || mode === 'india' || mode === 'basic') && (
                                    <div className={styles.inputGroup}>
                                        <label>Investment Return (%)</label>
                                        <div className={styles.inputWrapper}>
                                            <input type="number" value={investmentReturn} onChange={(e) => setInvestmentReturn(Number(e.target.value))} />
                                            <span>%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button className={styles.calculateBtn} onClick={calculate}>
                        Calculate
                    </button>
                    <button className={styles.resetBtn} onClick={() => {
                        setRent(25000);
                        setHomePrice(7500000);
                        setDownPayment(1500000);
                        setInterestRate(8.5);
                        setTenure(20);
                        setRentCost(0);
                        setBuyCost(0);
                        setVerdict('');
                        setExtraStats([]);
                        setExplanation([]);
                    }}>
                        Reset
                    </button>
                </div>

                <div className={styles.results}>
                    <div className={styles.verdict}>
                        {verdict}
                    </div>

                    <ToolResult
                        title={verdict.split(' by')[0] || verdict}
                        subTitle="Financial Recommendation"
                        toolName="Rent vs Buy Calculator"
                        extraStats={extraStats}
                        explanation={explanation}
                        aiPrompt={`Rent vs Buy Analysis. Rent: ${rent}, Home: ${homePrice}, Tenure: ${tenure}, Rate: ${interestRate}%. Returns: ${investmentReturn}%. Verdict: ${verdict}. Explain why to a beginner.`}
                    />
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { FaCalculator, FaUndo, FaFilePdf, FaRobot, FaSearchDollar, FaTable, FaGlobe } from 'react-icons/fa';
import styles from './IncomeTaxCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolResult from '@/components/tools/ToolResult';
import { generateToolInsight } from '@/actions/tools/ai-insight';

const MODES = [
    { id: 1, name: 'Global Tax', desc: 'Progressive Tax for any Country' },
    { id: 2, name: 'India: Old vs New', desc: 'Compare Tax Regimes (AY 2025-26)' },
    { id: 3, name: 'Slab View', desc: 'Detailed Breakdown' },
    { id: 4, name: 'Custom Slabs', desc: 'Manual Tax Planning' },
    { id: 5, name: 'Excel View', desc: 'Table Output' },
];

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'USA (Dollar)' },
    { code: 'INR', symbol: '₹', name: 'India (Rupee)' },
    { code: 'EUR', symbol: '€', name: 'Europe (Euro)' },
    { code: 'GBP', symbol: '£', name: 'UK (Pound)' },
    { code: 'AUD', symbol: 'A$', name: 'Australia (Dollar)' },
    { code: 'CAD', symbol: 'C$', name: 'Canada (Dollar)' },
];

// Default India Slabs (New Regime AY 25-26 - simplified example)
const INDIA_NEW_SLABS = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 5 },
    { limit: 1000000, rate: 10 },
    { limit: 1200000, rate: 15 },
    { limit: 1500000, rate: 20 },
    { limit: Infinity, rate: 30 },
];

const INDIA_OLD_SLABS = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 5 },
    { limit: 1000000, rate: 20 },
    { limit: Infinity, rate: 30 },
];

export default function IncomeTaxCalculator() {
    const { addToHistory } = useHistory();
    const [activeMode, setActiveMode] = useState(1);
    const [result, setResult] = useState<any>(null); // For Global/India
    const [comparisonResult, setComparisonResult] = useState<any>(null); // For India Comparison
    const [explanation, setExplanation] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // AI State
    const [aiInsight, setAiInsight] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);

    // Inputs
    const [income, setIncome] = useState(1200000);
    const [country, setCountry] = useState('USD');
    const [year, setYear] = useState('2025-2026');
    const [deductions, setDeductions] = useState(150000); // 80C etc for Old Regime

    // Manual/Flat Rate State (Mode 1)
    const [isFlatRate, setIsFlatRate] = useState(false);
    const [flatRate, setFlatRate] = useState(20);

    // Custom Slabs State
    const [customSlabs, setCustomSlabs] = useState([{ limit: 10000, rate: 0 }, { limit: 50000, rate: 10 }, { limit: Infinity, rate: 20 }]);

    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => {
        setResult(null);
        setComparisonResult(null);
        setExplanation([]);
        setAiInsight('');
    }, [activeMode, income, country, year, deductions]);

    if (!isMounted) return <div className="p-10 text-center">Loading Income Tax Calculator...</div>;

    const formatCurrency = (val: number, curCode = country) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: curCode }).format(val);
    };

    // Generic Slab Calculation logic
    const calculateTax = (inc: number, slabs: { limit: number, rate: number }[]) => {
        let tax = 0;
        let prevLimit = 0;
        const breakdown = [];

        for (const slab of slabs) {
            if (inc > prevLimit) {
                const taxableInThisSlab = Math.min(inc, slab.limit) - prevLimit;
                const taxInThisSlab = (taxableInThisSlab * slab.rate) / 100;
                tax += taxInThisSlab;
                breakdown.push({ range: `${prevLimit} - ${slab.limit === Infinity ? 'Above' : slab.limit}`, rate: slab.rate, amount: taxableInThisSlab, tax: taxInThisSlab });
                prevLimit = slab.limit;
            } else {
                break;
            }
        }
        return { tax, breakdown };
    };

    const handleCalculate = () => {
        setResult(null);
        setComparisonResult(null);
        setExplanation([]);
        setAiInsight('');
        let res: any = {};
        let steps: string[] = [];

        try {
            // MODE 1: GLOBAL (Custom simple progressive OR Flat Rate)
            if (activeMode === 1) {
                if (isFlatRate) {
                    // Flat Rate Calculation
                    const tax = (income * flatRate) / 100;
                    res = {
                        main: formatCurrency(tax, country),
                        subTitle: `Flat Rate Tax (${flatRate}%)`,
                        extraStats: [
                            { label: 'Net Income', value: formatCurrency(income - tax, country) },
                            { label: 'Tax Rate', value: `${flatRate}%` },
                        ]
                    };
                    steps = [
                        `<b>Calculation:</b> Income x Rate`,
                        `> ${formatCurrency(income, country)} x ${flatRate}% = ${formatCurrency(tax, country)}`
                    ];
                    setResult(res);
                } else {
                    // Mock global slabs based on generic progressive system
                    const globalSlabs = [
                        { limit: 10000, rate: 0 },
                        { limit: 50000, rate: 10 },
                        { limit: 100000, rate: 20 },
                        { limit: Infinity, rate: 30 }
                    ];

                    // Adjust slabs roughly for generic currency logic
                    const multiplier = country === 'INR' ? 80 : 1;
                    const adjustedSlabs = globalSlabs.map(s => ({ ...s, limit: s.limit * multiplier }));

                    const { tax, breakdown } = calculateTax(income, adjustedSlabs);

                    res = {
                        main: formatCurrency(tax, country),
                        subTitle: 'Estimated Annual Tax (Progressive)',
                        extraStats: [
                            { label: 'Net Income', value: formatCurrency(income - tax, country) },
                            { label: 'Effective Rate', value: `${((tax / income) * 100).toFixed(2)}%` },
                        ]
                    };
                    steps = breakdown.map(b => `On ${formatCurrency(b.amount, country)} (@${b.rate}%): ${formatCurrency(b.tax, country)}`);
                    steps.push(`<b>Total Tax:</b> ${formatCurrency(tax, country)}`);
                    setResult(res);
                }
            }

            // MODE 2: INDIA COMPARISON
            if (activeMode === 2) {
                const { tax: taxNew, breakdown: bdNew } = calculateTax(income, INDIA_NEW_SLABS);
                const { tax: taxOld, breakdown: bdOld } = calculateTax(income - deductions, INDIA_OLD_SLABS); // Old regime has deductions

                const diff = taxOld - taxNew;
                const betterRegime = diff > 0 ? 'New Regime' : 'Old Regime';
                const saving = Math.abs(diff);

                setComparisonResult({
                    old: { tax: taxOld, income: income - deductions },
                    new: { tax: taxNew, income: income },
                    recommendation: `Rank: ${betterRegime} is better. You save ${formatCurrency(saving, 'INR')}.`
                });

                res = {
                    main: formatCurrency(Math.min(taxOld, taxNew), 'INR'),
                    subTitle: `Lowest Tax (${betterRegime})`,
                    extraStats: [
                        { label: 'Old Regime Tax', value: formatCurrency(taxOld, 'INR') },
                        { label: 'New Regime Tax', value: formatCurrency(taxNew, 'INR') },
                        { label: 'Savings', value: formatCurrency(saving, 'INR') },
                    ]
                };

                steps = [
                    `<b>Old Regime Calculation:</b>`,
                    `Taxable Income: ${income} - ${deductions} (Deductions) = ${income - deductions}`,
                    `Tax Calculated: ${formatCurrency(taxOld, 'INR')}`,
                    `<b>New Regime Calculation:</b>`,
                    `Taxable Income: ${income} (No Deductions)`,
                    `Tax Calculated: ${formatCurrency(taxNew, 'INR')}`,
                    `<b>Conclusion:</b> ${betterRegime} saves you ${formatCurrency(saving, 'INR')}`
                ];
                setResult(res);
            }

            // MODE 3: SLAB VIEW (Using India New as default for view)
            if (activeMode === 3) {
                const { tax, breakdown } = calculateTax(income, INDIA_NEW_SLABS);
                res = {
                    main: formatCurrency(tax, 'INR'),
                    subTitle: 'Total Tax (New Regime)',
                    breakdownTable: breakdown // Custom field I'll handle in rendering
                };
                steps = breakdown.map(b => `${b.range}: ${b.rate}% on ${b.amount} = ${b.tax}`);
                setResult(res);
            }

            // MODE 4: CUSTOM SLABS
            if (activeMode === 4) {
                const sortedSlabs = [...customSlabs].sort((a, b) => a.limit - b.limit);
                // Ensure last is Infinity
                if (sortedSlabs[sortedSlabs.length - 1].limit !== Infinity) {
                    sortedSlabs.push({ limit: Infinity, rate: sortedSlabs[sortedSlabs.length - 1].rate });
                }

                const { tax, breakdown } = calculateTax(income, sortedSlabs);
                res = {
                    main: formatCurrency(tax, country),
                    subTitle: 'Custom Tax Result',
                    extraStats: [
                        { label: 'Net Income', value: formatCurrency(income - tax, country) },
                    ]
                };
                steps = breakdown.map(b => `Slab ${b.range}: ${b.rate}% -> ${formatCurrency(b.tax, country)}`);
                setResult(res);
            }
            // MODE 5: EXCEL VIEW (Visual representation of Mode 1 or 2 basically)
            if (activeMode === 5) {
                // Re-use logic from Mode 1 for data
                const multiplier = country === 'INR' ? 80 : 1;
                // ... logic similar to Mode 1 ...
                // Or better, just redirect activeMode to 1 internally or show a table
                // I will stick to handling it in rendering
            }


            setExplanation(steps);
            addToHistory({ toolName: `Income Tax (${MODES[activeMode - 1].name})`, summary: res?.main || 'Calculated', url: '/tools/income-tax-calculator' });

        } catch (e) {
            console.error(e);
            alert("Error in calculation");
        }
    };

    const downloadPDF = async () => {
        if (!result) return;
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const curDate = new Date().toLocaleString();

        // Helper to replace symbols with codes for PDF compatibility
        const cleanForPdf = (text: string) => {
            if (typeof text !== 'string') return text;
            return text
                .replace(/₹/g, 'INR ')
                .replace(/\$/g, 'USD ')
                .replace(/€/g, 'EUR ')
                .replace(/£/g, 'GBP ')
                .replace(/A\$/g, 'AUD ')
                .replace(/C\$/g, 'CAD ')
                .replace(/¥/g, 'CNY ')
                .replace(/د.إ/g, 'AED ')
                .replace(/[^\x00-\x7F]/g, ''); // Remove other non-ASCII chars
        };

        doc.setFontSize(22);
        doc.text("Income Tax Report", 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on: ${curDate}`, 14, 28);
        doc.text("savme.io", 180, 20);
        doc.line(14, 32, 196, 32);

        doc.setFontSize(14);
        doc.text("Summary", 14, 45);
        doc.setFontSize(16);
        doc.text(`Total Tax: ${cleanForPdf(result.main)}`, 14, 55);

        let y = 70;
        if (result.extraStats) {
            doc.setFontSize(12);
            result.extraStats.forEach((s: any) => {
                doc.text(`${cleanForPdf(s.label)}: ${cleanForPdf(s.value)}`, 14, y);
                y += 8;
            });
        }

        y += 10;
        doc.line(14, y, 196, y);
        y += 10;
        doc.text("Breakdown / Explanation", 14, y);
        y += 10;
        doc.setFontSize(10);
        explanation.forEach(step => {
            let clean = step.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML
            clean = cleanForPdf(clean);
            doc.text(clean, 14, y);
            y += 6;
        });

        doc.save(`Tax-Report-${Date.now()}.pdf`);
    };

    const fetchAiInsight = async () => {
        setLoadingAi(true);
        const prompt = `
            Act as a tax consultant. Analyze: Income ${income}, Tax Result ${result?.main}.
            Mode: ${MODES[activeMode - 1].name}.
            If comparing regimes, explain why one is better.
            Give 1 generic tax saving tip.
            Keep it simple, under 3 sentences.
        `;
        const text = await generateToolInsight(prompt);
        setAiInsight(text);
        setLoadingAi(false);
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>

                <div className={styles.tabs}>
                    {MODES.map(m => (
                        <button key={m.id} className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`} onClick={() => setActiveMode(m.id)}>
                            {m.name}
                        </button>
                    ))}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}><FaSearchDollar /> {MODES.find(m => m.id === activeMode)?.name}</h2>
                        <p className={styles.cardDesc}>{MODES.find(m => m.id === activeMode)?.desc}</p>
                    </div>

                    <div className={styles.inputSection}>
                        {/* GLOBAL MODE INPUTS */}
                        {(activeMode === 1 || activeMode === 4) && (
                            <div className={styles.inputGroup}>
                                <label>Select Country</label>
                                <select value={country} onChange={e => setCountry(e.target.value)} className="p-3 border rounded text-lg font-bold">
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
                                </select>
                            </div>
                        )}

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Annual Income</label>
                                <input type="number" value={income} onChange={e => setIncome(+e.target.value)} />
                            </div>
                            {/* Manual Flat Rate Input (Mode 1) */}
                            {/* Manual Flat Rate Input (Mode 1) */}
                            {activeMode === 1 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-sm text-gray-700 uppercase tracking-wider mb-3">Tax Calculation Method</h4>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${!isFlatRate ? 'bg-white border-blue-500 shadow-sm text-blue-700' : 'bg-transparent border-gray-200 text-gray-500 hover:bg-white'}`}>
                                            <input type="radio" name="taxMethod" className="hidden" checked={!isFlatRate} onChange={() => setIsFlatRate(false)} />
                                            <span className="font-bold text-sm">Auto Progressive</span>
                                            <span className="text-xs mt-1 opacity-75">Use Country Slabs</span>
                                        </label>
                                        <label className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${isFlatRate ? 'bg-white border-blue-500 shadow-sm text-blue-700' : 'bg-transparent border-gray-200 text-gray-500 hover:bg-white'}`}>
                                            <input type="radio" name="taxMethod" className="hidden" checked={isFlatRate} onChange={() => setIsFlatRate(true)} />
                                            <span className="font-bold text-sm">Manual Flat Rate</span>
                                            <span className="text-xs mt-1 opacity-75">Set Custom %</span>
                                        </label>
                                    </div>

                                    {isFlatRate && (
                                        <div className="mt-4 animate-fade-in relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Tax Percentage</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={flatRate}
                                                    onChange={e => setFlatRate(+e.target.value)}
                                                    placeholder="20"
                                                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* INDIA MODE INPUTS */}
                        {(activeMode === 2) && (
                            <div className={styles.inputGroup}>
                                <label>Deductions (80C, 80D, etc.) for Old Regime</label>
                                <input type="number" value={deductions} onChange={e => setDeductions(+e.target.value)} placeholder="e.g. 150000" />
                                <small className="text-gray-500">Only applicable for Old Regime calculations.</small>
                            </div>
                        )}

                        {/* CUSTOM MODE - SLAB EDITOR */}
                        {activeMode === 4 && (
                            <div className="mt-4 p-4 border rounded bg-gray-50">
                                <h4 className="font-bold mb-2">Configure Tax Slabs</h4>
                                {customSlabs.map((slab, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2 items-center">
                                        <span className="w-20">Up to:</span>
                                        <input
                                            type="number"
                                            value={slab.limit === Infinity ? 99999999 : slab.limit}
                                            onChange={e => {
                                                const newSlabs = [...customSlabs];
                                                newSlabs[idx].limit = +e.target.value;
                                                setCustomSlabs(newSlabs);
                                            }}
                                            className="p-2 border w-32"
                                            disabled={idx === customSlabs.length - 1}
                                        />
                                        <span className="w-10">Rate:</span>
                                        <input
                                            type="number"
                                            value={slab.rate}
                                            onChange={e => {
                                                const newSlabs = [...customSlabs];
                                                newSlabs[idx].rate = +e.target.value;
                                                setCustomSlabs(newSlabs);
                                            }}
                                            className="p-2 border w-16"
                                        />
                                        <span>%</span>
                                    </div>
                                ))}
                                <button className="text-sm text-blue-600 underline" onClick={() => setCustomSlabs([...customSlabs, { limit: Infinity, rate: 30 }])}>+ Add Slab</button>
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={handleCalculate}>Calculate Tax</button>
                        <button className={styles.btnSecondary} onClick={() => { setResult(null); setAiInsight(''); }}><FaUndo /> Reset</button>
                    </div>

                    {result && (
                        <div className="animate-fade-in relative">
                            {/* Comparison Special View for Mode 2 */}
                            {activeMode === 2 && comparisonResult && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                    <div className={`p-4 border rounded-xl ${comparisonResult.old.tax < comparisonResult.new.tax ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
                                        <h4 className="font-bold text-gray-700 uppercase text-sm mb-1">Old Regime Tax</h4>
                                        <p className="text-2xl lg:text-3xl font-black text-gray-900 break-words">{formatCurrency(comparisonResult.old.tax, 'INR')}</p>
                                    </div>
                                    <div className={`p-4 border rounded-xl ${comparisonResult.new.tax < comparisonResult.old.tax ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
                                        <h4 className="font-bold text-gray-700 uppercase text-sm mb-1">New Regime Tax</h4>
                                        <p className="text-2xl lg:text-3xl font-black text-gray-900 break-words">{formatCurrency(comparisonResult.new.tax, 'INR')}</p>
                                    </div>
                                </div>
                            )}

                            {/* Slab Table View for Mode 3 or 5 */}
                            {(activeMode === 3 || activeMode === 5) && result.breakdownTable && (
                                <div className="overflow-x-auto mb-6">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 border">Income Slab</th>
                                                <th className="p-3 border">Rate</th>
                                                <th className="p-3 border">Taxable Amount</th>
                                                <th className="p-3 border">Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.breakdownTable.map((row: any, i: number) => (
                                                <tr key={i} className="border-b">
                                                    <td className="p-3 border">{row.range}</td>
                                                    <td className="p-3 border">{row.rate}%</td>
                                                    <td className="p-3 border">{formatCurrency(row.amount, 'INR')}</td>
                                                    <td className="p-3 border font-bold">{formatCurrency(row.tax, 'INR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-50 font-bold">
                                                <td colSpan={3} className="p-3 border text-right">Total Tax</td>
                                                <td className="p-3 border">{result.main}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}


                            {activeMode !== 3 && activeMode !== 5 && (
                                <ToolResult
                                    title={result.main}
                                    subTitle={result.subTitle}
                                    extraStats={result.extraStats}
                                    explanation={explanation}
                                    toolName="Income Tax"
                                />
                            )}

                            <div className="flex flex-wrap gap-4 mt-6">
                                <button onClick={downloadPDF} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
                                    <FaFilePdf /> Download Report
                                </button>
                                <button
                                    onClick={fetchAiInsight}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                                    disabled={loadingAi}
                                >
                                    <FaRobot /> {loadingAi ? 'Analyzing...' : 'Ask AI Advice'}
                                </button>
                            </div>

                            {aiInsight && (
                                <div className="mt-6 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                                    <h4 className="flex items-center gap-2 font-bold text-indigo-800 mb-2"><FaRobot /> AI Consultant:</h4>
                                    <p className="text-gray-800 leading-relaxed font-medium">{aiInsight}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <article className={styles.seoContent}>
                    <h3>Income Tax Calculator 2025</h3>
                    <p>
                        Calculate your income tax liability easily with our <strong>Advanced Income Tax Calculator</strong>.
                        Compare Old vs New Regime (India), or use our flexible global tax mode for any country.
                    </p>
                    <div className={styles.faq}>
                        <details>
                            <summary>Old vs New Regime: Which is better?</summary>
                            <p>The New Regime offers lower tax rates but no deductions. The Old Regime allows deductions like 80C, 80D. Use our tool to compare both instantly.</p>
                        </details>
                        <details>
                            <summary>How is tax calculated?</summary>
                            <p>Tax is calculated on a progressive slab basis. Your income is divided into slabs, and each slab has a specific tax rate (e.g., 0%, 5%, 20%).</p>
                        </details>
                    </div>
                </article>
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    <div className={styles.card}>
                        <AdSlot label="Advertisement" className="h-full mb-8" variant="clean" />
                        <RelatedTools currentToolSlug="income-tax-calculator" variant="clean" />
                    </div>
                </div>
            </div>
        </div>
    );
}

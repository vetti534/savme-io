'use client';

import { useState, useEffect } from 'react';
import styles from './GDPCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

type CalculatorMode = 'basic' | 'per-capita' | 'real-vs-nominal' | 'growth' | 'india';

interface HistoryItem {
    id: string;
    date: string;
    mode: string;
    inputs: string;
    result: string;
}

export default function GDPCalculator() {
    const [activeMode, setActiveMode] = useState<CalculatorMode>('basic');
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // --- STATE: BASIC MODE ---
    const [consumption, setConsumption] = useState<number>(1000);
    const [investment, setInvestment] = useState<number>(500);
    const [government, setGovernment] = useState<number>(400);
    const [exportsVal, setExportsVal] = useState<number>(200);
    const [importsVal, setImportsVal] = useState<number>(300);

    // --- STATE: PER CAPITA ---
    const [totalGDP, setTotalGDP] = useState<number>(2500000000);
    const [population, setPopulation] = useState<number>(1400000000);

    // --- STATE: REAL VS NOMINAL ---
    const [nominalGDP, setNominalGDP] = useState<number>(3000);
    const [deflator, setDeflator] = useState<number>(110);

    // --- STATE: GROWTH ---
    const [currentGDP, setCurrentGDP] = useState<number>(1000);
    const [growthRate, setGrowthRate] = useState<number>(5);
    const [years, setYears] = useState<number>(10);

    // --- RESULTS ---
    const [result, setResult] = useState<any>(null); // Flexible result object

    // Load History
    useEffect(() => {
        const saved = localStorage.getItem('gdp_calc_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
    }, []);

    const saveHistory = (mode: string, inputStr: string, resStr: string) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleTimeString(),
            mode,
            inputs: inputStr,
            result: resStr
        };
        const newHistory = [newItem, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('gdp_calc_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('gdp_calc_history');
    };

    const calculate = () => {
        let resData = null;
        let inputSummary = '';
        let resultString = '';

        if (activeMode === 'basic' || activeMode === 'india') {
            const netExports = exportsVal - importsVal;
            const gdp = consumption + investment + government + netExports;
            resData = {
                gdp,
                netExports,
                title: `$${gdp.toLocaleString()}`,
                subTitle: 'Gross Domestic Product',
                explanation: [
                    '<strong>Formula:</strong> GDP = C + I + G + (X - M)',
                    `<strong>Calculation:</strong> ${consumption} + ${investment} + ${government} + (${exportsVal} - ${importsVal})`,
                    `<strong>Net Exports:</strong> ${netExports} (Trade Balance)`
                ],
                aiPrompt: `Explain GDP calculation: C=${consumption}, I=${investment}, G=${government}, Net Exports=${netExports}. Total=${gdp}.`
            };
            inputSummary = `C:${consumption}, I:${investment}, G:${government}`;
            resultString = `$${gdp.toLocaleString()}`;
        } else if (activeMode === 'per-capita') {
            const perCapita = totalGDP / population;
            resData = {
                perCapita,
                title: `$${perCapita.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                subTitle: 'GDP Per Capita',
                explanation: [
                    '<strong>Formula:</strong> GDP Per Capita = Total GDP / Population',
                    `<strong>Calculation:</strong> ${totalGDP.toLocaleString()} / ${population.toLocaleString()}`,
                    'This metric represents the average economic output per person.'
                ],
                aiPrompt: `Explain GDP Per Capita of $${perCapita} with Total GDP ${totalGDP} and Population ${population}.`
            };
            inputSummary = `GDP:${totalGDP}, Pop:${population}`;
            resultString = `$${perCapita.toFixed(2)}`;
        } else if (activeMode === 'real-vs-nominal') {
            const realGDP = nominalGDP / (deflator / 100);
            resData = {
                realGDP,
                title: `$${realGDP.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                subTitle: 'Real GDP',
                explanation: [
                    '<strong>Formula:</strong> Real GDP = Nominal GDP / (Deflator / 100)',
                    `<strong>Calculation:</strong> ${nominalGDP} / (${deflator} / 100)`,
                    'Real GDP is adjusted for inflation to show true economic growth.'
                ],
                aiPrompt: `Explain difference between Nominal GDP ($${nominalGDP}) and Real GDP ($${realGDP}) with Deflator ${deflator}.`
            };
            inputSummary = `Nominal:${nominalGDP}, Deflator:${deflator}`;
            resultString = `$${realGDP.toFixed(2)}`;
        } else if (activeMode === 'growth') {
            const futureGDP = currentGDP * Math.pow((1 + growthRate / 100), years);
            resData = {
                futureGDP,
                title: `$${futureGDP.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                subTitle: `Future GDP after ${years} Years`,
                explanation: [
                    '<strong>Formula:</strong> Future Value = Present Value * (1 + r)^n',
                    `<strong>Calculation:</strong> ${currentGDP} * (1 + ${growthRate / 100})^${years}`,
                    `Shows the compounded growth of the economy at ${growthRate}% annually.`
                ],
                aiPrompt: `Explain economic growth scenario: Starting GDP ${currentGDP}, ${growthRate}% growth for ${years} years. Final=${futureGDP}.`
            };
            inputSummary = `Start:${currentGDP}, Rate:${growthRate}%, Years:${years}`;
            resultString = `$${futureGDP.toFixed(2)}`;
        }

        setResult(resData);
        if (resultString) {
            saveHistory(activeMode, inputSummary, resultString);
        }
    };

    // Auto-calculate on mount
    useEffect(() => {
        calculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeMode]);

    const setIndiaValues = () => {
        setConsumption(2300000000000); // Approx logic numbers
        setInvestment(1100000000000);
        setGovernment(600000000000);
        setExportsVal(450000000000);
        setImportsVal(600000000000);
        setActiveMode('basic');
        // Trigger recalc via useEffect or manual call logic if needed, but standard inputs update triggers user interaction usually.
        // For smoother UX, we can just update state and let user click calculate or rely on re-render.
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>
                {/* Intro */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Advanced GDP Calculator</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Compute Gross Domestic Product (GDP), Per Capita income, Real vs Nominal values, and future economic growth.
                    </p>
                </div>

                <div className={styles.card}>
                    {/* TABS */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabBtn} ${activeMode === 'basic' ? styles.activeTab : ''}`}
                            onClick={() => setActiveMode('basic')}
                        >
                            Basic (Expenditure)
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeMode === 'per-capita' ? styles.activeTab : ''}`}
                            onClick={() => setActiveMode('per-capita')}
                        >
                            GDP Per Capita
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeMode === 'real-vs-nominal' ? styles.activeTab : ''}`}
                            onClick={() => setActiveMode('real-vs-nominal')}
                        >
                            Real vs Nominal
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeMode === 'growth' ? styles.activeTab : ''}`}
                            onClick={() => setActiveMode('growth')}
                        >
                            Future Growth
                        </button>
                    </div>

                    <div className={styles.inputs}>
                        {/* BASIC MODE INPUTS */}
                        {(activeMode === 'basic' || activeMode === 'india') && (
                            <>
                                <div className="flex justify-end mb-4">
                                    <button onClick={setIndiaValues} className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded hover:bg-orange-100 border border-orange-200">
                                        🇮🇳 Load India Examples
                                    </button>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Consumption (C)</label>
                                    <div className={styles.inputWrapper}>
                                        <span>$</span>
                                        <input type="number" value={consumption} onChange={e => setConsumption(Number(e.target.value))} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Private Consumption Expenditure</p>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Investment (I)</label>
                                    <div className={styles.inputWrapper}>
                                        <span>$</span>
                                        <input type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Gross Private Domestic Investment</p>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Government Spending (G)</label>
                                    <div className={styles.inputWrapper}>
                                        <span>$</span>
                                        <input type="number" value={government} onChange={e => setGovernment(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={styles.inputGroup}>
                                        <label>Exports (X)</label>
                                        <div className={styles.inputWrapper}>
                                            <span>$</span>
                                            <input type="number" value={exportsVal} onChange={e => setExportsVal(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Imports (M)</label>
                                        <div className={styles.inputWrapper}>
                                            <span>$</span>
                                            <input type="number" value={importsVal} onChange={e => setImportsVal(Number(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* PER CAPITA INPUTS */}
                        {activeMode === 'per-capita' && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Total GDP</label>
                                    <div className={styles.inputWrapper}>
                                        <span>$</span>
                                        <input type="number" value={totalGDP} onChange={e => setTotalGDP(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Population</label>
                                    <div className={styles.inputWrapper}>
                                        <span>👤</span>
                                        <input type="number" value={population} onChange={e => setPopulation(Number(e.target.value))} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* REAL VS NOMINAL INPUTS */}
                        {activeMode === 'real-vs-nominal' && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Nominal GDP</label>
                                    <div className={styles.inputWrapper}>
                                        <span>$</span>
                                        <input type="number" value={nominalGDP} onChange={e => setNominalGDP(Number(e.target.value))} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Current market prices</p>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>GDP Deflator</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="number" value={deflator} onChange={e => setDeflator(Number(e.target.value))} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Base year = 100</p>
                                </div>
                            </>
                        )}

                        {/* GROWTH INPUTS */}
                        {activeMode === 'growth' && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Current GDP</label>
                                    <div className={styles.inputWrapper}>
                                        <span>$</span>
                                        <input type="number" value={currentGDP} onChange={e => setCurrentGDP(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Annual Growth Rate (%)</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="number" value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} />
                                        <span>%</span>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Time Period (Years)</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className={styles.actions}>
                            <button className={styles.btnPrimary} onClick={calculate}>
                                Calculate
                            </button>
                        </div>
                    </div>

                    {/* DYNAMIC RESULT */}
                    {result && (
                        <div className={styles.results}>
                            <ToolResult
                                title={result.title}
                                subTitle={result.subTitle}
                                toolName="GDP Calculator"
                                actionsPosition="bottom"
                                extraStats={result.extraStats} // Optional if needed
                                aiPrompt={result.aiPrompt}
                                explanation={result.explanation}
                            />
                        </div>
                    )}
                </div>

                {/* CALCULATION HISTORY */}
                <div className={styles.historySection}>
                    <div className="flex justify-between items-center mb-4">
                        <h3>Calculation History</h3>
                        {history.length > 0 && (
                            <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700 font-semibold">
                                Clear History
                            </button>
                        )}
                    </div>
                    {history.length === 0 ? (
                        <p className="text-gray-400 text-sm">No history yet.</p>
                    ) : (
                        <div className={styles.historyList}>
                            {history.map((item) => (
                                <div key={item.id} className={styles.historyItem}>
                                    <div className={styles.historyInfo}>
                                        <strong>{item.mode.toUpperCase()}</strong>
                                        <span>{item.inputs}</span>
                                    </div>
                                    <div className={styles.historyResult}>
                                        {item.result}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">What is Real vs Nominal GDP?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>Nominal GDP</strong> is the raw market value of goods. <strong>Real GDP</strong> is adjusted for inflation (using the deflator), giving a more accurate picture of actual economic growth.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">How is GDP per capita helpful?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                It divides the country's economic output by its population. It's the standard metric for comparing standard of living between different countries.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Why exclude Imports?</h4>
                            <p className="text-gray-600 leading-relaxed">
                                GDP stands for Gross DOMESTIC Product. Imports are produced elsewhere, so we subtract them to count only what was made within the country's borders.
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
                        currentToolSlug="gdp-calculator"
                        variant="card"
                        toolSlugs={[
                            'inflation-calculator',
                            'margin-calculator',
                            'roi-calculator',
                            'salary-calculator',
                            'percentage-calculator'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

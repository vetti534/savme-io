'use client';

import { useState } from 'react';
import styles from './PercentageCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';

type Mode = 'percentOf' | 'isPercentOf' | 'increase' | 'decrease' | 'difference' | 'reverse';

export default function PercentageCalculator() {
    const [mode, setMode] = useState<Mode>('percentOf');
    const [val1, setVal1] = useState<string>('');
    const [val2, setVal2] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<string>('');
    const { addToHistory } = useHistory();

    const modes = [
        { id: 'percentOf', label: '% of Number', short: 'Find %' },
        { id: 'isPercentOf', label: 'What % is...', short: 'What %' },
        { id: 'increase', label: '% Increase', short: 'Increase' },
        { id: 'decrease', label: '% Decrease', short: 'Decrease' },
        { id: 'difference', label: '% Difference', short: 'Diff' },
        { id: 'reverse', label: 'Reverse %', short: 'Reverse' }
    ];

    const calculate = () => {
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);

        if (isNaN(v1) || (mode !== 'reverse' && isNaN(v2))) {
            setResult('Error');
            setExplanation('Please enter valid numbers.');
            return;
        }

        let res = 0;
        let exp = '';
        let summaryText = '';

        switch (mode) {
            case 'percentOf':
                // What is X% of Y?
                res = (v1 / 100) * v2;
                exp = `${v1}% of ${v2} = (${v1} / 100) × ${v2} = ${formatNumber(res)}`;
                summaryText = `${v1}% of ${v2}`;
                break;
            case 'isPercentOf':
                // X is what % of Y?
                res = (v1 / v2) * 100;
                exp = `${v1} is what % of ${v2}? = (${v1} / ${v2}) × 100 = ${formatNumber(res)}%`;
                summaryText = `${v1} is what % of ${v2}?`;
                break;
            case 'increase':
                // Increase Y by X% (Note: usually Inputs: Value Y, Increase X%)
                // Let's stick to standard flow: "Increase [Input1] by [Input2] %"
                res = v1 * (1 + v2 / 100);
                exp = `Increase ${v1} by ${v2}% = ${v1} × (1 + ${v2}/100) = ${formatNumber(res)}`;
                summaryText = `Increase ${v1} by ${v2}%`;
                break;
            case 'decrease':
                // Decrease [Input1] by [Input2] %
                res = v1 * (1 - v2 / 100);
                exp = `Decrease ${v1} by ${v2}% = ${v1} × (1 - ${v2}/100) = ${formatNumber(res)}`;
                summaryText = `Decrease ${v1} by ${v2}%`;
                break;
            case 'difference':
                // Difference between X and Y
                const avg = (v1 + v2) / 2;
                if (avg === 0) {
                    res = 0;
                    exp = 'Average is 0, cannot divide.';
                    summaryText = `Diff ${v1} & ${v2}`;
                } else {
                    res = (Math.abs(v1 - v2) / avg) * 100;
                    exp = `|${v1} - ${v2}| / ((${v1} + ${v2})/2) × 100 = ${formatNumber(res)}%`;
                    summaryText = `Diff ${v1} & ${v2}`;
                }
                break;
            case 'reverse':
                // X is Y% of what? -> X = (Y/100) * ? -> ? = X / (Y/100)
                // Let's check inputs. Usually: "Number [Input1] is [Input2]% of what?"
                const v3 = parseFloat(val2);
                if (v3 === 0) {
                    setResult('Error');
                    setExplanation('Percentage cannot be 0 for division.');
                    return;
                }
                res = v1 / (v3 / 100);
                exp = `${v1} is ${v3}% of what? = ${v1} / (${v3} / 100) = ${formatNumber(res)}`;
                summaryText = `${v1} is ${v3}% of what?`;
                break;
        }

        const formattedResult = formatNumber(res);
        setResult(formattedResult);
        setExplanation(exp);

        addToHistory({
            toolName: 'Percentage Calculator',
            summary: `${summaryText} = ${formattedResult}`,
            url: '/tools/percentage-calculator'
        });
    };

    const formatNumber = (num: number): string => {
        return Number.isInteger(num) ? num.toString() : num.toFixed(2);
    };

    const handleClear = () => {
        setVal1('');
        setVal2('');
        setResult(null);
        setExplanation('');
    };

    // Dynamic Labels based on mode
    const getLabels = () => {
        switch (mode) {
            case 'percentOf': return ['Percentage', 'Number', 'What is ', '% of ', '?'];
            case 'isPercentOf': return ['Number', 'Total', '', ' is what % of ', '?'];
            case 'increase': return ['Value', 'Increase %', 'Increase ', ' by ', '%'];
            case 'decrease': return ['Value', 'Decrease %', 'Decrease ', ' by ', '%'];
            case 'difference': return ['Value 1', 'Value 2', 'Difference between ', ' and ', ''];
            case 'reverse': return ['Result Number', 'Percentage', '', ' is ', '% of what?'];
        }
        return ['Value 1', 'Value 2', '', '', ''];
    };

    const [label1, label2, preText, midText, endText] = getLabels();

    return (
        <div className={styles.toolContainer}>
            {/* Center: Calculator */}
            <div className={styles.calculatorWrapper}>
                <div className={styles.calculatorCard}>
                    {/* Tabs */}
                    <div className={styles.tabs}>
                        {modes.map((m) => (
                            <button
                                key={m.id}
                                className={`${styles.tab} ${mode === m.id ? styles.activeTab : ''}`}
                                onClick={() => {
                                    setMode(m.id as Mode);
                                    handleClear();
                                }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Inputs */}
                    <div className={styles.inputGroup}>
                        <span className={styles.text}>{preText}</span>

                        <div className={styles.inputWrapper}>
                            <label className={styles.label}>{label1}</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={val1}
                                onChange={(e) => setVal1(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <span className={styles.text}>{midText}</span>

                        <div className={styles.inputWrapper}>
                            <label className={styles.label}>{label2}</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={val2}
                                onChange={(e) => setVal2(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <span className={styles.text}>{endText}</span>
                    </div>

                    {/* Actions */}
                    <div className={styles.buttonGroup}>
                        <button className={styles.btnCalculate} onClick={calculate}>Calculate</button>
                        <button className={styles.btnClear} onClick={handleClear}>Clear</button>
                    </div>

                    {/* Result */}
                    {result !== null && (
                        <div className={styles.resultSection}>
                            <div className={styles.resultTitle}>Result</div>
                            <div className={styles.resultValue}>
                                {result}
                                {(mode === 'isPercentOf' || mode === 'difference') && '%'}
                            </div>
                            <div className={styles.explanation}>
                                <strong>Explanation:</strong> {explanation}
                            </div>
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <article className={styles.seoContent}>
                    <h1>Percentage Calculator – Free Online Percentage Tool</h1>
                    <p>
                        Calculate percentages easily with this free online percentage calculator.
                        Find percentage increases, decreases, differences, and reverse percentages instantly.
                        Perfect for students, shoppers, and professionals.
                    </p>

                    <h2>Key Features</h2>
                    <ul>
                        <li><strong>Find Percentage:</strong> Calculate X% of Y easily.</li>
                        <li><strong>Percentage Change:</strong> Calculate increase or decrease between two values.</li>
                        <li><strong>Unknowns:</strong> Find the original number if you know the percentage and result.</li>
                        <li><strong>Comparison:</strong> See the percentage difference between two numbers.</li>
                    </ul>

                    <h2>Frequently Asked Questions</h2>

                    <div className={styles.faqItem}>
                        <h3>Is this percentage calculator free?</h3>
                        <p>Yes, SAVEMI.IO provides this tool 100% free forever.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Can I use it worldwide?</h3>
                        <p>Absolutely. It handles all numbers without currency restrictions, making it global.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Does it work on mobile?</h3>
                        <p>Yes, the responsive design ensures it works perfectly on phones and tablets.</p>
                    </div>
                </article>

                {/* JSON-LD Schema */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Percentage Calculator",
                        "applicationCategory": "EducationalApplication",
                        "operatingSystem": "Any",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        }
                    })
                }} />
            </div>
        </div>
    );
}

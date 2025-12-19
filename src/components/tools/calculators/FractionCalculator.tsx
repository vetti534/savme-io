'use client';

import { useState } from 'react';
import styles from './FractionCalculator.module.css';
import jsPDF from 'jspdf';
import { useHistory } from '@/context/HistoryContext';

type Operator = '+' | '-' | '*' | '/';

export default function FractionCalculator() {
    // Fraction 1 Inputs
    const [f1Int, setF1Int] = useState('');
    const [f1Num, setF1Num] = useState('');
    const [f1Den, setF1Den] = useState('');

    // Fraction 2 Inputs
    const [f2Int, setF2Int] = useState('');
    const [f2Num, setF2Num] = useState('');
    const [f2Den, setF2Den] = useState('');

    const [operator, setOperator] = useState<Operator>('+');
    const [result, setResult] = useState<any>(null);
    const [steps, setSteps] = useState('');
    const [showSteps, setShowSteps] = useState(false);
    const { addToHistory } = useHistory();

    // GCD Helper
    const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
    };

    const calculate = () => {
        // Parse Inputs (default 0 for Int, 0 for Num, 1 for Denom to avoid div by zero if empty)
        const i1 = parseInt(f1Int) || 0;
        const n1 = parseInt(f1Num) || 0;
        const d1 = parseInt(f1Den) || (f1Num ? 1 : 1); // Default denom 1 if num present

        const i2 = parseInt(f2Int) || 0;
        const n2 = parseInt(f2Num) || 0;
        const d2 = parseInt(f2Den) || (f2Num ? 1 : 1);

        if (d1 === 0 || d2 === 0) {
            setResult('Error');
            setSteps('Denominator cannot be zero.');
            return;
        }

        // Convert Mixed to Improper: (Integer * Denom + Num) / Denom
        // Note: Sign handling. If Integer is negative, the whole fraction is negative.
        // E.g. -1 1/2 = -1.5 = -3/2. 
        // Logic: magnitude = (|I| * D + N). Result sign = sign(I). 
        // If I is 0, check N.

        const getImproper = (i: number, n: number, d: number) => {
            const sign = i < 0 ? -1 : (i === 0 && n < 0 ? -1 : 1);
            const num = Math.abs(i) * d + Math.abs(n);
            return { num: num * sign, den: d };
        };

        const f1 = getImproper(i1, n1, d1);
        const f2 = getImproper(i2, n2, d2);

        let resNum = 0;
        let resDen = 1;

        let breakdown = `Step 1: Convert to Improper Fractions\n`;
        breakdown += `Fraction 1: ${i1 ? `${i1} ` : ''}${n1}/${d1} = ${f1.num}/${f1.den}\n`;
        breakdown += `Fraction 2: ${i2 ? `${i2} ` : ''}${n2}/${d2} = ${f2.num}/${f2.den}\n\n`;

        breakdown += `Step 2: Perform Operation (${operator})\n`;

        switch (operator) {
            case '+':
                // a/b + c/d = (ad + bc) / bd
                resNum = f1.num * f2.den + f2.num * f1.den;
                resDen = f1.den * f2.den;
                breakdown += `${f1.num}/${f1.den} + ${f2.num}/${f2.den} = (${f1.num}×${f2.den} + ${f2.num}×${f1.den}) / (${f1.den}×${f2.den}) = ${resNum}/${resDen}\n`;
                break;
            case '-':
                // a/b - c/d = (ad - bc) / bd
                resNum = f1.num * f2.den - f2.num * f1.den;
                resDen = f1.den * f2.den;
                breakdown += `${f1.num}/${f1.den} - ${f2.num}/${f2.den} = (${f1.num}×${f2.den} - ${f2.num}×${f1.den}) / (${f1.den}×${f2.den}) = ${resNum}/${resDen}\n`;
                break;
            case '*':
                // (a/b) * (c/d) = ac / bd
                resNum = f1.num * f2.num;
                resDen = f1.den * f2.den;
                breakdown += `${f1.num}/${f1.den} × ${f2.num}/${f2.den} = (${f1.num}×${f2.num}) / (${f1.den}×${f2.den}) = ${resNum}/${resDen}\n`;
                break;
            case '/':
                // (a/b) / (c/d) = (a/b) * (d/c) = ad / bc
                if (f2.num === 0) {
                    setResult('Error');
                    setSteps('Cannot divide by zero.');
                    return;
                }
                resNum = f1.num * f2.den;
                resDen = f1.den * f2.num;
                // Fix sign if denom became negative
                if (resDen < 0) { resNum = -resNum; resDen = -resDen; }
                breakdown += `${f1.num}/${f1.den} ÷ ${f2.num}/${f2.den} = ${f1.num}/${f1.den} × ${f2.den}/${f2.num} = ${resNum}/${resDen}\n`;
                break;
        }

        breakdown += `\nStep 3: Simplify Result\n`;
        const divisor = gcd(Math.abs(resNum), Math.abs(resDen));
        const simpNum = resNum / divisor;
        const simpDen = resDen / divisor;

        breakdown += `Divide by GCD (${divisor}): ${simpNum}/${simpDen}\n`;

        // Convert to Mixed
        const mixedInt = Math.floor(Math.abs(simpNum) / simpDen) * (simpNum < 0 ? -1 : 1);
        const mixedNum = Math.abs(simpNum) % simpDen;

        setResult({
            improper: `${simpNum}/${simpDen}`,
            mixed: mixedNum !== 0 ? `${mixedInt !== 0 ? mixedInt : ''} ${mixedNum}/${simpDen}`.trim() : mixedInt.toString(),
            decimal: (simpNum / simpDen).toFixed(4),
            isInteger: mixedNum === 0
        });
        setSteps(breakdown);

        // History
        const p1String = `${i1 ? i1 + ' ' : ''}${n1 && d1 ? n1 + '/' + d1 : ''}`.trim() || '0';
        const p2String = `${i2 ? i2 + ' ' : ''}${n2 && d2 ? n2 + '/' + d2 : ''}`.trim() || '0';
        const opSymbol = operator === '*' ? 'x' : operator === '/' ? '÷' : operator;

        addToHistory({
            toolName: 'Fraction Calculator',
            summary: `${p1String} ${opSymbol} ${p2String} = ${simpNum}/${simpDen}`,
            url: '/tools/fraction-calculator'
        });
    };

    const handleDownloadPDF = () => {
        if (!result) return;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Fraction Calculator Solution", 20, 20);
        doc.setFontSize(10);
        doc.text("Generated by SAVEMI.IO", 20, 26);

        // Problem
        doc.setFontSize(14);
        doc.text("Problem:", 20, 40);
        doc.setFontSize(12);
        const opSymbol = operator === '*' ? 'x' : operator === '/' ? '÷' : operator;

        // Construct problem string
        // Helper to format part
        const fmt = (i: string, n: string, d: string) => {
            const iVal = i || '';
            const fVal = (n && d) ? `${n}/${d}` : '';
            return `${iVal} ${fVal}`.trim();
        };

        const p1 = fmt(f1Int, f1Num, f1Den);
        const p2 = fmt(f2Int, f2Num, f2Den);

        doc.text(`${p1} ${opSymbol} ${p2}`, 20, 48);

        // Result
        doc.setFontSize(14);
        doc.text("Result:", 20, 60);
        doc.setFontSize(12);

        let resStr = "";
        if (result.mixed) resStr += result.mixed;
        if (!result.isInteger) resStr += `  =  ${result.improper}`;
        resStr += `  =  ${result.decimal}`;

        doc.text(resStr, 20, 68);

        // Steps
        doc.setFontSize(14);
        doc.text("Step-by-Step Solution:", 20, 85);

        doc.setFontSize(10);
        doc.setFont("courier", "normal");

        const splitText = doc.splitTextToSize(steps, 170);
        doc.text(splitText, 20, 95);

        doc.save("fraction-solution.pdf");
    };

    const handleClear = () => {
        setF1Int(''); setF1Num(''); setF1Den('');
        setF2Int(''); setF2Num(''); setF2Den('');
        setResult(null);
        setSteps('');
        setShowSteps(false);
    };

    return (
        <div className={styles.toolContainer}>
            {/* Center: Calculator */}
            <div className={styles.calculatorWrapper}>
                <div className={styles.calculatorCard}>
                    <div className={styles.calcRow}>
                        {/* Fraction 1 */}
                        <div className={styles.fractionGroup}>
                            <input
                                className={styles.integerInput}
                                placeholder="Int"
                                value={f1Int}
                                onChange={(e) => setF1Int(e.target.value)}
                                type="number"
                            />
                            <div className={styles.fractionPart}>
                                <input
                                    className={styles.fractionInput}
                                    placeholder="Num"
                                    value={f1Num}
                                    onChange={(e) => setF1Num(e.target.value)}
                                    type="number"
                                />
                                <div className={styles.fractionLine}></div>
                                <input
                                    className={styles.fractionInput}
                                    placeholder="Den"
                                    value={f1Den}
                                    onChange={(e) => setF1Den(e.target.value)}
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Operator */}
                        <select
                            className={styles.operatorSelect}
                            value={operator}
                            onChange={(e) => setOperator(e.target.value as Operator)}
                        >
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="*">×</option>
                            <option value="/">÷</option>
                        </select>

                        {/* Fraction 2 */}
                        <div className={styles.fractionGroup}>
                            <input
                                className={styles.integerInput}
                                placeholder="Int"
                                value={f2Int}
                                onChange={(e) => setF2Int(e.target.value)}
                                type="number"
                            />
                            <div className={styles.fractionPart}>
                                <input
                                    className={styles.fractionInput}
                                    placeholder="Num"
                                    value={f2Num}
                                    onChange={(e) => setF2Num(e.target.value)}
                                    type="number"
                                />
                                <div className={styles.fractionLine}></div>
                                <input
                                    className={styles.fractionInput}
                                    placeholder="Den"
                                    value={f2Den}
                                    onChange={(e) => setF2Den(e.target.value)}
                                    type="number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.btnCalculate} onClick={calculate}>Calculate</button>
                        <button className={styles.btnClear} onClick={handleClear}>Clear</button>
                    </div>

                    {result && (
                        <div className={styles.resultSection}>
                            <div className={styles.resultTitle}>Result</div>
                            <div className={styles.mainResult}>
                                {result === 'Error' ? (
                                    <span style={{ color: 'red' }}>Error</span>
                                ) : (
                                    <>
                                        {/* Mixed Result */}
                                        <span>{result.mixed}</span>
                                        {!result.isInteger && (
                                            <>
                                                <span className={styles.equalsSign}>=</span>
                                                <span style={{ fontSize: '1.2rem' }}>{result.improper}</span>
                                            </>
                                        )}
                                        <span className={styles.equalsSign}>=</span>
                                        <span className={styles.decimalValue}>{result.decimal}</span>
                                    </>
                                )}
                            </div>

                            {steps && (
                                <div className={styles.stepsSection}>
                                    <div className={styles.stepsHeader}>
                                        <div
                                            className={styles.stepsToggle}
                                            onClick={() => setShowSteps(!showSteps)}
                                        >
                                            {showSteps ? 'Hide Steps' : 'Show Step-by-Step Solution'}
                                        </div>
                                        <button className={styles.btnDownload} onClick={handleDownloadPDF}>
                                            Download PDF ⬇
                                        </button>
                                    </div>
                                    {showSteps && (
                                        <div className={styles.stepsContent}>
                                            {steps}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <article className={styles.seoContent}>
                    <h1>Fraction Calculator – Free Online Calculator</h1>
                    <p>
                        Free fraction calculator to add, subtract, multiply, divide, and simplify fractions.
                        Supports mixed fractions, whole numbers, and provides step-by-step solutions for every calculation.
                    </p>

                    <h2>How to Use the Fraction Calculator</h2>
                    <p>
                        Enter whole numbers, numerators, and denominators in the respective fields.
                        Our tool works as a mixed fraction calculator, meaning you can input easy values like "1 1/2" directly.
                        Select your operation (+, -, ×, ÷) and click Calculate.
                    </p>

                    <h2>Simplify Fractions Step by Step</h2>
                    <p>
                        This text tool not only gives you the final answer but also explains the math.
                        Toggle the "View Steps" to see how the fractions are converted, combined, and simplified.
                    </p>

                    <div className={styles.faqItem}>
                        <h3>Is this fraction calculator free?</h3>
                        <p>Yes, SAVEMI.IO provides this tool specifically for students and teachers completely free.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Can it handle mixed numbers?</h3>
                        <p>Yes, use the "Int" field to enter mixed numbers like 2 3/4.</p>
                    </div>
                </article>

                {/* JSON-LD Schema */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Fraction Calculator",
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

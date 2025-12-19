
'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './SimpleCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import ToolResult from '@/components/tools/ToolResult';

export default function SimpleCalculator() {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [isNewCalculation, setIsNewCalculation] = useState(true);
    // Add result state for ToolResult
    const [result, setResult] = useState<{ main: string } | null>(null);
    const { addToHistory } = useHistory();

    const safeEvaluate = (expr: string): string => {
        try {
            // Replace visual operators with JS operators
            let cleanExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**')
                .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)') // Handle sqrt(x)
                .replace(/(\d+)\s*%/g, '($1/100)'); // Simple percentage

            // Security: Only allow math characters
            if (!/^[\d\.\+\-\*\/\(\)\sMath\.sqrt%e]+$/.test(cleanExpr) && !cleanExpr.includes('Math.sqrt')) {
                return 'Error';
            }

            // eslint-disable-next-line
            const result = new Function('return ' + cleanExpr)();

            if (!isFinite(result) || isNaN(result)) return 'Error';

            // Format to avoid 0.3000000004 issues
            return parseFloat(result.toPrecision(12)).toString();
        } catch {
            return 'Error';
        }
    };

    const handleInput = useCallback((value: string) => {
        setDisplay(prev => {
            if (isNewCalculation || prev === '0' || prev === 'Error') {
                return value;
            }
            return prev + value;
        });
        setIsNewCalculation(false);
    }, [isNewCalculation]);

    const handleOperator = useCallback((op: string) => {
        if (display === 'Error') return;

        setDisplay(prev => {
            // Prevent double operators
            if (/[+\-×÷^]$/.test(prev)) {
                return prev.slice(0, -1) + op;
            }
            return prev + op;
        });
        setIsNewCalculation(false);
    }, [display]);

    const handleCalculate = useCallback(() => {
        const finalResult = safeEvaluate(display);
        setExpression(display + ' =');
        setDisplay(finalResult);
        setIsNewCalculation(true);

        if (finalResult !== 'Error') {
            setResult({ main: finalResult });
            addToHistory({
                toolName: 'Simple Calculator',
                summary: `${display} = ${finalResult} `,
                url: '/tools/simple-calculator'
            });
        } else {
            setResult(null);
        }
    }, [display, addToHistory]);

    const handleClear = () => {
        setDisplay('0');
        setExpression('');
        setIsNewCalculation(true);
        setResult(null);
    };

    const handleBackspace = () => {
        if (isNewCalculation) {
            setDisplay('0');
            return;
        }
        setDisplay(prev => {
            if (prev.length <= 1 || prev === 'Error') return '0';
            return prev.slice(0, -1);
        });
    };

    const handleAdvanced = (func: string) => {
        if (display === 'Error') return;

        let newVal = display;
        switch (func) {
            case 'sqrt':
                newVal = isNewCalculation ? '√(' : display + '√(';
                break;
            case 'sqr':
                newVal = display + '^2';
                break;
            case 'pct':
                newVal = display + '%';
                break;
            case 'openParen':
                newVal = isNewCalculation || display === '0' ? '(' : display + '(';
                break;
            case 'closeParen':
                newVal = display + ')';
                break;
        }
        setDisplay(newVal);
        setIsNewCalculation(false);
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            if (/\d/.test(key)) handleInput(key);
            if (['+', '-', '*', '/'].includes(key)) {
                const map: { [key: string]: string } = { '*': '×', '/': '÷' };
                handleOperator(map[key] || key);
            }
            if (key === 'Enter' || key === '=') {
                e.preventDefault();
                handleCalculate();
            }
            if (key === 'Escape') handleClear();
            if (key === 'Backspace') handleBackspace();
            if (key === '.') handleInput('.');
            if (key === '%') handleAdvanced('pct');
            if (key === '(') handleAdvanced('openParen');
            if (key === ')') handleAdvanced('closeParen');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleInput, handleOperator, handleCalculate]);

    return (
        <div className={styles.toolContainer}>
            {/* Center: Calculator */}
            <div className={styles.calculatorWrapper}>
                <div className={styles.calculatorCard}>
                    <div className={styles.displaySection}>
                        <span className={styles.expression}>{expression}</span>
                        <span className={styles.currentValue}>{display}</span>
                    </div>

                    <div className={styles.keypad}>
                        {/* Row 1: Advanced & Clear */}
                        <button className={`${styles.key} ${styles.keyAction} `} onClick={() => handleAdvanced('openParen')}>(</button>
                        <button className={`${styles.key} ${styles.keyAction} `} onClick={() => handleAdvanced('closeParen')}>)</button>
                        <button className={`${styles.key} ${styles.keyAction} `} onClick={() => handleAdvanced('pct')}>%</button>
                        <button className={`${styles.key} ${styles.keyAction} ${styles.keyOperator} `} onClick={handleClear}>AC</button>

                        {/* Row 2 */}
                        <button className={`${styles.key} ${styles.keyAction} `} onClick={() => handleAdvanced('sqrt')}>√</button>
                        <button className={`${styles.key} ${styles.keyAction} `} onClick={() => handleAdvanced('sqr')}>x²</button>
                        <button className={`${styles.key} ${styles.keyAction} `} onClick={handleBackspace}>⌫</button>
                        <button className={`${styles.key} ${styles.keyOperator} `} onClick={() => handleOperator('÷')}>÷</button>

                        {/* Row 3 */}
                        <button className={styles.key} onClick={() => handleInput('7')}>7</button>
                        <button className={styles.key} onClick={() => handleInput('8')}>8</button>
                        <button className={styles.key} onClick={() => handleInput('9')}>9</button>
                        <button className={`${styles.key} ${styles.keyOperator} `} onClick={() => handleOperator('×')}>×</button>

                        {/* Row 4 */}
                        <button className={styles.key} onClick={() => handleInput('4')}>4</button>
                        <button className={styles.key} onClick={() => handleInput('5')}>5</button>
                        <button className={styles.key} onClick={() => handleInput('6')}>6</button>
                        <button className={`${styles.key} ${styles.keyOperator} `} onClick={() => handleOperator('-')}>−</button>

                        {/* Row 5 */}
                        <button className={styles.key} onClick={() => handleInput('1')}>1</button>
                        <button className={styles.key} onClick={() => handleInput('2')}>2</button>
                        <button className={styles.key} onClick={() => handleInput('3')}>3</button>
                        <button className={`${styles.key} ${styles.keyOperator} `} onClick={() => handleOperator('+')}>+</button>

                        {/* Row 6 */}
                        <button className={styles.key} onClick={() => handleInput('0')}>0</button>
                        <button className={styles.key} onClick={() => handleInput('.')}>.</button>
                        <button className={`${styles.key} ${styles.keyEqual} `} style={{ gridColumn: 'span 2' }} onClick={handleCalculate}>=</button>
                    </div>
                </div>

                {/* RESULT SECTION WITH AI & PDF */}
                {result && (
                    <ToolResult
                        title={result.main}
                        subTitle="Calculation Result"
                        toolName="Simple Calculator"
                        explanation={[`<b>Expression:</b> ${expression?.replace('=', '') || result.main}`, `<b>Result:</b> ${result.main}`]}
                        aiPrompt={`Analyze this calculation: ${expression} ${result.main}. Provide 1 mathematical fact or interesting property about the number ${result.main} or the operation performed.`}
                    />
                )}

                {/* SEO Content */}
                <article className={styles.seoContent}>
                    <h1>Advanced Calculator – Free Online Calculator</h1>
                    <p>
                        Use this advanced calculator for fast and accurate calculations.
                        Designed to be distraction-free and professional, it supports standard math operations
                        as well as advanced functions like percentages, powers, and roots.
                    </p>

                    <h2>Features</h2>
                    <ul>
                        <li>Basic Arithmetic: Addition, Subtraction, Multiplication, Division</li>
                        <li>Advanced Math: Square Root, Powers (x²), Percentages</li>
                        <li>Complex Expressions: Use brackets () to prioritize operations</li>
                        <li>Mobile Friendly: Works perfectly on phones and tablets</li>
                    </ul>

                    <h2>Frequently Asked Questions</h2>

                    <div className={styles.faqItem}>
                        <h3>Is this calculator free?</h3>
                        <p>Yes, SAVEMI.IO provided this advanced calculator 100% free forever.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Can I use it worldwide?</h3>
                        <p>Absolutely. It is designed for global usage and handles all number formats.</p>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Does it work on mobile?</h3>
                        <p>Yes, the design is fully responsive and optimized for touch screens on iOS and Android.</p>
                    </div>
                </article>

                {/* JSON-LD Schema */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced Calculator",
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

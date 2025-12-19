'use client';

import { useState, useEffect } from 'react';
import styles from './AverageCalculator.module.css'; // Reusing Average styles for input
import ToolResult from '@/components/tools/ToolResult';

export default function LCMHCFCalculator() {
    const [input, setInput] = useState<string>('12, 18, 24');

    const [lcm, setLcm] = useState<number>(0);
    const [hcf, setHcf] = useState<number>(0);
    const [numbers, setNumbers] = useState<number[]>([]);

    useEffect(() => {
        calculate();
    }, [input]);

    const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
    };

    const findLcm = (arr: number[]): number => {
        let result = arr[0];
        for (let i = 1; i < arr.length; i++) {
            result = (result * arr[i]) / gcd(result, arr[i]);
        }
        return result;
    };

    const findGcd = (arr: number[]): number => {
        let result = arr[0];
        for (let i = 1; i < arr.length; i++) {
            result = gcd(result, arr[i]);
        }
        return result;
    };

    const calculate = () => {
        const nums = input
            .split(/[\s,]+/)
            .map(s => parseInt(s))
            .filter(n => !isNaN(n) && n > 0);

        setNumbers(nums);

        if (nums.length < 2) {
            setLcm(0);
            setHcf(0);
            return;
        }

        setLcm(findLcm(nums));
        setHcf(findGcd(nums));
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Enter Numbers (separated by comma)</label>
                        <textarea
                            className={styles.textArea}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 12, 18, 24"
                        />
                        <p className={styles.helperText}>Count: {numbers.length} numbers (Must be &gt; 0)</p>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${lcm}`}
                        subTitle="LCM (Least Common Multiple)"
                        toolName="LCM / HCF Calculator"
                        extraStats={[
                            { label: 'HCF / GCD', value: `${hcf}` },
                            { label: 'Numbers', value: numbers.join(', ') },
                        ]}
                        aiPrompt={`Math Analysis. Numbers: [${numbers.join(', ')}]. LCM: ${lcm}, HCF: ${hcf}. Explanation.`}
                    />
                </div>
            </div>
        </div>
    );
}

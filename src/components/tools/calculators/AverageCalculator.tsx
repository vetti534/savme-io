'use client';

import { useState, useEffect } from 'react';
import styles from './AverageCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function AverageCalculator() {
    const [input, setInput] = useState<string>('12, 45, 67, 23, 12, 89, 45, 67, 12');

    const [mean, setMean] = useState<string>('0');
    const [median, setMedian] = useState<string>('0');
    const [mode, setMode] = useState<string>('0');
    const [range, setRange] = useState<string>('0');
    const [count, setCount] = useState<number>(0);
    const [sum, setSum] = useState<string>('0');

    useEffect(() => {
        calculateStats();
    }, [input]);

    const calculateStats = () => {
        // Split by comma, space, or newline
        const numbers = input
            .split(/[\s,]+/)
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));

        setCount(numbers.length);

        if (numbers.length === 0) {
            setMean('0');
            setMedian('0');
            setMode('0');
            setRange('0');
            setSum('0');
            return;
        }

        // MEAN
        const total = numbers.reduce((a, b) => a + b, 0);
        setSum(total.toLocaleString());
        setMean((total / numbers.length).toFixed(2));

        // MEDIAN
        numbers.sort((a, b) => a - b);
        const mid = Math.floor(numbers.length / 2);
        let med = 0;
        if (numbers.length % 2 === 0) {
            med = (numbers[mid - 1] + numbers[mid]) / 2;
        } else {
            med = numbers[mid];
        }
        setMedian(med.toString());

        // MODE
        const freq: Record<string, number> = {};
        let maxFreq = 0;
        let modes: number[] = [];

        for (const n of numbers) {
            freq[n] = (freq[n] || 0) + 1;
            if (freq[n] > maxFreq) maxFreq = freq[n];
        }

        for (const k in freq) {
            if (freq[k] === maxFreq) modes.push(Number(k));
        }

        if (modes.length === numbers.length) {
            setMode('None');
        } else {
            setMode(modes.join(', '));
        }

        // RANGE
        const min = numbers[0];
        const max = numbers[numbers.length - 1];
        setRange((max - min).toString());
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Enter Numbers (separated by comma or space)</label>
                        <textarea
                            className={styles.textArea}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 10, 20, 30, 40"
                        />
                        <p className={styles.helperText}>Count: {count} numbers</p>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={mean}
                        subTitle="Mean (Average)"
                        toolName="Average Calculator"
                        extraStats={[
                            { label: 'Median', value: median },
                            { label: 'Mode', value: mode },
                            { label: 'Range', value: range },
                            { label: 'Sum', value: sum },
                        ]}
                        aiPrompt={`Statistical Analysis. Numbers: [${input.substring(0, 50)}...]. Mean: ${mean}, Median: ${median}, Mode: ${mode}. Significance?`}
                    />
                </div>
            </div>
        </div>
    );
}

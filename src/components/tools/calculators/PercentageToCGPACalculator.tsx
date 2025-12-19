'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function PercentageToCGPACalculator() {
    const [percentage, setPercentage] = useState<number>(85);
    const [scale, setScale] = useState<number>(9.5); // Standard conversion factor in India often 9.5, but US differs. Let user edit.

    const [cgpa, setCgpa] = useState<number>(0);

    useEffect(() => {
        if (percentage >= 0 && scale > 0) {
            setCgpa(parseFloat((percentage / scale).toFixed(2)));
        }
    }, [percentage, scale]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Percentage (%)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={percentage}
                                onChange={(e) => setPercentage(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Conversion Scale (Usually 9.5 or 10)</label>
                        <div className={styles.inputWrapper}>
                            <select
                                value={scale}
                                // Handle custom input? simpler to use input.
                                onChange={(e) => setScale(Number(e.target.value))}
                                style={{ marginRight: '10px', padding: '5px', border: '1px solid #ddd' }}
                            >
                                <option value={9.5}>9.5 (CBSE/Standard)</option>
                                <option value={10}>10.0 (Direct)</option>
                                <option value={20}>20.0</option>
                            </select>
                            <input
                                type="number"
                                value={scale}
                                onChange={(e) => setScale(Number(e.target.value))}
                                placeholder="Custom"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Formula: Percentage / Scale = CGPA</p>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${cgpa}`}
                        subTitle="CGPA"
                        toolName="% to CGPA"
                        extraStats={[
                            { label: 'Percentage', value: `${percentage}%` },
                            { label: 'Scale Factor', value: `${scale}` },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

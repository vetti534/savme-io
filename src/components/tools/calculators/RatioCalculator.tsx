'use client';

import { useState, useEffect } from 'react';
import styles from './RatioCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function RatioCalculator() {
    const [A, setA] = useState<number>(4);
    const [B, setB] = useState<number>(3);
    const [C, setC] = useState<number>(8);
    const [D, setD] = useState<number | string>('?'); // Target

    // Mode could be 'Solve for D', but generally people want A:B = C:D -> Solve D

    useEffect(() => {
        calculateRatio();
    }, [A, B, C]);

    const calculateRatio = () => {
        if (A && B && C) {
            // A/B = C/D => D = (B*C)/A
            const res = (B * C) / A;
            if (isFinite(res)) {
                setD(parseFloat(res.toFixed(4)));
            } else {
                setD('Error');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>A : B = C : D</label>
                        <div className="flex flex-col gap-4">
                            <div className={styles.ratioWrapper}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        value={A}
                                        onChange={(e) => setA(Number(e.target.value))}
                                        placeholder="A"
                                    />
                                </div>
                                <span>:</span>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        value={B}
                                        onChange={(e) => setB(Number(e.target.value))}
                                        placeholder="B"
                                    />
                                </div>
                            </div>

                            <div className="text-center font-bold text-gray-400">=</div>

                            <div className={styles.ratioWrapper}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        value={C}
                                        onChange={(e) => setC(Number(e.target.value))}
                                        placeholder="C"
                                    />
                                </div>
                                <span>:</span>
                                <div className={styles.inputWrapper} style={{ backgroundColor: '#f3f4f6' }}>
                                    <input
                                        type="text"
                                        value={D}
                                        readOnly
                                        placeholder="X"
                                        className="font-bold text-blue-600 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={String(D)}
                        subTitle={`Value of D`}
                        toolName="Ratio Calculator"
                        extraStats={[
                            { label: 'Ratio A:B', value: `${A}:${B}` },
                            { label: 'Decimal', value: B !== 0 ? (A / B).toFixed(4) : 'Inf' },
                        ]}
                        aiPrompt={`Ratio Analysis. ${A}:${B} = ${C}:${D}.`}
                    />
                </div>
            </div>
        </div>
    );
}

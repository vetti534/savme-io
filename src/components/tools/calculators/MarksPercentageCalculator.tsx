'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function MarksPercentageCalculator() {
    const [obtained, setObtained] = useState<number>(450);
    const [total, setTotal] = useState<number>(500);

    const [percent, setPercent] = useState<number>(0);

    useEffect(() => {
        if (total > 0 && obtained >= 0) {
            setPercent(parseFloat(((obtained / total) * 100).toFixed(2)));
        } else {
            setPercent(0);
        }
    }, [obtained, total]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Marks Obtained</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={obtained}
                                onChange={(e) => setObtained(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Total Marks</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(Number(e.target.value))}
                            />
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${percent}%`}
                        subTitle="Percentage"
                        toolName="Marks Calculator"
                        extraStats={[
                            { label: 'Obtained', value: `${obtained}` },
                            { label: 'Total', value: `${total}` },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

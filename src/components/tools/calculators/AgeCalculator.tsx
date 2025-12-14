'use client';

import { useState } from 'react';
import styles from './AgeCalculator.module.css';

export default function AgeCalculator() {
    const [dob, setDob] = useState('');
    const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

    const calculateAge = () => {
        if (!dob) return;

        const birthDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        setResult({ years, months, days });
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Date of Birth</label>
                <input
                    type="date"
                    className="input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
            </div>

            <button className="btn btn-primary" onClick={calculateAge} style={{ width: '100%' }}>
                Calculate Age
            </button>

            {result && (
                <div className={styles.result}>
                    <div className={styles.resultItem}>
                        <span className={styles.number}>{result.years}</span>
                        <span className={styles.text}>Years</span>
                    </div>
                    <div className={styles.resultItem}>
                        <span className={styles.number}>{result.months}</span>
                        <span className={styles.text}>Months</span>
                    </div>
                    <div className={styles.resultItem}>
                        <span className={styles.number}>{result.days}</span>
                        <span className={styles.text}>Days</span>
                    </div>
                </div>
            )}
        </div>
    );
}

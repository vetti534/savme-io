'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function AttendanceCalculator() {
    const [held, setHeld] = useState<number>(50);
    const [attended, setAttended] = useState<number>(40);
    const [target, setTarget] = useState<number>(75); // Target %

    const [currentPercent, setCurrentPercent] = useState<number>(0);
    const [status, setStatus] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        calculateAttendance();
    }, [held, attended, target]);

    const calculateAttendance = () => {
        if (held < 0 || attended < 0) return;
        if (attended > held) {
            setMessage('Attended cannot be more than held!');
            return;
        }

        const percentage = (attended / held) * 100;
        setCurrentPercent(parseFloat(percentage.toFixed(2)));

        if (percentage >= target) {
            // Can I bunk?
            // (Attended) / (Held + Bunks) >= Target/100
            // Attended / (Target/100) >= Held + Bunks
            // (Attended / (Target/100)) - Held >= Bunks

            const maxHeld = attended / (target / 100);
            const bunks = Math.floor(maxHeld - held);

            setStatus('Safe');
            if (bunks > 0) {
                setMessage(`You can safely bunk ${bunks} classes and stay above ${target}%.`);
            } else {
                setMessage(`You are safe, but cannot bunk any more classes to maintain ${target}%.`);
            }
        } else {
            // Need to attend more
            // (Attended + X) / (Held + X) >= Target/100
            // Attended + X >= (Target/100)(Held + X)
            // Attended + X >= T*Held + T*X
            // X - T*X >= T*Held - Attended
            // X(1 - T) >= T*Held - Attended
            // X >= (T*Held - Attended) / (1 - T)

            const t = target / 100;
            // Edge case: Target = 100%
            if (t >= 1) {
                if (attended === held) setMessage("Perfect! Don't miss any.");
                else setMessage("Impossible to reach 100% if you missed any.");
                return;
            }

            const numerator = (t * held) - attended;
            const denominator = 1 - t;
            const needed = Math.ceil(numerator / denominator);

            setStatus('Short');
            setMessage(`You need to attend ${needed} more classes consecutively to reach ${target}%.`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Classes Held (Total)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={held}
                                onChange={(e) => setHeld(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Classes Attended</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={attended}
                                onChange={(e) => setAttended(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Target Percentage (%)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={target}
                                onChange={(e) => setTarget(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${currentPercent}%`}
                        subTitle="Current Attendance"
                        toolName="Attendance Planner"
                        extraStats={[
                            { label: 'Status', value: status },
                            { label: 'Target', value: `${target}%` },
                        ]}
                        aiPrompt={`Attendance Check. Current: ${currentPercent}%. Target: ${target}%. Advice: ${message}`}
                    />
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                        <strong>Planner:</strong> {message}
                    </div>
                </div>
            </div>
        </div>
    );
}

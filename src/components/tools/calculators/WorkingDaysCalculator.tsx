'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css'; // Reusing generic styles
import ToolResult from '@/components/tools/ToolResult';

export default function WorkingDaysCalculator() {
    // Default: Today to Today + 1 Month
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const [startDate, setStartDate] = useState<string>(today.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(nextMonth.toISOString().split('T')[0]);

    // Settings
    const [includeStart, setIncludeStart] = useState<boolean>(false);
    const [workDays, setWorkDays] = useState<boolean[]>([false, true, true, true, true, true, false]); // Sun-Sat, 0=Sun, 6=Sat. Default Mon-Fri check.

    const [resultDays, setResultDays] = useState<number>(0);
    const [totalDays, setTotalDays] = useState<number>(0);

    useEffect(() => {
        calculateDays();
    }, [startDate, endDate, includeStart, workDays]);

    const toggleDay = (index: number) => {
        const newDays = [...workDays];
        newDays[index] = !newDays[index];
        setWorkDays(newDays);
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

        // Ensure start <= end logic or handle negative? 
        // Typically people want range count.
        let current = new Date(start);
        const finish = new Date(end);

        // Normalize time to noon to avoid DST issues
        current.setHours(12, 0, 0, 0);
        finish.setHours(12, 0, 0, 0);

        if (current > finish) {
            // If start is after end, just swap or return 0? Let's return 0 for now.
            setResultDays(0);
            setTotalDays(0);
            return;
        }

        let working = 0;
        let total = 0;

        // If includeStart is true, loop includes 'current' date initially?
        // Standard logic: Difference. But "Working Days Between" usually implies full days.
        // Let's iterate.

        while (current <= finish) {
            // Is it the start date?
            const isStart = current.getTime() === start.getTime(); // (Approx check due to Time normalization above, actually 'start' passed in is YYYY-MM-DD so midnight UTC usually, or local)

            // Actually, let's keep it simple.
            // Loop from start to end (inclusive of end? usually inclusive of end in business contexts? Or exclusive?)
            // "Days between" usually excludes end date in pure math, but for "Working days from X to Y", usually implies checking availability on those days.
            // Let's assume Inclusive of both for explicit range handling, unless `includeStart` implies typical exclusion.
            // Actually, Date diff usually excludes start, includes end?
            // Let's stick to simple: Inclusive of Start IF toggle, Always Inclusive of End? 
            // Better: Iterate from Start (inclusive) to End (inclusive).

            // Wait, if I say "Work from Mon to Fri", that's 5 days.
            // If Start=Mon, End=Fri.

            if (current.getTime() === finish.getTime() && current.getTime() === start.getTime()) {
                // Same day.
                // Count as 1 day if working?
            }

            const dayOfWeek = current.getDay(); // 0=Sun
            if (workDays[dayOfWeek]) {
                working++;
            }
            total++;

            current.setDate(current.getDate() + 1);
        }

        if (!includeStart && total > 0) {
            // Primitive logic to exclude start: subtract 1 if start was working? 
            // Re-running loop is safer but slow for years.
            // For simple tool, iteration is fine up to like 50 years.
            // Optimization for later if needed.

            // Let's adjust:
            // If !includeStart, we effectively start counting from Start+1?
            // Yes.

            // Actually re-calc is better to be correct.
            // Let's just subtract 1 working day if start was working?
            // Yes, checks out.
            const s = new Date(startDate);
            s.setHours(12, 0, 0, 0);
            if (workDays[s.getDay()]) working--;
            total--;
        }

        setResultDays(working);
        setTotalDays(total);
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Start Date</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>End Date</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Working Days</label>
                        <div className={styles.toggles} style={{ flexWrap: 'wrap' }}>
                            {days.map((d, i) => (
                                <button
                                    key={d}
                                    className={workDays[i] ? styles.active : ''}
                                    onClick={() => toggleDay(i)}
                                    style={{ flex: 1, minWidth: '40px', padding: '0.5rem' }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={includeStart}
                                onChange={(e) => setIncludeStart(e.target.checked)}
                                style={{ width: 'auto' }}
                            />
                            Include Start Date
                        </label>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${resultDays} Days`}
                        subTitle="Working Days"
                        toolName="Working Days Calculator"
                        extraStats={[
                            { label: 'Total Days', value: `${totalDays}` },
                            { label: 'Weekends/Holidays', value: `${totalDays - resultDays}` },
                        ]}
                        aiPrompt={`Work Schedule. Start: ${startDate}, End: ${endDate}. Working days: ${resultDays}. Total duration: ${totalDays}.`}
                    />
                </div>
            </div>
        </div>
    );
}

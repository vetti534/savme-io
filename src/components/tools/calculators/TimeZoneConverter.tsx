'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function TimeZoneConverter() {
    const [baseTime, setBaseTime] = useState<string>('');

    // Default to a few major zones
    const ZONES = [
        { label: 'UTC (GMT)', zone: 'UTC' },
        { label: 'New York (EST)', zone: 'America/New_York' },
        { label: 'London (BST)', zone: 'Europe/London' },
        { label: 'Paris (CET)', zone: 'Europe/Paris' },
        { label: 'Tokyo (JST)', zone: 'Asia/Tokyo' },
        { label: 'India (IST)', zone: 'Asia/Kolkata' },
        { label: 'Sydney (AEST)', zone: 'Australia/Sydney' },
        { label: 'Los Angeles (PST)', zone: 'America/Los_Angeles' },
    ];

    const [selectedZone, setSelectedZone] = useState<string>('UTC');
    const [convertedTimes, setConvertedTimes] = useState<Record<string, string>>({});

    useEffect(() => {
        // Init base time to now
        const now = new Date();
        const local = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
        setBaseTime(local);
    }, []);

    useEffect(() => {
        convertAll();
    }, [baseTime, selectedZone]);

    const convertAll = () => {
        if (!baseTime) return;

        // Base time is 'YYYY-MM-DDTHH:mm' in "Local" time? Or assume it is in "Selected Zone" time?
        // Usually converter implies: "I have 10:00 AM in NY, what is it in London?"
        // So input is tied to a specific zone.

        // Let's assume input is in 'selectedZone'.
        // We need to create a Date object representing that time in that zone.
        // JS Date() parses as Local or UTC. 
        // Complex without luxon/date-fns-tz, but `Intl` can help verify, hard to 'set'.

        // Hack: Create as UTC, then adjust by offset difference? 
        // Better: Find offset of target zone for that date.

        // Let's try a simpler approach for MVP:
        // Input is ALWAYS Local Browser Time for now (easiest), 
        // OR we treat the input string as UTC and just show offsets.

        // Let's try: treat input `baseTime` as if it belongs to `selectedZone`.
        // 1. Get timestamp of (baseTime + selectedZone).
        //    - new Date(baseTime) treats as Local.
        //    - We need to shift it.

        // Actually, simplest usage:
        // "Current World Time" -> Live stats.
        // "Convert" -> If I input time, show others.

        try {
            // Create a date object that corresponds to the inputs
            // We can use the text string... but 'new Date()' uses local flavor.

            // Let's use `toLocaleString` with timeZone option to find offsets? Slow.

            // Allow user to simple see "Current Time" everywhere updates live?
            // "Converter" usually static.

            // Let's implement: Input = Local Time. Show others. (Easiest and reliable)
            // Label: "Your Local Time"

            const localDate = new Date(baseTime);

            if (isNaN(localDate.getTime())) return;

            const results: Record<string, string> = {};

            ZONES.forEach(z => {
                const timeStr = localDate.toLocaleString('en-US', {
                    timeZone: z.zone,
                    hour12: true,
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                });
                results[z.label] = timeStr;
            });

            setConvertedTimes(results);

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Your Local Time</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="datetime-local"
                                value={baseTime}
                                onChange={(e) => setBaseTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Comparing against your local browser time zone.
                    </p>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={convertedTimes['UTC (GMT)'] || '--'}
                        subTitle="UTC Time"
                        toolName="Time Zone Converter"
                        extraStats={ZONES.filter(z => z.label !== 'UTC (GMT)').map(z => ({
                            label: z.label,
                            value: convertedTimes[z.label] || '--'
                        }))}
                        aiPrompt={`World Clock. Local: ${baseTime}. UTC: ${convertedTimes['UTC (GMT)']}.`}
                    />
                </div>
            </div>
        </div>
    );
}

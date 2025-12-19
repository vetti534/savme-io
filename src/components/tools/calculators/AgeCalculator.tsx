'use client';

import React, { useState, useEffect } from 'react';
import {
    differenceInYears,
    differenceInMonths,
    differenceInDays,
    differenceInWeeks,
    differenceInHours,
    intervalToDuration,
    format,
    isValid,
    parseISO,
    add
} from 'date-fns';
import { FaBirthdayCake, FaUndo } from 'react-icons/fa';
import styles from './AgeCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolResult from '@/components/tools/ToolResult';

const MODES = [
    { id: 1, name: 'Age by Date of Birth', desc: 'Calculate exact age in years, months, and days.' },
    { id: 2, name: 'Age in Years', desc: 'Get your simple age based on birth year.' },
    { id: 3, name: 'Age in Days', desc: 'Find out exactly how many days you have lived.' },
    { id: 4, name: 'Age at Date', desc: 'Calculate your age on a specific past or future date.' }
];

export default function AgeCalculator() {
    const { addToHistory } = useHistory();
    const [activeMode, setActiveMode] = useState(1);
    const [result, setResult] = useState<any>(null);
    const [explanation, setExplanation] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Inputs
    const [dob, setDob] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [targetDate, setTargetDate] = useState(''); // Mode 4

    useEffect(() => {
        setIsMounted(true);
        // Default target date to today
        setTargetDate(format(new Date(), 'yyyy-MM-dd'));
    }, []);

    useEffect(() => {
        setResult(null);
        setExplanation([]);
    }, [activeMode]);

    if (!isMounted) return <div className={styles.loading}>Loading Age Calculator...</div>;

    const calculate = () => {
        setExplanation([]);
        setAiTip('');
        setResult(null);
        let steps: string[] = [];
        let res: any = {};

        try {
            const today = new Date();

            // === MODE 1: Age by DOB ===
            if (activeMode === 1) {
                const birth = parseISO(dob);
                if (!isValid(birth)) { alert('Please enter a valid Date of Birth'); return; }
                if (birth > today) { alert('Date of Birth cannot be in the future!'); return; }

                const age = intervalToDuration({ start: birth, end: today });
                const totalMonths = differenceInMonths(today, birth);
                const totalWeeks = differenceInWeeks(today, birth);
                const totalDays = differenceInDays(today, birth);
                const totalHours = differenceInHours(today, birth);

                res = {
                    main: `${age.years} Years`,
                    subTitle: `${age.months} Months, ${age.days} Days`,
                    details: `Next Birthday: ${format(add(birth, { years: (age.years || 0) + 1 }), 'EEEE, MMMM do')}`,
                    extraStats: [
                        { label: 'Total Months', value: totalMonths.toLocaleString() },
                        { label: 'Total Weeks', value: totalWeeks.toLocaleString() },
                        { label: 'Total Days', value: totalDays.toLocaleString() },
                        { label: 'Total Hours', value: totalHours.toLocaleString() }
                    ]
                };

                steps.push(`<b>Date of Birth:</b> ${format(birth, 'PPP')}`);
                steps.push(`<b>today's Date:</b> ${format(today, 'PPP')}`);
                steps.push(`<b>Calculation:</b> Measured the full duration between dates.`);
            }

            // === MODE 2: Age in Years ===
            else if (activeMode === 2) {
                const year = parseInt(birthYear);
                if (!year || year < 1900 || year > today.getFullYear()) { alert('Please enter a valid year (1900 - Today)'); return; }

                const diff = today.getFullYear() - year;

                res = {
                    main: `${diff} Years`,
                    subTitle: `(Turning ${diff + 1} this year)`,
                    details: `Based on year ${year}`
                };
                steps.push(`<b>Birth Year:</b> ${year}`);
                steps.push(`<b>Current Year:</b> ${today.getFullYear()}`);
                steps.push(`<b>Logic:</b> ${today.getFullYear()} - ${year} = ${diff}.`);
                steps.push(`Note: If your birthday hasn't passed yet this year, you are technically ${diff - 1}.`);
            }

            // === MODE 3: Age in Days ===
            else if (activeMode === 3) {
                const birth = parseISO(dob);
                if (!isValid(birth)) { alert('Invalid DOB'); return; }

                const days = differenceInDays(today, birth);

                res = {
                    main: `${days.toLocaleString()} Days`,
                    subTitle: `Total Life Duration`,
                    details: `${(days / 365.25).toFixed(2)} Solar Years`,
                    extraStats: [
                        { label: 'Years (Approx)', value: (days / 365.25).toFixed(1) },
                        { label: 'Weeks', value: (days / 7).toFixed(0) },
                        { label: 'Hours', value: (days * 24).toLocaleString() }
                    ]
                };
                steps.push(`<b>Birth Date:</b> ${format(birth, 'PPP')}`);
                steps.push(`<b>Today:</b> ${format(today, 'PPP')}`);
                steps.push(`<b>Calculation:</b> Exact count of 24-hour periods lived.`);
            }

            // === MODE 4: Custom Date Age ===
            else if (activeMode === 4) {
                const birth = parseISO(dob);
                const target = parseISO(targetDate);

                if (!isValid(birth) || !isValid(target)) return;

                const isFuture = target > new Date();
                const verb = isFuture ? "will be" : "was";
                const age = intervalToDuration({ start: birth, end: target });

                res = {
                    main: `${age.years} Years`,
                    subTitle: `${age.months} Months, ${age.days} Days`,
                    details: `On ${format(target, 'MMM do, yyyy')}`
                };

                steps.push(`<b>Date of Birth:</b> ${format(birth, 'PPP')}`);
                steps.push(`<b>Target Date:</b> ${format(target, 'PPP')}`);
                steps.push(`<b>Result:</b> On this date, you ${verb} ${age.years} years old.`);
            }

            setResult(res);
            setExplanation(steps);

            // History
            addToHistory({
                toolName: `Age Calc`,
                summary: res.main,
                url: '/tools/age-calculator'
            });

        } catch (e) {
            console.error(e);
            alert("Calculation error. check inputs.");
        }
    };



    const reset = () => {
        setResult(null);
        setExplanation([]);
        setDob('');
        setBirthYear('');
    };

    return (
        <div className={styles.pageGrid}>

            {/* MAIN CALCULATOR AREA (LEFT) */}
            <div className={styles.mainColumn}>

                {/* TABS */}
                <div className={styles.tabs}>
                    {MODES.map(m => (
                        <button
                            key={m.id}
                            className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveMode(m.id)}
                        >
                            {m.name}
                        </button>
                    ))}
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        <FaBirthdayCake className={styles.icon} />
                        {MODES.find(m => m.id === activeMode)?.name}
                    </h2>
                    <p className={styles.cardDesc}>{MODES.find(m => m.id === activeMode)?.desc}</p>

                    <div className={styles.inputSection}>
                        {(activeMode === 1 || activeMode === 3 || activeMode === 4) && (
                            <div className={styles.inputGroup}>
                                <label>Date of Birth</label>
                                <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
                            </div>
                        )}

                        {activeMode === 2 && (
                            <div className={styles.inputGroup}>
                                <label>Year of Birth</label>
                                <input type="number" placeholder="YYYY" value={birthYear} onChange={e => setBirthYear(e.target.value)} />
                            </div>
                        )}

                        {activeMode === 4 && (
                            <div className={styles.inputGroup}>
                                <label>Age At Date</label>
                                <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={calculate}>Calculate Age</button>
                        <button className={styles.btnSecondary} onClick={reset}><FaUndo /> Reset</button>
                    </div>

                    {result && (
                        <ToolResult
                            title={result.main}
                            subTitle={result.subTitle}
                            details={result.details}
                            extraStats={result.extraStats}
                            explanation={explanation}
                            toolName={`Age Calculator - ${MODES[activeMode - 1].name}`}
                            aiPrompt={`Age Calculator Context. Result: ${result.main} (${result.subTitle}).
                            Provide a fun fact about this age or life stage (e.g. Generation, Historical events from birth year, etc). Max 2 sentences.`}
                        />
                    )}
                </div>

                {/* SEO CONTENT */}
                <div className={styles.seoContent}>
                    <h3>Free Age Calculator by Date of Birth</h3>
                    <p>
                        Calculate your exact age with our free <strong>Age Calculator by Date of Birth</strong>. This tool is better than the age calculator Google snippet because it gives you a complete breakdown of your life in years, months, days, weeks, and hours. It also includes a retirement age calculator feature (via "Age at Date" mode) to help you plan your future.
                    </p>
                    <div className={styles.faq}>
                        <details>
                            <summary>Is this accurate?</summary>
                            <p>Yes, it uses precise calendar logic accounting for leap years and exact day counts.</p>
                        </details>
                        <details>
                            <summary>Can I calculate age for future dates?</summary>
                            <p>Yes, use the "Age at Date" mode to see how old you will be in the future.</p>
                        </details>
                    </div>
                </div>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "Age Calculator",
                            "applicationCategory": "Utilities",
                            "featureList": "Age by DOB, Total Days Lived, Age Verification"
                        })
                    }}
                />
            </div>

            {/* AD COLUMN (RIGHT) */}
            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    <div className={styles.card}>
                        <AdSlot label="Advertisement" className="h-full mb-8" variant="clean" />
                        <RelatedTools currentToolSlug="age-calculator" variant="clean" />
                    </div>
                </div>
            </div>

        </div>
    );
}

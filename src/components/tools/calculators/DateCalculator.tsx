'use client';

import React, { useState, useEffect } from 'react';
import {
    add,
    sub,
    differenceInDays,
    intervalToDuration,
    format,
    getISOWeek,
    startOfISOWeek,
    endOfISOWeek,
    isValid,
    parseISO,
    addBusinessDays,
    differenceInBusinessDays,
    isWeekend,
    isLeapYear,
    getDaysInYear
} from 'date-fns';
import { FaUndo } from 'react-icons/fa';
import styles from './DateCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import ToolResult from '@/components/tools/ToolResult';

const MODES = [
    { id: 1, name: 'Count Days', description: 'Duration' },
    { id: 2, name: 'Add Days', description: 'Calculator' },
    { id: 3, name: 'Workdays', description: 'Business' },
    { id: 4, name: 'Add Workdays', description: 'Schedule' },
    { id: 5, name: 'Weekday', description: 'Identify' },
    { id: 6, name: 'Week №', description: 'ISO-8601' }
];

export default function DateCalculator() {
    const { addToHistory } = useHistory();
    const [activeMode, setActiveMode] = useState(1);
    const [result, setResult] = useState<any>(null);
    const [explanation, setExplanation] = useState<string[]>([]);

    // --- STATE FOR MODES ---

    // Mode 1: Count Days & Mode 3: Workdays
    const [startDates, setStartDates] = useState({ 1: '', 3: '' });
    const [endDates, setEndDates] = useState({ 1: '', 3: '' });
    const [includeEnd, setIncludeEnd] = useState(false); // For Mode 1

    // Mode 2: Add Days & Mode 4: Add Workdays
    const [baseDates, setBaseDates] = useState({ 2: '', 4: '', 5: '' });
    // Mode 2 Inputs
    const [m2Years, setM2Years] = useState(0);
    const [m2Months, setM2Months] = useState(0);
    const [m2Weeks, setM2Weeks] = useState(0);
    const [m2Days, setM2Days] = useState(0);
    // Mode 4 Inputs (Only days usually for workdays)
    const [m4Days, setM4Days] = useState(0);

    const [operation, setOperation] = useState<'add' | 'subtract'>('add');

    // Mode 6: Week Number
    const [m6Mode, setM6Mode] = useState<'dateToWeek' | 'weekToDate'>('dateToWeek');
    const [m6Date, setM6Date] = useState('');
    const [m6Year, setM6Year] = useState(new Date().getFullYear());
    const [m6Week, setM6Week] = useState(1);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        setStartDates({ 1: todayStr, 3: todayStr });
        setEndDates({ 1: todayStr, 3: todayStr });
        setBaseDates({ 2: todayStr, 4: todayStr, 5: todayStr });
        setM6Date(todayStr);
        setM6Year(new Date().getFullYear());
        setM6Week(getISOWeek(new Date()));
    }, []);

    useEffect(() => {
        setResult(null);
        setExplanation([]);
        setResult(null);
    }, [activeMode]);

    if (!isMounted) return <div className={styles.loading}>Loading Calculator...</div>;

    // --- CALCULATION LOGIC ---

    const calculate = () => {
        setExplanation([]);
        setResult(null);
        let steps: string[] = [];
        let res: any = {};
        let success = false;

        try {
            // === MODE 1: COUNT DAYS ===
            if (activeMode === 1) {
                const start = parseISO(startDates[1]);
                const end = parseISO(endDates[1]);
                if (!isValid(start) || !isValid(end)) { alert('Invalid dates'); return; }

                let finalEnd = end;
                if (includeEnd) finalEnd = add(end, { days: 1 });

                const diffDaysTotal = differenceInDays(finalEnd, start);
                const absDays = Math.abs(diffDaysTotal);
                const weeks = Math.floor(absDays / 7);
                const daysRem = absDays % 7;

                // Duration Breakdown
                const duration = intervalToDuration({ start, end: finalEnd });

                res = {
                    main: `${absDays} Days`,
                    sub: `${weeks} Weeks, ${daysRem} Days`,
                    details: `${duration.years || 0} Years, ${duration.months || 0} Months, ${duration.days || 0} Days`
                };

                steps.push(`<b>Start Date:</b> ${format(start, 'PPP')}`);
                steps.push(`<b>End Date:</b> ${format(end, 'PPP')} ${includeEnd ? '(Included)' : '(Excluded)'}`);
                steps.push(`<b>Result:</b> Total ${absDays} days difference.`);
                success = true;
            }

            // === MODE 2: ADD DAYS ===
            else if (activeMode === 2) {
                const base = parseISO(baseDates[2]);
                if (!isValid(base)) { alert('Invalid Start Date'); return; }

                let finalDate;
                const duration = { years: m2Years, months: m2Months, weeks: m2Weeks, days: m2Days };

                if (operation === 'add') finalDate = add(base, duration);
                else finalDate = sub(base, duration);

                res = {
                    main: format(finalDate, 'EEEE, MMM do, yyyy'),
                    sub: 'Resulting Date',
                    details: `ISO Week ${getISOWeek(finalDate)}`
                };

                steps.push(`<b>Start Date:</b> ${format(base, 'PPP')}`);
                steps.push(`<b>Action:</b> ${operation === 'add' ? 'Added' : 'Subtracted'} ${m2Years}y ${m2Months}m ${m2Weeks}w ${m2Days}d.`);
                steps.push(`<b>Result:</b> ${format(finalDate, 'PPP')}`);
                success = true;
            }

            // === MODE 3: WORKDAYS ===
            else if (activeMode === 3) {
                const start = parseISO(startDates[3]);
                const end = parseISO(endDates[3]);
                if (!isValid(start) || !isValid(end)) { alert('Invalid dates'); return; }

                // differenceInBusinessDays excludes weekends
                const diff = differenceInBusinessDays(end, start);
                const isNegative = diff < 0;

                res = {
                    main: `${Math.abs(diff)} Workdays`,
                    sub: `Excluding Weekends`,
                    details: `From ${format(start, 'MMM do')} to ${format(end, 'MMM do')}`
                };
                steps.push(`<b>Start:</b> ${format(start, 'PPP')}`);
                steps.push(`<b>End:</b> ${format(end, 'PPP')}`);
                steps.push(`<b>Calculation:</b> Counted Monday-Friday only.`);
                steps.push(`<b>Result:</b> ${Math.abs(diff)} business days.`);
                success = true;
            }

            // === MODE 4: ADD WORKDAYS ===
            else if (activeMode === 4) {
                const base = parseISO(baseDates[4]);
                if (!isValid(base)) { alert('Invalid Start Date'); return; }

                let finalDate;
                // For subtract, just pass negative days to addBusinessDays
                const daysToAdd = operation === 'add' ? m4Days : -m4Days;
                finalDate = addBusinessDays(base, daysToAdd);

                res = {
                    main: format(finalDate, 'EEEE, MMM do, yyyy'),
                    sub: 'Resulting Workday',
                    details: `${Math.abs(m4Days)} Business Days ${operation === 'add' ? 'After' : 'Before'}`
                };

                steps.push(`<b>Start Date:</b> ${format(base, 'PPP')}`);
                steps.push(`<b>Action:</b> ${operation === 'add' ? 'Add' : 'Subtract'} ${m4Days} business days.`);
                steps.push(`<b>Result:</b> ${format(finalDate, 'PPP')}`);
                success = true;
            }

            // === MODE 5: WEEKDAY ===
            else if (activeMode === 5) {
                const base = parseISO(baseDates[5]);
                if (!isValid(base)) { alert('Invalid Date'); return; }

                res = {
                    main: format(base, 'EEEE'),
                    sub: format(base, 'd MMMM yyyy'),
                    details: `Day of Year: ${format(base, 'DO')}`
                };
                steps.push(`<b>Date:</b> ${format(base, 'PPP')}`);
                steps.push(`<b>Weekday:</b> It is a ${format(base, 'EEEE')}.`);
                success = true;
            }

            // === MODE 6: WEEK NUMBER ===
            else if (activeMode === 6) {
                if (m6Mode === 'dateToWeek') {
                    const d = parseISO(m6Date);
                    if (!isValid(d)) return;
                    const wk = getISOWeek(d);
                    const yr = format(d, 'RRRR'); // ISO Week Year

                    res = {
                        main: `Week ${wk}`,
                        sub: `ISO Year ${yr}`,
                        details: `${format(d, 'EEEE')}`
                    };
                    steps.push(`<b>Input Date:</b> ${format(d, 'PPP')}`);
                    steps.push(`<b>Result:</b> Dates falls in Week ${wk} of ISO year ${yr}.`);
                    success = true;
                } else {
                    const d = new Date(m6Year, 0, 4);
                    const week1Start = startOfISOWeek(d);
                    const targetStart = add(week1Start, { weeks: m6Week - 1 });
                    const targetEnd = endOfISOWeek(targetStart);

                    res = {
                        main: `${format(targetStart, 'MMM do')} - ${format(targetEnd, 'MMM do')}`,
                        sub: `Week ${m6Week}, ${m6Year}`,
                        details: `Monday to Sunday`
                    };
                    steps.push(`<b>Week/Year:</b> Week ${m6Week}, ${m6Year}`);
                    steps.push(`<b>Range:</b> ${format(targetStart, 'P')} - ${format(targetEnd, 'P')}`);
                    success = true;
                }
            }

            setResult(res);
            setExplanation(steps);

            // Save to History
            if (success) {
                addToHistory({
                    toolName: `Date Calc: ${MODES.find(m => m.id === activeMode)?.name}`,
                    summary: `${res.main}`,
                    url: '/tools/date-calculator'
                });
            }

        } catch (e) {
            console.error(e);
            alert("An error occurred. Please check inputs.");
        }
    };

    // --- AI & PDF ---



    return (
        <div className={styles.container}>
            {/* TABS */}
            <div className={styles.tabsContainer}>
                {MODES.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setActiveMode(m.id)}
                        className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            <div className={styles.activeModeInfo}>
                <h3 className={styles.modeTitle}>{MODES.find(m => m.id === activeMode)?.name}</h3>
                <p className={styles.modeDesc}>{MODES.find(m => m.id === activeMode)?.description}</p>
            </div>

            <div className={styles.calculatorCard}>

                {/* MODE 1: COUNT DAYS */}
                {activeMode === 1 && (
                    <div className={styles.inputGrid}>
                        <div className={styles.inputGroup}>
                            <label>Start Date</label>
                            <input type="date" value={startDates[1]} onChange={e => setStartDates({ ...startDates, 1: e.target.value })} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>End Date</label>
                            <input type="date" value={endDates[1]} onChange={e => setEndDates({ ...endDates, 1: e.target.value })} />
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="incEnd" checked={includeEnd} onChange={e => setIncludeEnd(e.target.checked)} />
                            <label htmlFor="incEnd">Include end date (+1 day)</label>
                        </div>
                    </div>
                )}

                {/* MODE 2: ADD DAYS */}
                {activeMode === 2 && (
                    <div className={styles.inputFlexCol}>
                        <div className={styles.inputGroup}>
                            <label>Start Date</label>
                            <input type="date" value={baseDates[2]} onChange={e => setBaseDates({ ...baseDates, 2: e.target.value })} />
                        </div>
                        <div className={styles.radioGroup}>
                            <button className={`${styles.choiceBtn} ${operation === 'add' ? styles.choiceActive : ''}`} onClick={() => setOperation('add')}>+ Add</button>
                            <button className={`${styles.choiceBtn} ${operation === 'subtract' ? styles.choiceActive : ''}`} onClick={() => setOperation('subtract')}>- Subtract</button>
                        </div>
                        <div className={styles.multiInputGrid}>
                            <div className={styles.miniInput}><label>Years</label><input type="number" value={m2Years} onChange={e => setM2Years(Number(e.target.value))} /></div>
                            <div className={styles.miniInput}><label>Months</label><input type="number" value={m2Months} onChange={e => setM2Months(Number(e.target.value))} /></div>
                            <div className={styles.miniInput}><label>Weeks</label><input type="number" value={m2Weeks} onChange={e => setM2Weeks(Number(e.target.value))} /></div>
                            <div className={styles.miniInput}><label>Days</label><input type="number" value={m2Days} onChange={e => setM2Days(Number(e.target.value))} /></div>
                        </div>
                    </div>
                )}

                {/* MODE 3: WORKDAYS */}
                {activeMode === 3 && (
                    <div className={styles.inputGrid}>
                        <div className={styles.inputGroup}>
                            <label>Start Date (From)</label>
                            <input type="date" value={startDates[3]} onChange={e => setStartDates({ ...startDates, 3: e.target.value })} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>End Date (To)</label>
                            <input type="date" value={endDates[3]} onChange={e => setEndDates({ ...endDates, 3: e.target.value })} />
                        </div>
                    </div>
                )}

                {/* MODE 4: ADD WORKDAYS */}
                {activeMode === 4 && (
                    <div className={styles.inputFlexCol}>
                        <div className={styles.inputGroup}>
                            <label>Start Date</label>
                            <input type="date" value={baseDates[4]} onChange={e => setBaseDates({ ...baseDates, 4: e.target.value })} />
                        </div>
                        <div className={styles.radioGroup}>
                            <button className={`${styles.choiceBtn} ${operation === 'add' ? styles.choiceActive : ''}`} onClick={() => setOperation('add')}>+ Add</button>
                            <button className={`${styles.choiceBtn} ${operation === 'subtract' ? styles.choiceActive : ''}`} onClick={() => setOperation('subtract')}>- Subtract</button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Number of Workdays</label>
                            <input type="number" className={styles.bigInput} value={m4Days} onChange={e => setM4Days(Number(e.target.value))} />
                        </div>
                    </div>
                )}

                {/* MODE 5: WEEKDAY */}
                {activeMode === 5 && (
                    <div className={styles.inputGroup}>
                        <label>Select Date</label>
                        <input type="date" value={baseDates[5]} onChange={e => setBaseDates({ ...baseDates, 5: e.target.value })} />
                    </div>
                )}

                {/* MODE 6: WEEK NUMBER */}
                {activeMode === 6 && (
                    <div className={styles.inputFlexCol}>
                        <div className={styles.radioGroup}>
                            <button className={`${styles.choiceBtn} ${m6Mode === 'dateToWeek' ? styles.choiceActive : ''}`} onClick={() => setM6Mode('dateToWeek')}>Date → Week</button>
                            <button className={`${styles.choiceBtn} ${m6Mode === 'weekToDate' ? styles.choiceActive : ''}`} onClick={() => setM6Mode('weekToDate')}>Week → Date</button>
                        </div>
                        {m6Mode === 'dateToWeek' ? (
                            <div className={styles.inputGroup}>
                                <label>Select Date</label>
                                <input type="date" value={m6Date} onChange={e => setM6Date(e.target.value)} />
                            </div>
                        ) : (
                            <div className={styles.inputGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Year</label>
                                    <input type="number" value={m6Year} onChange={e => setM6Year(Number(e.target.value))} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Week Number (1-53)</label>
                                    <input type="number" value={m6Week} onChange={e => setM6Week(Number(e.target.value))} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ACTIONS */}
                <div className={styles.actionRow}>
                    <button className={styles.mainBtn} onClick={calculate}>Calculate</button>
                    <button className={styles.secondaryBtn} onClick={() => setResult(null)}><FaUndo /> Reset</button>
                </div>
            </div>

            {/* RESULTS */}
            {result && (
                <div className={styles.resultSection}>
                    <ToolResult
                        title={result.main}
                        subTitle={result.sub}
                        details={result.details}
                        explanation={explanation}
                        toolName="Date Calculator"
                        aiPrompt={`Analyze this date calculation: ${result.main} (${result.sub}). Start date context: ${JSON.stringify(startDates || baseDates)}. Provide 3 fun facts, planning tips, or interesting historical context related to this timeframe or date.`}
                    />
                </div>
            )}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Global Date Calculator",
                        "featureList": "Count Days, Add Days, Workdays, Week Number, Weekday",
                    })
                }}
            />
        </div>
    );
}

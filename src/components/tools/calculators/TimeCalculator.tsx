'use client';

import React, { useState, useEffect } from 'react';
import {
    format,
    isValid,
    parseISO,
    differenceInSeconds,
    intervalToDuration,
    addSeconds,
    differenceInDays
} from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaCalculator, FaFilePdf, FaRobot, FaInfoCircle, FaUndo, FaClock, FaCalendarAlt } from 'react-icons/fa';
import styles from './TimeCalculator.module.css';
import { generateDateInsight } from '@/actions/tools/date-calculator';
import { useHistory } from '@/context/HistoryContext';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

const MODES = [
    { id: 1, name: 'Add / Subtract', desc: 'Math' },
    { id: 2, name: 'Time Between', desc: 'Duration' },
    { id: 3, name: 'Multiply / Divide', desc: 'Scale' },
    { id: 4, name: 'Work / Watch', desc: 'Payroll' },
    { id: 5, name: 'Converter', desc: 'Convert' },
    { id: 6, name: 'Date Diff', desc: 'Interval' },
];

// Helper to convert HMS to Total Seconds
const toSeconds = (h: number, m: number, s: number) => (h * 3600) + (m * 60) + s;
// Helper to convert Total Seconds to HMS
const fromSeconds = (total: number) => {
    const isNeg = total < 0;
    const abs = Math.abs(total);
    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = abs % 60;
    return { h: isNeg ? -h : h, m, s, isNeg };
};
// Helper to pad
const pad = (n: number) => Math.abs(n).toString().padStart(2, '0');

export default function TimeCalculator() {
    const { addToHistory } = useHistory();
    const [activeMode, setActiveMode] = useState(1);
    const [result, setResult] = useState<any>(null);
    const [explanation, setExplanation] = useState<string[]>([]);
    const [aiTip, setAiTip] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // --- Inputs ---
    // Mode 1: Add/Sub
    const [m1Start, setM1Start] = useState({ h: 0, m: 0, s: 0 });
    const [m1Op, setM1Op] = useState<'add' | 'sub'>('add');
    const [m1Val, setM1Val] = useState({ h: 0, m: 0, s: 0 });

    // Mode 2: Time Between
    const [m2Start, setM2Start] = useState('09:00');
    const [m2End, setM2End] = useState('17:00');

    // Mode 3: Mult/Div
    const [m3Time, setM3Time] = useState({ h: 0, m: 0, s: 0 });
    const [m3Op, setM3Op] = useState<'mul' | 'div'>('mul');
    const [m3Factor, setM3Factor] = useState(2);

    // Mode 4: Work Time
    const [m4Start, setM4Start] = useState('09:00');
    const [m4End, setM4End] = useState('17:00');
    const [m4Break, setM4Break] = useState(30); // minutes

    // Mode 5: Converter
    const [m5Val, setM5Val] = useState(1);
    const [m5Unit, setM5Unit] = useState('hours');

    // Mode 6: Date Diff
    const [m6Start, setM6Start] = useState('');
    const [m6End, setM6End] = useState('');

    useEffect(() => {
        setIsMounted(true);
        const now = new Date();
        const nowStr = format(now, "yyyy-MM-dd'T'HH:mm");
        setM6Start(nowStr);
        setM6End(nowStr);
    }, []);

    useEffect(() => {
        setResult(null);
        setExplanation([]);
        setAiTip('');
    }, [activeMode]);

    if (!isMounted) return <div className={styles.loading}>Loading Time Calculator...</div>;

    const calculate = () => {
        setResult(null);
        setExplanation([]);
        let steps: string[] = [];
        let res: any = {};

        try {
            // === MODE 1: ADD/SUB ===
            if (activeMode === 1) {
                const s1 = toSeconds(Number(m1Start.h), Number(m1Start.m), Number(m1Start.s));
                const s2 = toSeconds(Number(m1Val.h), Number(m1Val.m), Number(m1Val.s));
                let total = m1Op === 'add' ? s1 + s2 : s1 - s2;
                const final = fromSeconds(total);

                const sign = m1Op === 'add' ? '+' : '-';
                res = {
                    main: `${final.isNeg ? '-' : ''}${pad(final.h)}:${pad(final.m)}:${pad(final.s)}`,
                    sub: `${Math.abs(total)} Total Seconds`,
                    details: 'Result Format: HH:MM:SS'
                };
                steps.push(`<b>Start Time:</b> ${pad(m1Start.h)}:${pad(m1Start.m)}:${pad(m1Start.s)} (${s1}s)`);
                steps.push(`<b>Operation:</b> ${sign} ${pad(m1Val.h)}:${pad(m1Val.m)}:${pad(m1Val.s)} (${s2}s)`);
                steps.push(`<b>Calculation:</b> ${s1} ${sign} ${s2} = ${total} seconds.`);
                steps.push(`<b>Convert Back:</b> ${total}s = ${res.main}`);
            }

            // === MODE 2: TIME BETWEEN ===
            else if (activeMode === 2) {
                // Using dummy date to handle cross-midnight if needed, but simple HMS diff is usually requested
                // Let's assume same day unless end < start, then add 24h
                let [h1, m1] = m2Start.split(':').map(Number);
                let [h2, m2] = m2End.split(':').map(Number);

                let startMins = h1 * 60 + m1;
                let endMins = h2 * 60 + m2;

                if (endMins < startMins) endMins += 24 * 60; // Next day assumption

                const diffMins = endMins - startMins;
                const h = Math.floor(diffMins / 60);
                const m = diffMins % 60;

                res = {
                    main: `${h} Hours ${m} Minutes`,
                    sub: `${diffMins} Total Minutes`,
                    details: 'Assuming duration is less than 24 hours.'
                };
                steps.push(`<b>Start:</b> ${m2Start}, <b>End:</b> ${m2End}`);
                steps.push(`<b>Convert to Mins:</b> Start=${startMins}, End=${endMins}`);
                steps.push(`<b>Difference:</b> ${endMins} - ${startMins} = ${diffMins} minutes.`);
            }

            // === MODE 3: MUL/DIV ===
            else if (activeMode === 3) {
                const s1 = toSeconds(Number(m3Time.h), Number(m3Time.m), Number(m3Time.s));
                const factor = Number(m3Factor);
                if (m3Op === 'div' && factor === 0) { alert('Cannot divide by zero'); return; }

                const total = m3Op === 'mul' ? s1 * factor : s1 / factor;
                const final = fromSeconds(Math.round(total));

                res = {
                    main: `${pad(final.h)}:${pad(final.m)}:${pad(final.s)}`,
                    sub: `${total.toFixed(2)} Total Seconds`,
                    details: ''
                };
                steps.push(`<b>Input:</b> ${pad(m3Time.h)}:${pad(m3Time.m)}:${pad(m3Time.s)} (${s1}s)`);
                steps.push(`<b>Operation:</b> ${m3Op === 'mul' ? 'Multiply' : 'Divide'} by ${factor}`);
                steps.push(`<b>Result:</b> ${total} seconds -> ${res.main}`);
            }

            // === MODE 4: WORK / WATCH TIME ===
            else if (activeMode === 4) {
                let [h1, m1] = m4Start.split(':').map(Number);
                let [h2, m2] = m4End.split(':').map(Number);
                let startMins = h1 * 60 + m1;
                let endMins = h2 * 60 + m2;
                if (endMins < startMins) endMins += 24 * 60;

                const grossMins = endMins - startMins;
                const netMins = grossMins - Number(m4Break);

                const h = Math.floor(netMins / 60);
                const m = netMins % 60;

                res = {
                    main: `${h}h ${m}m`,
                    sub: `Net Working Time`,
                    details: `Gross: ${(grossMins / 60).toFixed(1)}h, Break: ${m4Break}m`
                };
                steps.push(`<b>Shift:</b> ${m4Start} to ${m4End} (${grossMins} mins)`);
                steps.push(`<b>Break:</b> -${m4Break} minutes`);
                steps.push(`<b>Net:</b> ${grossMins} - ${m4Break} = ${netMins} minutes.`);
            }

            // === MODE 5: CONVERTER ===
            else if (activeMode === 5) {
                let seconds = 0;
                const val = Number(m5Val);
                switch (m5Unit) {
                    case 'years': seconds = val * 31536000; break;
                    case 'days': seconds = val * 86400; break;
                    case 'hours': seconds = val * 3600; break;
                    case 'minutes': seconds = val * 60; break;
                    case 'seconds': seconds = val; break;
                }
                const f = fromSeconds(seconds);
                res = {
                    main: `${seconds.toLocaleString()} Seconds`,
                    sub: `${(seconds / 60).toFixed(2)} Minutes`,
                    details: `${(seconds / 3600).toFixed(2)} Hours`
                };
                steps.push(`<b>Input:</b> ${val} ${m5Unit}`);
                steps.push(`<b>Conversion Factor:</b> Calculated relative to seconds.`);
                steps.push(`<b>Result:</b> ${seconds} seconds.`);
            }

            // === MODE 6: TIME BETWEEN DATES ===
            else if (activeMode === 6) {
                const start = parseISO(m6Start);
                const end = parseISO(m6End);
                if (!isValid(start) || !isValid(end)) { alert('Invalid Dates'); return; }

                const dur = intervalToDuration({ start, end });
                const totalSec = differenceInSeconds(end, start);

                res = {
                    main: `${dur.days || 0}d ${dur.hours || 0}h ${dur.minutes || 0}m`,
                    sub: `${dur.years ? dur.years + ' Years, ' : ''}${dur.months ? dur.months + ' Months' : ''}`,
                    details: `Total: ${totalSec.toLocaleString()} Seconds`
                };
                steps.push(`<b>Start:</b> ${format(start, 'PP pp')}`);
                steps.push(`<b>End:</b> ${format(end, 'PP pp')}`);
                steps.push(`<b>Duration:</b> ${dur.years || 0}y ${dur.months || 0}m ${dur.days || 0}d ${dur.hours || 0}h ${dur.minutes || 0}m`);
                steps.push(`<b>Total Seconds:</b> ${totalSec}`);
            }

            setResult(res);
            setExplanation(steps);
            addToHistory({ toolName: 'Time Calc', summary: res.main, url: '/tools/time-calculator' });

        } catch (e) {
            console.error(e);
            alert("Calculation error. check inputs.");
        }
    };

    // AI & PDF (Reused logic mainly)
    const handleAiHelp = async () => {
        if (!result) return;
        setLoadingAi(true);
        const prompt = `
            Time Calculator Context: Mode is ${MODES.find(m => m.id === activeMode)?.name}.
            Result: ${result.main} (${result.sub}).
            Details: ${explanation.map(s => s.replace(/<[^>]*>?/gm, '')).join('. ')}.
            Provide a productivity tip or fun fact about this duration. Max 2 sentences.
        `;
        const text = await generateDateInsight(prompt);
        setAiTip(text);
        setLoadingAi(false);
    };

    const downloadPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('Time Calculator Report', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated by SavMe.io`, 14, 26);
        doc.line(14, 30, 196, 30);
        doc.setFontSize(18);
        doc.text(result.main, 14, 45);
        if (result.sub) { doc.setFontSize(12); doc.text(result.sub, 14, 52); }
        const rows = explanation.map(s => {
            const clean = s.replace(/<[^>]*>?/gm, '');
            const parts = clean.split(':');
            return [parts[0], parts.slice(1).join(':').trim()];
        });
        autoTable(doc, { startY: 60, head: [['Step', 'Detail']], body: rows });
        doc.save('savme-time-report.pdf');
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>

                {/* TABS */}
                <div className={styles.tabs}>
                    {MODES.map(m => (
                        <button key={m.id} className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`} onClick={() => setActiveMode(m.id)}>
                            {m.name}
                        </button>
                    ))}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}><FaClock /> {MODES.find(m => m.id === activeMode)?.name}</h2>
                        <p className={styles.cardDesc}>{MODES.find(m => m.id === activeMode)?.desc}</p>
                    </div>

                    {/* INPUTS DYNAMIC */}
                    <div className={styles.inputSection}>

                        {activeMode === 1 && (
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Start Time (H : M : S)</label>
                                    <div className={styles.timeInputWrapper}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m1Start.h}
                                            onChange={e => setM1Start({ ...m1Start, h: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                            placeholder="HH"
                                        />
                                        <span className={styles.colon}>:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m1Start.m}
                                            onChange={e => setM1Start({ ...m1Start, m: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                            placeholder="MM"
                                        />
                                        <span className={styles.colon}>:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m1Start.s}
                                            onChange={e => setM1Start({ ...m1Start, s: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                            placeholder="SS"
                                        />
                                    </div>
                                </div>
                                <select className={styles.operationSelect} value={m1Op} onChange={(e: any) => setM1Op(e.target.value)}>
                                    <option value="add">+ Add</option>
                                    <option value="sub">- Subtract</option>
                                </select>
                                <div className={styles.inputGroup}>
                                    <label>Value (H : M : S)</label>
                                    <div className={styles.timeInputWrapper}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m1Val.h}
                                            onChange={e => setM1Val({ ...m1Val, h: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                        />
                                        <span className={styles.colon}>:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m1Val.m}
                                            onChange={e => setM1Val({ ...m1Val, m: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                        />
                                        <span className={styles.colon}>:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m1Val.s}
                                            onChange={e => setM1Val({ ...m1Val, s: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeMode === 2 || activeMode === 4) && (
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Start Time</label>
                                    <input type="time" value={activeMode === 2 ? m2Start : m4Start} onChange={e => activeMode === 2 ? setM2Start(e.target.value) : setM4Start(e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>End Time</label>
                                    <input type="time" value={activeMode === 2 ? m2End : m4End} onChange={e => activeMode === 2 ? setM2End(e.target.value) : setM4End(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {activeMode === 3 && (
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Time Duration (H : M : S)</label>
                                    <div className={styles.timeInputWrapper}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m3Time.h}
                                            onChange={e => setM3Time({ ...m3Time, h: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                        />
                                        <span className={styles.colon}>:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m3Time.m}
                                            onChange={e => setM3Time({ ...m3Time, m: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                        />
                                        <span className={styles.colon}>:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={styles.timeField}
                                            value={m3Time.s}
                                            onChange={e => setM3Time({ ...m3Time, s: +e.target.value })}
                                            onFocus={e => e.target.select()}
                                        />
                                    </div>
                                </div>
                                <select className={styles.operationSelect} value={m3Op} onChange={(e: any) => setM3Op(e.target.value)}>
                                    <option value="mul">x Multiply</option>
                                    <option value="div">÷ Divide</option>
                                </select>
                                <div className={styles.inputGroup}>
                                    <label>By Number</label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={m3Factor}
                                        onChange={e => setM3Factor(Number(e.target.value))}
                                        onFocus={(e: any) => e.target.select()}
                                    />
                                </div>
                            </div>
                        )}

                        {activeMode === 4 && (
                            <div className={styles.inputGroup}>
                                <label>Break Duration (Minutes)</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={m4Break}
                                    onChange={e => setM4Break(Number(e.target.value))}
                                    onFocus={(e: any) => e.target.select()}
                                />
                            </div>
                        )}

                        {activeMode === 5 && (
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Value</label>
                                    <input type="number" value={m5Val} onChange={e => setM5Val(Number(e.target.value))} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Unit</label>
                                    <select value={m5Unit} onChange={e => setM5Unit(e.target.value)}>
                                        <option value="years">Years</option>
                                        <option value="days">Days</option>
                                        <option value="hours">Hours</option>
                                        <option value="minutes">Minutes</option>
                                        <option value="seconds">Seconds</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeMode === 6 && (
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Start Date & Time</label>
                                    <input type="datetime-local" value={m6Start} onChange={e => setM6Start(e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>End Date & Time</label>
                                    <input type="datetime-local" value={m6End} onChange={e => setM6End(e.target.value)} />
                                </div>
                            </div>
                        )}

                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={calculate}>Calculate</button>
                        <button className={styles.btnSecondary} onClick={() => setResult(null)}><FaUndo /> Reset</button>
                    </div>

                    {result && (
                        <div className={styles.resultBox}>
                            <div className={styles.resultHeader}>
                                <span>Result</span>
                                <div className={styles.resultTools}>
                                    <button onClick={downloadPDF}><FaFilePdf /> PDF</button>
                                    <button onClick={handleAiHelp} disabled={loadingAi}><FaRobot /> AI</button>
                                </div>
                            </div>
                            <div className={styles.resultMain}>{result.main}</div>
                            <div className={styles.resultSub}>{result.sub}</div>
                            <div className={styles.resultDetails}>{result.details}</div>

                            <div className={styles.explanation}>
                                <h4><FaInfoCircle /> Explanation</h4>
                                <ul>{explanation.map((s, i) => <li key={i} dangerouslySetInnerHTML={{ __html: s }} />)}</ul>
                            </div>

                            {aiTip && (
                                <div className={styles.aiTip}>
                                    <strong><FaRobot /> AI Insight:</strong> {aiTip}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SEO CONTENT */}
                <article className={styles.seoContent}>
                    <h3>Time Calculator</h3>
                    <p>
                        This advanced <strong>Time Calculator</strong> allows you to perform complex time math easily.
                        Whether you need to add hours and minutes, calculate work duration, or find the difference between two dates, this tool handles it all.
                        Perfect for payroll, editing, and planning.
                    </p>
                    <div className={styles.faq}>
                        <details>
                            <summary>How does the time calculator work?</summary>
                            <p>It converts your inputs into total seconds, performs the math operations, and then converts the result back into a readable Hours:Minutes:Seconds format.</p>
                        </details>
                        <details>
                            <summary>Can I calculate work time?</summary>
                            <p>Yes, use the "Work / Watch Time" mode to enter start/end times and subtract breaks.</p>
                        </details>
                        <details>
                            <summary>Can I calculate time in minutes and seconds?</summary>
                            <p>Yes, our "Time Converter" mode lets you convert any duration into total minutes or seconds instantly.</p>
                        </details>
                    </div>
                </article>

                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Time Calculator",
                        "applicationCategory": "Utilities",
                        "featureList": "Add Time, Time Difference, Work Time Calculator, Time Converter"
                    })
                }} />

            </div>

            {/* AD SIDEBAR */}
            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    <div className={styles.card}>
                        <AdSlot label="Advertisement" className="h-full mb-8" variant="clean" />
                        <RelatedTools currentToolSlug="time-calculator" variant="clean" />
                    </div>
                </div>
            </div>
        </div>
    );
}

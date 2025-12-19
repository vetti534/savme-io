'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function CountdownTimer() {
    const [targetDate, setTargetDate] = useState<string>('');
    const [targetTime, setTargetTime] = useState<string>('00:00');

    // Set default target to strictly tomorrow for demo
    useEffect(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        setTargetDate(d.toISOString().split('T')[0]);
    }, []);

    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            calculateTimeLeft();
        }, 1000);

        calculateTimeLeft(); // Initial

        return () => clearInterval(timer);
    }, [targetDate, targetTime]);

    const calculateTimeLeft = () => {
        if (!targetDate) return;

        const target = new Date(`${targetDate}T${targetTime}:00`);
        const now = new Date();

        const diff = target.getTime() - now.getTime();

        if (diff <= 0) {
            setIsExpired(true);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        setIsExpired(false);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Target Date</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Target Time</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="time"
                                value={targetTime}
                                onChange={(e) => setTargetTime(e.target.value)}
                            />
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <div className="bg-gray-900 text-white rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
                        {isExpired ? (
                            <h2 className="text-3xl font-bold text-red-400 animate-pulse">Time's Up!</h2>
                        ) : (
                            <div className="flex justify-center gap-4 text-center">
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono">{timeLeft.days}</div>
                                    <div className="text-xs uppercase text-gray-400 mt-1">Days</div>
                                </div>
                                <div className="text-4xl font-bold text-gray-600">:</div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                                    <div className="text-xs uppercase text-gray-400 mt-1">Hours</div>
                                </div>
                                <div className="text-4xl font-bold text-gray-600">:</div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                    <div className="text-xs uppercase text-gray-400 mt-1">Mins</div>
                                </div>
                                <div className="text-4xl font-bold text-gray-600">:</div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-blue-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                    <div className="text-xs uppercase text-gray-400 mt-1">Secs</div>
                                </div>
                            </div>
                        )}
                        <p className="mt-4 text-gray-400 text-sm">Counting down to {targetDate} {targetTime}</p>
                    </div>

                    {/* Hidden ToolResult for AI Context but hidden visually if we want custom UI? 
                         actually ToolResult is good for consistency, let's render it below or instead.
                         The custom UI above is nice. Let's keep it and maybe pass data to AI via hidden ToolResult?
                         Or just use ToolResult standard. Standard is safer for consistency.
                         Let's use the custom block above AS the result, but rely on standard component structure?
                         No, I'll put a ToolResult below for "Summary".
                    */}
                    <div className="hidden">
                        <ToolResult
                            title={`${timeLeft.days}d ${timeLeft.hours}h`}
                            toolName="Countdown"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

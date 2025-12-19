'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function WeightLossCalculator() {
    const [currentWeight, setCurrentWeight] = useState<number>(80);
    const [targetWeight, setTargetWeight] = useState<number>(75);
    const [activityLevel, setActivityLevel] = useState<number>(1.2); // PAL
    const [height, setHeight] = useState<number>(175); // cm
    const [age, setAge] = useState<number>(30);
    const [gender, setGender] = useState<string>('male');
    const [lossPerWeek, setLossPerWeek] = useState<number>(0.5); // kg

    const [days, setDays] = useState<number>(0);
    const [calories, setCalories] = useState<number>(0);

    useEffect(() => {
        calculatePlan();
    }, [currentWeight, targetWeight, activityLevel, height, age, gender, lossPerWeek]);

    const calculatePlan = () => {
        // Mifflin-St Jeor Equation
        // Men: 10W + 6.25H - 5A + 5
        // Women: 10W + 6.25H - 5A - 161
        const w = currentWeight;
        const h = height;
        const a = age;

        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        if (gender === 'male') bmr += 5;
        else bmr -= 161;

        const tdee = bmr * activityLevel;

        const weightDiff = currentWeight - targetWeight;
        if (weightDiff <= 0) {
            setDays(0);
            setCalories(Math.round(tdee)); // Maintenance
            return;
        }

        // 1 kg fat approx 7700 kcal
        // Deficit needed = weightDiff * 7700
        // Deficit per day = lossPerWeek * 7700 / 7 = lossPerWeek * 1100

        const lossPerDayKg = lossPerWeek / 7; // e.g., 0.5/7 = 0.07 kg/day
        const deficitPerDay = lossPerDayKg * 7700; // 0.07 * 7700 = 550 kcal

        const targetCals = tdee - deficitPerDay;

        // Safety check (don't go below 1200 generally)
        // But let's just calculate math for now.
        setCalories(Math.round(targetCals));

        const daysRequired = weightDiff / lossPerDayKg;
        setDays(Math.ceil(daysRequired));
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup} style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Current Weight (kg)</label>
                            <input
                                className={styles.inputWrapper} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Target Weight (kg)</label>
                            <input
                                className={styles.inputWrapper} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                type="number"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup} style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Height (cm)</label>
                            <input
                                className={styles.inputWrapper} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Age</label>
                            <input
                                className={styles.inputWrapper} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Activity Level</label>
                        <select
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                        >
                            <option value={1.2}>Sedentary (Office job)</option>
                            <option value={1.375}>Light Exercise (1-2 days/wk)</option>
                            <option value={1.55}>Moderate Exercise (3-5 days/wk)</option>
                            <option value={1.725}>Heavy Exercise (6-7 days/wk)</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Target Loss per Week</label>
                        <select
                            value={lossPerWeek}
                            onChange={(e) => setLossPerWeek(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
                        >
                            <option value={0.25}>0.25 kg (Slow & Steady)</option>
                            <option value={0.5}>0.5 kg (Recommended)</option>
                            <option value={0.75}>0.75 kg (Fast)</option>
                            <option value={1}>1.0 kg (Aggressive)</option>
                        </select>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${Math.round(days / 7)} Weeks`}
                        subTitle="Estimated Time"
                        toolName="Weight Loss Planner"
                        extraStats={[
                            { label: 'Daily Calories', value: `${calories} kcal` },
                            { label: 'Exact Days', value: `${days}` },
                        ]}
                        aiPrompt={`Weight Loss Plan. Current: ${currentWeight}kg, Target: ${targetWeight}kg. Eat ${calories} kcal/day to lose ${lossPerWeek}kg/week.`}
                    />
                    <div className="mt-4 text-xs text-gray-400">
                        Based on Mifflin-St Jeor Equation. Consult a doctor before starting any strict diet.
                    </div>
                </div>
            </div>
        </div>
    );
}

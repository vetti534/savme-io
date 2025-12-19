'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function ElectricityBillCalculator() {
    const [power, setPower] = useState<number>(100); // Watts
    const [hours, setHours] = useState<number>(5); // Hours per day
    const [rate, setRate] = useState<number>(0.15); // Rate per kWh

    // Cost per Day, Month, Year
    const [costDay, setCostDay] = useState<number>(0);
    const [costMonth, setCostMonth] = useState<number>(0);
    const [kwhDay, setKwhDay] = useState<number>(0);

    useEffect(() => {
        // kWh per day = (Watts * Hours) / 1000
        const kwh = (power * hours) / 1000;
        setKwhDay(parseFloat(kwh.toFixed(3)));

        const cDay = kwh * rate;
        setCostDay(parseFloat(cDay.toFixed(2)));
        setCostMonth(parseFloat((cDay * 30).toFixed(2)));
    }, [power, hours, rate]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Device Power (Watts)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={power}
                                onChange={(e) => setPower(Number(e.target.value))}
                            />
                            <span>W</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Usage per Day (Hours)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                            />
                            <span>h</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Electricity Rate ($/kWh)</label>
                        <div className={styles.inputWrapper}>
                            <span style={{ paddingLeft: '10px', color: '#888' }}>$</span>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                            />
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`$${costMonth}`}
                        subTitle="Monthly Cost"
                        toolName="Electricity Calculator"
                        extraStats={[
                            { label: 'Daily Cost', value: `$${costDay}` },
                            { label: 'Daily Usage', value: `${kwhDay} kWh` },
                            { label: 'Yearly Cost', value: `$${(costMonth * 12).toFixed(2)}` },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

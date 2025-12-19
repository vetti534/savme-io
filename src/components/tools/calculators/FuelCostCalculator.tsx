'use client';

import { useState, useEffect } from 'react';
import styles from './SimpleInterestCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function FuelCostCalculator() {
    const [distance, setDistance] = useState<number>(100);
    const [efficiency, setEfficiency] = useState<number>(25); // MPG or km/L
    const [price, setPrice] = useState<number>(3.50); // Price per gallon or liter

    // Units not explicitly handled here, assumes user matches (e.g. Miles & MPG & $/Gal OR Km & Km/L & $/L)
    // Basic math is same: (Dist / Eff) * Price

    const [cost, setCost] = useState<number>(0);

    useEffect(() => {
        if (distance > 0 && efficiency > 0) {
            const fuelNeeded = distance / efficiency;
            setCost(parseFloat((fuelNeeded * price).toFixed(2)));
        } else {
            setCost(0);
        }
    }, [distance, efficiency, price]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Trip Distance</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(Number(e.target.value))}
                                placeholder="Miles/Km"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Fuel Efficiency (MPG or km/L)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={efficiency}
                                onChange={(e) => setEfficiency(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Fuel Price</label>
                        <div className={styles.inputWrapper}>
                            <span style={{ paddingLeft: '10px', color: '#888' }}>$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="Per Gal/L"
                            />
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`$${cost}`}
                        subTitle="Total Cost"
                        toolName="Fuel Cost Calculator"
                        extraStats={[
                            { label: 'Fuel Needed', value: `${efficiency > 0 ? (distance / efficiency).toFixed(2) : 0} units` },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

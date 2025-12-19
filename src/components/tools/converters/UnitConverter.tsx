'use client';

import { useState, useEffect } from 'react';
import styles from './UnitConverter.module.css';
import ToolResult from '@/components/tools/ToolResult';
import { usePathname } from 'next/navigation';

type ConversionType = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'time' | 'speed';

// Unit Definitions with conversion factors (relative to a base unit)
const UNITS: Record<ConversionType, Record<string, { label: string, factor: number | ((val: number) => number), offset?: number }>> = {
    length: {
        'm': { label: 'Meters', factor: 1 },
        'km': { label: 'Kilometers', factor: 1000 },
        'cm': { label: 'Centimeters', factor: 0.01 },
        'mm': { label: 'Millimeters', factor: 0.001 },
        'in': { label: 'Inches', factor: 0.0254 },
        'ft': { label: 'Feet', factor: 0.3048 },
        'yd': { label: 'Yards', factor: 0.9144 },
        'mi': { label: 'Miles', factor: 1609.34 },
    },
    weight: {
        'kg': { label: 'Kilograms', factor: 1 },
        'g': { label: 'Grams', factor: 0.001 },
        'mg': { label: 'Milligrams', factor: 0.000001 },
        'lb': { label: 'Pounds', factor: 0.453592 },
        'oz': { label: 'Ounces', factor: 0.0283495 },
        't': { label: 'Tonnes', factor: 1000 },
    },
    temperature: {
        // Temp is special, handles formulas separately below
        'c': { label: 'Celsius', factor: 1 },
        'f': { label: 'Fahrenheit', factor: 1 },
        'k': { label: 'Kelvin', factor: 1 },
    },
    area: {
        'sq_m': { label: 'Square Meters', factor: 1 },
        'sq_km': { label: 'Square Kilometers', factor: 1000000 },
        'sq_ft': { label: 'Square Feet', factor: 0.092903 },
        'ac': { label: 'Acres', factor: 4046.86 },
        'ha': { label: 'Hectares', factor: 10000 },
    },
    volume: {
        'l': { label: 'Liters', factor: 1 },
        'ml': { label: 'Milliliters', factor: 0.001 },
        'gal': { label: 'Gallons (US)', factor: 3.78541 },
        'qt': { label: 'Quarts (US)', factor: 0.946353 },
        'pt': { label: 'Pints (US)', factor: 0.473176 },
        'cup': { label: 'Cups', factor: 0.236588 },
    },
    time: {
        's': { label: 'Seconds', factor: 1 },
        'min': { label: 'Minutes', factor: 60 },
        'h': { label: 'Hours', factor: 3600 },
        'd': { label: 'Days', factor: 86400 },
        'wk': { label: 'Weeks', factor: 604800 },
        'y': { label: 'Years', factor: 31536000 },
    },
    speed: {
        'mps': { label: 'm/s', factor: 1 },
        'kmh': { label: 'km/h', factor: 0.277778 },
        'mph': { label: 'mph', factor: 0.44704 },
        'kt': { label: 'Knots', factor: 0.514444 },
    }
};

export default function UnitConverter() {
    const pathname = usePathname();
    const slug = pathname?.split('/').pop() || '';

    // Infer type from slug
    const [type, setType] = useState<ConversionType>('length');

    useEffect(() => {
        if (slug.includes('length')) setType('length');
        else if (slug.includes('weight')) setType('weight');
        else if (slug.includes('temperature')) setType('temperature');
        else if (slug.includes('area')) setType('area');
        else if (slug.includes('volume')) setType('volume');
        else if (slug.includes('time') && slug.includes('converter')) setType('time');
        else if (slug.includes('speed')) setType('speed');
        else if (slug === 'conversion-calculator') setType('length'); // Default
    }, [slug]);

    const [value, setValue] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState<string>('');
    const [toUnit, setToUnit] = useState<string>('');
    const [result, setResult] = useState<number>(0);

    // Initialize units when type changes
    useEffect(() => {
        const unitKeys = Object.keys(UNITS[type]);
        setFromUnit(unitKeys[0]);
        setToUnit(unitKeys[1] || unitKeys[0]);
    }, [type]);

    useEffect(() => {
        calculateConversion();
    }, [value, fromUnit, toUnit, type]);

    const calculateConversion = () => {
        if (!fromUnit || !toUnit) return;

        if (type === 'temperature') {
            let valInC = value;
            // Convert TO Celsius first
            if (fromUnit === 'f') valInC = (value - 32) * 5 / 9;
            else if (fromUnit === 'k') valInC = value - 273.15;
            else valInC = value; // Already C

            // Convert FROM Celsius to Target
            let final = valInC;
            if (toUnit === 'f') final = (valInC * 9 / 5) + 32;
            else if (toUnit === 'k') final = valInC + 273.15;

            setResult(parseFloat(final.toFixed(4)));
        } else {
            // Standard factor-based conversion
            // Base Unit Limit = (Value * FromFactor)
            // Target Value = Base Unit Limit / ToFactor
            const fromFactor = UNITS[type][fromUnit].factor as number;
            const toFactor = UNITS[type][toUnit].factor as number;

            const baseValue = value * fromFactor;
            const finalValue = baseValue / toFactor;

            setResult(parseFloat(finalValue.toFixed(6)));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    {/* Optional Type Selector if they are on global page */}
                    <div className={styles.inputGroup}>
                        <label>Converter Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as ConversionType)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                        >
                            <option value="length">Length</option>
                            <option value="weight">Weight</option>
                            <option value="temperature">Temperature</option>
                            <option value="area">Area</option>
                            <option value="volume">Volume</option>
                            <option value="time">Time</option>
                            <option value="speed">Speed</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>From</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                            />
                            <select
                                className={styles.select}
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                            >
                                {Object.entries(UNITS[type]).map(([key, u]) => (
                                    <option key={key} value={key}>{u.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>To</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                readOnly
                                value={result}
                                className="bg-transparent font-bold text-blue-600"
                            />
                            <select
                                className={styles.select}
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                            >
                                {Object.entries(UNITS[type]).map(([key, u]) => (
                                    <option key={key} value={key}>{u.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${result} ${UNITS[type][toUnit]?.label || ''}`}
                        subTitle={`Converted from ${value} ${UNITS[type][fromUnit]?.label || ''}`}
                        toolName={`${type.charAt(0).toUpperCase() + type.slice(1)} Converter`}
                        extraStats={[
                            { label: 'Type', value: type.toUpperCase() },
                        ]}
                        aiPrompt={`Convert ${value} ${fromUnit} to ${toUnit}. Result ${result}.`}
                    />
                </div>
            </div>
        </div>
    );
}

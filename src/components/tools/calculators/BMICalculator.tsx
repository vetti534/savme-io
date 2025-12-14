'use client';

import { useState } from 'react';
import CalculatorLayout from './shared/CalculatorLayout';

export default function BMICalculator() {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    const [weight, setWeight] = useState<number>(70); // kg
    const [height, setHeight] = useState<number>(170); // cm
    const [bmi, setBmi] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('');

    const calculate = () => {
        let calculatedBmi = 0;
        if (unit === 'metric') {
            // weight (kg) / [height (m)]^2
            calculatedBmi = weight / Math.pow(height / 100, 2);
        } else {
            // 703 x weight (lbs) / [height (in)]^2
            calculatedBmi = 703 * weight / Math.pow(height, 2);
        }

        setBmi(parseFloat(calculatedBmi.toFixed(1)));

        if (calculatedBmi < 18.5) setStatus('Underweight');
        else if (calculatedBmi < 25) setStatus('Normal weight');
        else if (calculatedBmi < 30) setStatus('Overweight');
        else setStatus('Obesity');
    };

    return (
        <CalculatorLayout
            title="BMI Calculator"
            description="Calculate Body Mass Index (BMI) to know your weight category."
        >
            <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setUnit('metric')}
                        style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #cbd5e1', background: unit === 'metric' ? '#3b82f6' : '#fff', color: unit === 'metric' ? '#fff' : '#334155', cursor: 'pointer' }}
                    >
                        Metric (kg/cm)
                    </button>
                    <button
                        onClick={() => setUnit('imperial')}
                        style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #cbd5e1', background: unit === 'imperial' ? '#3b82f6' : '#fff', color: unit === 'imperial' ? '#fff' : '#334155', cursor: 'pointer' }}
                    >
                        Imperial (lbs/in)
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={e => setWeight(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Height {unit === 'metric' ? '(cm)' : '(in)'}
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={e => setHeight(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>

                <button
                    onClick={calculate}
                    style={{ width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginBottom: '2rem' }}
                >
                    Calculate BMI
                </button>

                {bmi !== null && (
                    <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                        <span style={{ color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your BMI</span>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#15803d', margin: '0.5rem 0' }}>
                            {bmi}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#14532d' }}>
                            {status}
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}

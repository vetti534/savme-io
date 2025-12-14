'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './CurrencyConverter.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
];

export default function CurrencyConverter() {
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState<string>('USD');
    const [toCurrency, setToCurrency] = useState<string>('INR');
    const [result, setResult] = useState<number | null>(null);
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchRate = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using the user-provided API endpoint
            const response = await fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
            const data = await response.json();

            if (data.success || data.result !== undefined) {
                // Some versions of this API return { success: true, result: 84.5 } 
                // Others return { info: { rate: ... }, result: ... }
                const convertedAmount = data.result;
                const currentRate = data.info?.rate || (convertedAmount / amount);

                setResult(convertedAmount);
                setRate(currentRate);
                setLastUpdated(new Date().toLocaleTimeString());
            } else {
                // Fallback if the user-provided API fails or requires a key they didn't provide
                // Trying a fallback open API just in case
                console.warn('Primary API failed, trying fallback...');
                const fallbackRes = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
                const fallbackData = await fallbackRes.json();

                if (fallbackData.rates) {
                    setResult(fallbackData.rates[toCurrency]);
                    setRate(fallbackData.rates[toCurrency] / amount);
                    setLastUpdated(new Date().toLocaleTimeString());
                } else {
                    throw new Error('Conversion failed');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Could not fetch rates. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (amount > 0) fetchRate();
        }, 500); // Debounce
        return () => clearTimeout(timer);
    }, [amount, fromCurrency, toCurrency]);

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    // Mock chart data for visualization (Real historical data requires paid API usually)
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: `${fromCurrency} to ${toCurrency} (Trend)`,
                data: rate ? [rate * 0.98, rate * 0.99, rate * 0.985, rate * 1.01, rate * 1.005, rate] : [],
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return (
        <div className={styles.container}>
            <div className={styles.converterCard}>
                <div className={styles.headerRow}>
                    <span className={styles.liveIndicator}>
                        <span className={styles.dot}></span> Live Exchange Rates
                    </span>
                    {lastUpdated && <span className={styles.timestamp}>Updated: {lastUpdated}</span>}
                </div>

                <div className={styles.inputSection}>
                    <div className={styles.inputGroup}>
                        <label>Amount</label>
                        <div className={styles.amountWrapper}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className={styles.currencyRow}>
                        <div className={styles.selectGroup}>
                            <label>From</label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                            >
                                {currencies.map(c => (
                                    <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                                ))}
                            </select>
                        </div>

                        <button className={styles.swapBtn} onClick={swapCurrencies} title="Swap Currencies">
                            ⇄
                        </button>

                        <div className={styles.selectGroup}>
                            <label>To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                            >
                                {currencies.map(c => (
                                    <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.resultSection}>
                    {loading ? (
                        <div className={styles.loading}>Updating...</div>
                    ) : error ? (
                        <div className={styles.error}>{error}</div>
                    ) : (
                        <>
                            <h2 className={styles.mainResult}>
                                {result?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className={styles.currencyCode}>{toCurrency}</span>
                            </h2>
                            <p className={styles.rateInfo}>
                                1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.chartCard}>
                <h3>Market Trend (6 Months)</h3>
                <div className={styles.chartWrapper}>
                    <Line data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
                <p className={styles.disclaimer}>
                    *Charts are simulated for demonstration. Live data requires premium API.
                </p>
            </div>
        </div>
    );
}

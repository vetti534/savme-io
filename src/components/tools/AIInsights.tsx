'use client';

import { useState } from 'react';
import styles from './AIInsights.module.css';

interface Props {
    toolName: string;
    inputData: any;
    resultData: any;
    promptType?: 'advice' | 'summary' | 'analysis';
}

export default function AIInsights({ toolName, inputData, resultData, promptType = 'advice' }: Props) {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/gemini-proxy.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toolName,
                    inputData,
                    resultData,
                    promptType
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get insights');
            }

            setInsight(data.insight);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!resultData) return null; // Don't show if no calculation done

    return (
        <div className={styles.container}>
            <div className={styles.magic}>✨</div>

            <div className={styles.header}>
                <span className={styles.icon}>🤖</span>
                <span className={styles.title}>Gemini AI Advisor</span>
            </div>

            {!insight && !error && (
                <button
                    className={styles.button}
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : 'Get Expert Insights'}
                </button>
            )}

            {error && (
                <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                    Error: {error}
                </div>
            )}

            {insight && (
                <div className={styles.content}>
                    {/* Simple formatting for bullet points */}
                    {insight.split('\n').map((line, i) => (
                        <div key={i}>
                            {line.startsWith('**') ?
                                <strong>{line.replace(/\*\*/g, '')}</strong> :
                                line.startsWith('* ') || line.startsWith('- ') ?
                                    <li style={{ listStyle: 'none' }}>• {line.substring(2)}</li> :
                                    <p>{line}</p>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

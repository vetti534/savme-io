'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tool } from '@/lib/tools';
import styles from './RecentTools.module.css';

export default function RecentTools() {
    const [recent, setRecent] = useState<Tool[]>([]);

    useEffect(() => {
        try {
            const existing = localStorage.getItem('recent_tools');
            if (existing) {
                setRecent(JSON.parse(existing));
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    if (recent.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>🕑 Recently Used</h2>
                <div className={styles.grid}>
                    {recent.slice(0, 4).map(tool => ( // Show top 4
                        <Link key={tool.id} href={`/tools/${tool.slug}`} className={styles.card}>
                            <div className={styles.icon}>{tool.icon}</div>
                            <div className={styles.content}>
                                <h3 className={styles.name}>{tool.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

import Link from 'next/link';
import { tools } from '@/lib/tools';
import styles from './PopularTools.module.css';

// Exact 9 tools requested
const POPULAR_IDS = [
    'compress-pdf', 'pdf-to-word', 'jpg-to-png',
    'bg-remove', 'emi-calculator', 'gst-calculator',
    'sip-calculator', 'merge-pdf', 'image-resizer'
];

export default function PopularTools() {
    const popularTools = POPULAR_IDS.map(id => tools.find(t => t.id === id)).filter(Boolean);

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Popular Tools</h2>
                <div className={styles.grid}>
                    {popularTools.map((tool: any) => (
                        <Link key={tool.id} href={`/tools/${tool.slug}`} className={styles.card}>
                            <div className={styles.icon}>{tool.icon}</div>
                            <h3 className={styles.name}>{tool.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

import Link from 'next/link';
import { tools } from '@/lib/tools';
import styles from './MiniToolGrid.module.css';

interface MiniToolGridProps {
    title: string;
    toolIds: string[];
    viewAllLink: string;
}

export default function MiniToolGrid({ title, toolIds, viewAllLink }: MiniToolGridProps) {
    const gridTools = toolIds.map(id => tools.find(t => t.id === id)).filter(Boolean);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <Link href={viewAllLink} className={styles.viewAll}>
                        See All {title.replace(' Tools', '')} Tools →
                    </Link>
                </div>

                <div className={styles.grid}>
                    {gridTools.map((tool: any) => (
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

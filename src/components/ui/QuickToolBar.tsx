import Link from 'next/link';
import { Tool } from '@/lib/tools';
import styles from './QuickToolBar.module.css';

interface QuickToolBarProps {
    title: string;
    icon?: string;
    tools: Tool[];
}

export default function QuickToolBar({ title, icon, tools }: QuickToolBarProps) {
    if (!tools || tools.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.label}>
                {icon && <span>{icon}</span>} {title}
            </div>
            <div className={styles.scrollArea}>
                {tools.map(tool => (
                    <Link key={tool.id} href={`/tools/${tool.slug}`} className={styles.pill}>
                        <span className={styles.icon}>{tool.icon}</span>
                        <span className={styles.name}>{tool.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

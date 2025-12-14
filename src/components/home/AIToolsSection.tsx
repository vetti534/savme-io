import Link from 'next/link';
import styles from './AIToolsSection.module.css';

const AI_TOOLS = [
    { name: 'AI PDF Summarizer', icon: '🧠', link: '#' },
    { name: 'AI Calculator Advisor', icon: '🤖', link: '#' },
    { name: 'AI Photo Enhancer', icon: '✨', link: '#' },
    { name: 'AI Invoice Generator', icon: '🧾', link: '#' },
    { name: 'AI SEO Text Writer', icon: '✍️', link: '#' }
];

export default function AIToolsSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>AI Tools to Make Your Work Smarter</h2>
                <div className={styles.carousel}>
                    {AI_TOOLS.map((tool, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>{tool.icon}</div>
                            <h3 className={styles.name}>{tool.name}</h3>
                            <span className={styles.badge}>PRO</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

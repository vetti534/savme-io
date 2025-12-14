import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>
                    All Tools You Need — <span className={styles.highlight}>In One Place.</span>
                </h1>
                <p className={styles.subtitle}>
                    PDF • Calculators • Images • AI Tools <br />
                    Fast, Free & Powerful Tools for Everyone. No Login Required.
                </p>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search 500+ Tools..."
                        className={styles.searchBar}
                    />
                    <button className={styles.searchButton}>🔍</button>
                </div>

                <div className={styles.quickLinks}>
                    <Link href="/pdf-tools" className={styles.pill}>PDF Tools</Link>
                    <Link href="/financial-calculators" className={styles.pill}>Calculators</Link>
                    <Link href="/image-tools" className={styles.pill}>Image Tools</Link>
                </div>
            </div>
        </section>
    );
}

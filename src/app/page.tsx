import Link from 'next/link';
import RecentTools from '@/components/home/RecentTools';
import TrendingTools from '@/components/home/TrendingTools';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      {/* 1. Simple Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>SavMe.io</h1>
          <p className={styles.heroSubtitle}>
            Professional online tools for everyone. Free, fast, and secure.
          </p>
          {/* Search Component should ideally be here if not in Header, but keeping simple for now */}
        </div>
      </section>

      {/* 2. Trending Tools Section (ONLY this as requested) */}
      <TrendingTools />

    </div>
  );
}

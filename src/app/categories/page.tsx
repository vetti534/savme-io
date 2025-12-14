import { categories } from '@/lib/tools';
import Link from 'next/link';
import styles from '../page.module.css';

export const metadata = {
    title: 'All Categories - SavMe.io',
    description: 'Browse all available tool categories on SavMe.io',
};

export default function CategoriesIndex() {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className={styles.sectionTitle}>Tool Categories</h1>
            <div className={styles.grid}>
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/categories/${cat.id}`} className={styles.card}>
                        <div className={styles.icon}>{cat.icon}</div>
                        <h3 className={styles.cardTitle}>{cat.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}

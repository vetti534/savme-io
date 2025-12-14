import Link from 'next/link';
import { tools } from '@/lib/tools';
import styles from './page.module.css';

// Manually selecting trending tools for now
const TRENDING_SLUGS = [
    'merge-pdf',
    'emi-calculator',
    'gst-calculator',
    'image-resizer',
    'sip-calculator',
    'pdf-to-word'
];

export const metadata = {
    title: 'All Tools Sitemap - SavMe.io',
    description: 'Complete directory of all tools available on SavMe.io.',
};

export default function AllToolsPage() {
    const trendingTools = tools.filter(t => TRENDING_SLUGS.includes(t.slug));

    // Group tools by Category -> SubCategory
    const toolsByCategory = tools.reduce((acc, tool) => {
        const cat = tool.category;
        const subCat = tool.subCategory || 'General';

        if (!acc[cat]) acc[cat] = {};
        if (!acc[cat][subCat]) acc[cat][subCat] = [];

        acc[cat][subCat].push(tool);
        return acc;
    }, {} as Record<string, Record<string, typeof tools>>);

    const getCategoryName = (cat: string) => {
        if (cat === 'pdf-tools') return 'PDF Tools';
        if (cat === 'calculators') return 'Calculators';
        if (cat === 'writing-tools') return 'Writing Tools';
        if (cat === 'image-tools') return 'Image Tools';
        return cat.replace('-', ' ').toUpperCase();
    };

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>All Tools</h1>
                <p className={styles.subtitle}>Complete List of Online Tools</p>
            </section>

            {/* Trending Section - Quick Access Grid */}
            <section className={styles.trendingSection}>
                <h2 className={styles.sectionHeader}>🔥 Trending Now</h2>
                <div className={styles.trendingGrid}>
                    {trendingTools.map(tool => (
                        <Link key={tool.id} href={`/tools/${tool.slug}`} className={styles.trendingChip}>
                            <span className={styles.trendIcon}>{tool.icon}</span> {tool.name}
                        </Link>
                    ))}
                </div>
            </section>

            <div className={styles.divider}></div>

            {/* Sitemap Style Layout */}
            <div className={styles.sitemapWrapper}>
                {Object.entries(toolsByCategory).map(([catId, subCats]) => (
                    <div key={catId} className={styles.categoryBlock}>
                        <h2 className={styles.catTitle}>{getCategoryName(catId)}</h2>

                        <div className={styles.subCatGrid}>
                            {Object.entries(subCats).map(([subCatName, subCatTools]) => (
                                <div key={subCatName} className={styles.subCatColumn}>
                                    <h3 className={styles.subCatTitle}>{subCatName}</h3>
                                    <ul className={styles.linkList}>
                                        {subCatTools.map(tool => (
                                            <li key={tool.id}>
                                                <Link href={`/tools/${tool.slug}`} className={styles.textLink}>
                                                    {tool.icon} {tool.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

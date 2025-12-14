import { tools, categories } from '@/lib/tools';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../../page.module.css';

interface Props {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        category: category.id,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { category: categoryId } = await params;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} - SavMe.io`,
        description: `Free online ${category.name.toLowerCase()} including ${tools.filter(t => t.category === categoryId).slice(0, 3).map(t => t.name).join(', ')} and more.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category: categoryId } = await params;
    const category = categories.find((c) => c.id === categoryId);

    if (!category) {
        notFound();
    }

    const categoryTools = tools.filter((t) => t.category === categoryId);

    // Group tools by subCategory
    const groupedTools: Record<string, typeof tools> = {};
    categoryTools.forEach((tool) => {
        const sub = tool.subCategory || 'Other';
        if (!groupedTools[sub]) {
            groupedTools[sub] = [];
        }
        groupedTools[sub].push(tool);
    });

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className={styles.sectionTitle}>{category.name}</h1>

            {Object.entries(groupedTools).map(([subCategory, tools]) => (
                <div key={subCategory} style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        color: '#2c3e50',
                        borderBottom: '2px solid #e53935',
                        display: 'inline-block',
                        paddingBottom: '0.5rem'
                    }}>
                        {subCategory}
                    </h2>
                    <div className={styles.grid}>
                        {tools.map((tool) => (
                            <Link key={tool.id} href={`/tools/${tool.slug}`} className={styles.card}>
                                <div className={styles.icon}>{tool.icon}</div>
                                <h3 className={styles.cardTitle}>{tool.name}</h3>
                                <p className={styles.cardDesc}>{tool.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {categoryTools.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--muted-foreground)' }}>
                    No tools found in this category yet.
                </p>
            )}
        </div>
    );
}

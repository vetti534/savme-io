'use client';

import Link from 'next/link';
import { tools } from '@/lib/tools';
import styles from './ImageHub.module.css';
import QuickToolBar from '../../ui/QuickToolBar';

// Popular Image Tools
const POPULAR_IMAGE_TOOLS = ['image-resizer', 'bg-remove', 'jpg-to-png', 'compress-image', 'heic-to-jpg'];

export default function ImageHub() {
    // Filter for all Image tools
    const allImageTools = tools.filter(t => t.category === 'image-tools');

    // Quick Access Tools
    const quickAccessTools = tools.filter(t => POPULAR_IMAGE_TOOLS.includes(t.id));

    // defined Super Groups and their SubCategories
    const sections = [
        {
            title: 'PHOTO EDITOR',
            subCategories: ['Editing', 'Filters', 'Drawing']
        },
        {
            title: 'IMAGE CONVERTERS',
            subCategories: ['Basic Conversions', 'Heavy Processing']
        },
        {
            title: 'AI ENHANCER TOOLS',
            subCategories: ['AI / ML Powered']
        },
        {
            title: 'OPTIMIZE & UTILITIES',
            subCategories: ['Optimization', 'Utilities']
        }
    ];

    // Helper to get tools for a subcategory list
    const getToolsBySubCategories = (subCats: string[]) => {
        return allImageTools.filter(t => t.subCategory && subCats.includes(t.subCategory));
    };

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Image Tools</h1>
                <p className={styles.subtitle}>
                    Free online tools to edit, convert, and optimize images. Simple, fast, and free!
                </p>
            </div>

            {/* Quick Access Bar */}
            <div className="container" style={{ marginBottom: '2rem' }}>
                <QuickToolBar
                    title="Popular Image Tools"
                    icon="🖼️"
                    tools={quickAccessTools}
                />
            </div>

            <div className={styles.contentWrapper}>
                {sections.map((section, index) => {
                    const sectionTools = getToolsBySubCategories(section.subCategories);
                    if (sectionTools.length === 0) return null;

                    return (
                        <div key={index} className={styles.superSection}>
                            <h2 className={styles.superSectionTitle}>{section.title}</h2>
                            <div className={styles.sitemapGrid}>
                                <div className={styles.categoryBlock}>
                                    <ul className={styles.linkList}>
                                        {sectionTools.map(tool => (
                                            <li key={tool.id}>
                                                <Link href={`/tools/${tool.slug}`} className={styles.textLink}>
                                                    {tool.icon} {tool.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

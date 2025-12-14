'use client';

import Link from 'next/link';
import { tools } from '@/lib/tools';
import styles from './PdfHub.module.css';
import QuickToolBar from '../../ui/QuickToolBar';

// Popular PDF Tools for Quick Access
const POPULAR_PDF_TOOLS = ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'split-pdf', 'word-to-pdf'];

export default function PdfHub() {
    // Filter for all PDF tools
    const allPdfTools = tools.filter(t => t.category === 'pdf-tools');

    // Quick Access Tools
    const quickAccessTools = tools.filter(t => POPULAR_PDF_TOOLS.includes(t.id));

    // defined Super Groups and their SubCategories matches the image
    const sections = [
        {
            title: 'ORGANIZE & OPTIMIZE',
            subCategories: ['Organize PDF', 'Optimize PDF']
        },
        {
            title: 'CONVERT PDF',
            subCategories: ['Convert to PDF', 'Convert from PDF']
        },
        {
            title: 'EDIT PDF',
            subCategories: ['Edit PDF']
        },
        {
            title: 'PDF SECURITY',
            subCategories: ['PDF Security']
        }
    ];

    // Helper to get tools for a subcategory list
    const getToolsBySubCategories = (subCats: string[]) => {
        return allPdfTools.filter(t => t.subCategory && subCats.includes(t.subCategory));
    };

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>PDF Tools</h1>
                <p className={styles.subtitle}>
                    Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!
                </p>
            </div>

            {/* Quick Access Bar */}
            <div className="container" style={{ marginBottom: '2rem' }}>
                <QuickToolBar
                    title="Most Popular PDF Tools"
                    icon="⭐"
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

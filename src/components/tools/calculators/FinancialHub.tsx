'use client';

import Link from 'next/link';
import { tools } from '@/lib/tools';
import styles from './FinancialHub.module.css';
import QuickToolBar from '../../ui/QuickToolBar';

// Popular Calculators
const POPULAR_CALCS = ['emi-calculator', 'gst-calculator', 'sip-calculator', 'bmi-calculator', 'income-tax-calculator'];

export default function FinancialHub() {
    // Filter for all calculators
    const allCalculators = tools.filter(t => t.category === 'calculators');

    // Quick Access Tools
    const quickAccessTools = tools.filter(t => POPULAR_CALCS.includes(t.id));

    // defined Super Groups and their SubCategories
    const sections = [
        {
            title: 'Finance Calculators',
            subCategories: [
                'Loan & Mortgage',
                'Investment',
                'Tax & Salary',
                'Retirement',
                'Debt',
                'Business',
                'Economics',
                'Personal Finance'
            ]
        },
        {
            title: 'Fitness and Health Calculators',
            subCategories: [
                'Diet & Nutrition',
                'Fitness & Activity',
                'Weight & BMI',
                'Women\'s Health',
                'General Health',
                'Fitness & Health' // Catch-all
            ]
        },
        {
            title: 'Math Calculators',
            subCategories: [
                'Basic Calculators',
                'Geometry',
                'Algebra',
                'Statistics',
                'Numbers',
                'Math' // Catch-all for any remaining
            ]
        },
        {
            title: 'Daily Utilities calculators',
            subCategories: [
                'Time & Date',
                'Construction',
                'Science & Engineering',
                'Everyday Life',
                'Technology',
                'Weather',
                'Other',
                'General' // catch-all
            ]
        },
        {
            title: 'Calculators for Your Site',
            subCategories: [
                'Calculators for Your Site'
            ]
        }
    ];

    // Helper to get tools for a subcategory
    const getToolsBySubCategory = (subCat: string) => {
        return allCalculators.filter(t => t.subCategory === subCat);
    };

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Calculators</h1>
                <p className={styles.subtitle}>
                    Free online calculators for Finance, Health, Fitness, Math, and more.
                </p>
            </div>

            {/* Quick Access Bar */}
            <div className="container" style={{ marginBottom: '2rem' }}>
                <QuickToolBar
                    title="Popular Calculators"
                    icon="🧮"
                    tools={quickAccessTools}
                />
            </div>

            <div className={styles.contentWrapper}>
                {sections.map(section => {
                    // Check if section has any tools (to avoid empty sections)
                    const hasTools = section.subCategories.some(sub => getToolsBySubCategory(sub).length > 0);
                    if (!hasTools) return null;

                    return (
                        <div key={section.title} className={styles.superSection}>
                            <h2 className={styles.superSectionTitle}>{section.title}</h2>

                            <div className={styles.sitemapGrid}>
                                {(() => {
                                    // Aggregate all tools for this section to render a single flat list
                                    const rawSectionTools = section.subCategories.flatMap(sub => getToolsBySubCategory(sub));

                                    // Deduplicate tools to prevent "same key" errors
                                    const sectionTools = Array.from(new Map(rawSectionTools.map(tool => [tool.id, tool])).values());

                                    if (sectionTools.length === 0) return null;

                                    return (
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
                                    );
                                })()}
                            </div>
                        </div>
                    );
                })}


            </div>
        </div>
    );
}

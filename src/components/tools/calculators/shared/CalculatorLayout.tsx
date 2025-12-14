'use client';

import React from 'react';
import styles from './CalculatorLayout.module.css';

interface CalculatorLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

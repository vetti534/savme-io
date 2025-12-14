'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tools, Tool } from '@/lib/tools';
import styles from './Search.module.css';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Tool[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 0) {
            const filtered = tools.filter(tool =>
                tool.name.toLowerCase().includes(value.toLowerCase()) ||
                tool.description.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered.slice(0, 5)); // Limit to 5 results
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <div className={styles.inputContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Search tools..."
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className={styles.input}
                />
                {query && (
                    <button onClick={clearSearch} className={styles.clearBtn}>×</button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className={styles.dropdown}>
                    {results.map((tool) => (
                        <Link
                            key={tool.id}
                            href={`/tools/${tool.slug}`}
                            className={styles.item}
                            onClick={clearSearch}
                        >
                            <span className={styles.itemIcon}>{tool.icon}</span>
                            <div className={styles.itemContent}>
                                <span className={styles.itemName}>{tool.name}</span>
                                <span className={styles.itemCategory}>{tool.category}</span>
                            </div>
                        </Link>
                    ))}
                    <Link href="/all-tools" className={styles.viewAll} onClick={clearSearch}>
                        View all results
                    </Link>
                </div>
            )}

            {isOpen && query.length > 0 && results.length === 0 && (
                <div className={styles.dropdown}>
                    <div className={styles.noResult}>No tools found.</div>
                </div>
            )}
        </div>
    );
}

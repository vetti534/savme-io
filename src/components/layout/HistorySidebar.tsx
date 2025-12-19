'use client';

import { useHistory } from '@/context/HistoryContext';
import styles from './HistorySidebar.module.css';
import { FaTimes, FaTrash, FaHistory, FaClock } from 'react-icons/fa';
import Link from 'next/link';

export default function HistorySidebar() {
    const { history, isOpen, setIsOpen, clearHistory } = useHistory();

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2><FaHistory className="text-red-500" /> Recent History</h2>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.content}>
                    {history.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FaClock size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No history yet.</p>
                            <p className="text-sm">Use tools to see your recent activities here.</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <Link
                                href={item.url}
                                key={item.id}
                                className={styles.historyItem}
                                onClick={() => setIsOpen(false)} // Close on navigate
                            >
                                <div className={styles.itemHeader}>
                                    <span className={styles.toolName}>{item.toolName}</span>
                                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={styles.itemBody}>
                                    {item.summary}
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {history.length > 0 && (
                    <div className={styles.footer}>
                        <button className={styles.clearBtn} onClick={clearHistory}>
                            <FaTrash className="inline mr-2" /> Clear History
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

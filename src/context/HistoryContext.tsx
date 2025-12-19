'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface HistoryItem {
    id: string;
    toolName: string;
    summary: string; // e.g., "5 + 5 = 10" or "Merged 3 PDFs"
    timestamp: number;
    url: string;
    icon?: string; // Optional icon class or identifier
}

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
    isOpen: boolean;
    toggleHistory: () => void;
    setIsOpen: (open: boolean) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('savme_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Save to LocalStorage whenever history changes
    useEffect(() => {
        localStorage.setItem('savme_history', JSON.stringify(history));
    }, [history]);

    const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        // Prepend new item, limit to last 50 items
        setHistory(prev => [newItem, ...prev].slice(0, 50));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const toggleHistory = () => setIsOpen(prev => !prev);

    return (
        <HistoryContext.Provider value={{
            history,
            addToHistory,
            clearHistory,
            isOpen,
            toggleHistory,
            setIsOpen
        }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}

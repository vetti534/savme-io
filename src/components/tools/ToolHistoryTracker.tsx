'use client';

import { useEffect } from 'react';
import { Tool } from '@/lib/tools';

export default function ToolHistoryTracker({ tool }: { tool: Tool }) {
    useEffect(() => {
        try {
            const existing = localStorage.getItem('recent_tools');
            let history: Tool[] = existing ? JSON.parse(existing) : [];

            // Remove existing entry for this tool to avoid duplicates
            history = history.filter(h => h.id !== tool.id);

            // Add to front
            history.unshift(tool);

            // Keep max 10
            if (history.length > 10) {
                history = history.slice(0, 10);
            }

            localStorage.setItem('recent_tools', JSON.stringify(history));
        } catch (e) {
            console.error('Failed to save history', e);
        }
    }, [tool]);

    return null; // Logic only
}

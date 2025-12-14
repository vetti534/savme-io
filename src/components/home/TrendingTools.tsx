import Link from 'next/link';
import { tools } from '@/lib/tools';
import QuickToolBar from '../ui/QuickToolBar';

// Curated list of popular tool IDs
const POPULAR_TOOL_IDS = [
    'merge-pdf',
    'image-resizer',
    'jpg-to-png',
    'gst-calculator',
    'bmi-calculator',
    'word-to-pdf',
    'compress-pdf',
    'age-calculator'
];

export default function TrendingTools() {
    // Filter tools that match the popular list
    const trendingTools = tools.filter(t => POPULAR_TOOL_IDS.includes(t.id));

    return (
        <section style={{ padding: '1rem 0' }}>
            <div className="container">
                <QuickToolBar
                    title="Trending Now"
                    icon="🔥"
                    tools={trendingTools}
                />
            </div>
        </section>
    );
}

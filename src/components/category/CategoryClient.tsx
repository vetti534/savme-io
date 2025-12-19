'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import AdSlot from '@/components/ads/AdSlot';

export default function CategoryClient({ category, tools }: { category: any, tools: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tools based on search query
    const filteredTools = useMemo(() => {
        if (!searchQuery.trim()) return tools;
        return tools.filter(tool =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tools, searchQuery]);

    // Group tools by subCategory AFTER filtering
    const groupedTools = useMemo(() => {
        const groups: Record<string, typeof tools> = {};
        filteredTools.forEach((tool) => {
            const sub = tool.subCategory || 'General Tools';
            if (!groups[sub]) groups[sub] = [];
            groups[sub].push(tool);
        });
        return groups;
    }, [filteredTools]);

    // Smart Ad Logic: Place Ad at Top if tools exist, otherwise Bottom
    // Actually, prompt says: "If there is empty space between section header & first grid, place the ad there."
    // So we will place it after the Search/Title section.

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-16">

            {/* COMPACT HEADER & SEARCH */}
            <div className="bg-white border-b border-gray-100 pt-6 pb-6 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                        {category.name}
                    </h1>

                    {/* Compact Search Bar */}
                    <div className="max-w-lg mx-auto relative group">
                        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full hover:border-red-200 transition-colors h-10 px-4">
                            <FaSearch className="text-gray-400 mr-2 text-sm" />
                            <input
                                type="text"
                                placeholder={`Search in ${category.name}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SINGLE SMART AD SLOT */}
            <div className="container mx-auto px-4 mt-4 mb-2">
                <AdSlot label="Sponsored" />
            </div>

            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 py-6">

                {filteredTools.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">No tools found matching "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="mt-2 text-red-600 text-sm font-medium hover:underline">Clear Search</button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedTools).map(([subCat, subCatTools]) => (
                            <div key={subCat}>
                                <div className="flex items-center gap-3 mb-4">
                                    <h2 className="text-lg font-bold text-gray-800">{subCat}</h2>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>

                                {/* DENSE GRID: 1(mobile) 2(tablet) 3(laptop) 4(desktop) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {subCatTools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ SECTION (Compact) */}
                <div className="mt-16 max-w-3xl mx-auto border-t border-gray-100 pt-10">
                    <h2 className="text-xl font-bold text-center mb-6 text-gray-900">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        <FAQItem q={`Are these ${category.name} free?`} a="Yes, completely free with no limits." />
                        <FAQItem q="Do I need to install software?" a="No, all tools run in your browser." />
                        <FAQItem q="Is my data safe?" a="We delete your files automatically after 1 hour." />
                    </div>
                </div>

            </div>
        </div>
    );
}

function ToolCard({ tool }: { tool: any }) {
    return (
        <Link
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all group h-full"
        >
            <div className="text-xl bg-gray-50 w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-md group-hover:scale-105 transition-transform text-gray-700">
                {tool.icon}
            </div>
            <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-base mb-0.5 truncate group-hover:text-red-600 transition-colors">
                    {tool.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                    {tool.description}
                </p>
            </div>
        </Link>
    );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <details className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-3 px-4 text-sm text-gray-900 hover:bg-gray-50 transition-colors list-none select-none">
                <span>{q}</span>
                <span className="transition-transform group-open:rotate-180 text-gray-400">
                    <FaChevronDown size={12} />
                </span>
            </summary>
            <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                <div className="pt-2">{a}</div>
            </div>
        </details>
    );
}

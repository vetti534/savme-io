'use client';

import React from 'react';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { Tool } from '@/lib/tools';

interface RelatedToolsProps {
    currentToolSlug: string;
    category?: string;
    variant?: 'card' | 'clean';
    toolSlugs?: string[]; // Optional specific tools
}

export default function RelatedTools({ currentToolSlug, category = 'calculators', variant = 'card', toolSlugs }: RelatedToolsProps) {
    // Fill tools
    let related = [];

    if (toolSlugs && toolSlugs.length > 0) {
        // If specific slugs provided, find them
        related = tools.filter(t => toolSlugs.includes(t.slug));
    } else {
        // Otherwise use category
        related = tools
            .filter(t => t.category === category && t.slug !== currentToolSlug)
            .slice(0, 10);
    }

    const containerClasses = variant === 'card'
        ? "mt-8 bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
        : "mt-8"; // minimalist for clean mode

    return (
        <div className={containerClasses}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Other Calculators
            </h3>
            <div className="flex flex-col gap-2">
                {related.map(tool => {
                    // Aggressive Shortening: Remove "Calculators", "Calculator", "Converter", "Tool"
                    // And trim pipe parts.
                    const rawName = tool.name.split('|')[0].trim();
                    const shortName = rawName
                        .replace(/Calculators?/gi, '')
                        .replace(/Converters?/gi, '')
                        .replace(/Generators?/gi, '')
                        .replace(/Tool/gi, '')
                        .trim();

                    return (
                        <Link
                            key={tool.id}
                            href={`/tools/${tool.slug}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                        >
                            {shortName || rawName}
                        </Link>
                    )
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/" className="text-xs font-bold text-gray-500 uppercase hover:text-gray-900">
                    View All Tools &rarr;
                </Link>
            </div>
        </div>
    );
}

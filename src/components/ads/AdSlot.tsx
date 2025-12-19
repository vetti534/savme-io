import React from 'react';

interface AdSlotProps {
    className?: string;
    label?: string;
    variant?: 'default' | 'clean';
}

export default function AdSlot({ className = "", label = "Advertisement", variant = 'default' }: AdSlotProps) {
    const containerClasses = variant === 'clean'
        ? "relative w-full max-w-[728px] min-h-[120px] flex flex-col items-center justify-center text-center overflow-hidden group"
        : "relative w-full max-w-[728px] min-h-[120px] bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center overflow-hidden group";

    return (
        <div className={`w-full flex justify-center py-2 ${className}`}>
            <div className={containerClasses}>
                {/* Placeholder Visuals */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1 relative z-10">
                    {label}
                </span>
                <span className="text-sm text-gray-300 relative z-10">
                    Smart Ad Placeholder
                </span>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-50 transition-colors rounded-xl pointer-events-none"></div>
            </div>
        </div>
    );
}

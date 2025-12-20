'use client';

import React, { useState } from 'react';
import { FaFilePdf, FaRobot, FaInfoCircle, FaCheckCircle, FaLightbulb } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateToolInsight } from '@/actions/tools/ai-insight';

interface ToolResultProps {
    title: string;
    subTitle?: string;
    details?: string;
    explanation?: string[]; // Step-by-step explanation
    toolName: string; // Used for PDF Header
    aiPrompt?: string; // Prompt to send to AI
    initialAiTip?: string; // Optional pre-loaded tip
    extraStats?: { label: string; value: string }[]; // Optional grid of statistics
    pdfTable?: { head: string[][]; body: (string | number)[][] }; // Optional table for PDF
    actionsPosition?: 'top' | 'bottom'; // Position of action buttons
}

export default function ToolResult({
    title,
    subTitle,
    details,
    explanation = [],
    toolName,
    aiPrompt,
    initialAiTip = '',
    extraStats,
    pdfTable,
    actionsPosition = 'top'
}: ToolResultProps) {
    const [aiTip, setAiTip] = useState<string>(initialAiTip);
    const [loadingAi, setLoadingAi] = useState(false);

    // --- PDF DOWNLOAD ---
    const downloadPDF = () => {
        const doc = new jsPDF();

        // Helper to replace symbols with codes for PDF compatibility
        const cleanForPdf = (text: string) => {
            return text
                .replace(/₹/g, 'INR ')
                .replace(/\$/g, 'USD ')
                .replace(/€/g, 'EUR ')
                .replace(/£/g, 'GBP ')
                .replace(/A\$/g, 'AUD ')
                .replace(/C\$/g, 'CAD ')
                .replace(/¥/g, 'CNY ')
                .replace(/د.إ/g, 'AED ')
                .replace(/[^\x00-\x7F]/g, ''); // Remove other non-ASCII chars as fallback
        };

        // 1. Header
        doc.setFillColor(37, 99, 235); // Blue color (Tailwind blue-600)
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('SAVME.IO', 10, 13);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(toolName, 180, 13, { align: 'right' });

        let yPos = 35;

        // 2. Main Result
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text('Result:', 14, yPos);
        yPos += 7;
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text(cleanForPdf(title), 14, yPos);
        yPos += 10;

        if (subTitle) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(cleanForPdf(subTitle), 14, yPos);
            yPos += 10;
        }

        if (details) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(cleanForPdf(details), 14, yPos);
            yPos += 15;
        }

        // 2b. Extra Stats in PDF
        if (extraStats && extraStats.length > 0) {
            yPos += 5;
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);

            // Simple 2-column layout for stats in PDF
            extraStats.forEach((stat, i) => {
                const col = i % 2 === 0 ? 14 : 110;
                if (i > 0 && i % 2 === 0) yPos += 10;

                doc.setFont('helvetica', 'bold');
                doc.text(cleanForPdf(stat.label) + ':', col, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(cleanForPdf(stat.value), col + 35, yPos);
            });
            yPos += 15;
        }

        // 3. Explanation Table
        if (explanation.length > 0) {
            yPos += 5;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Calculation Steps & Explanation', 14, yPos);
            yPos += 5;

            const tableBody = explanation.map((step) => {
                // Remove HTML tags for PDF text
                let cleanStep = step.replace(/<[^>]*>?/gm, '');
                cleanStep = cleanForPdf(cleanStep);
                return [cleanStep];
            });

            autoTable(doc, {
                startY: yPos,
                head: [['Step Details']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [50, 50, 50] },
                styles: { fontSize: 10, cellPadding: 3 },
            });

            // Update yPos based on table end
            // @ts-ignore
            yPos = doc.lastAutoTable.finalY + 15;
        }

        // 4. Custom Data Table (e.g. Loan Schedule)
        if (pdfTable) {
            const pageHeight = doc.internal.pageSize.height;
            if (yPos > pageHeight - 40) { doc.addPage(); yPos = 20; }

            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.text('Detailed Schedule', 14, yPos);
            yPos += 5;

            // Clean table data
            const cleanBody = pdfTable.body.map(row => row.map(cell => cleanForPdf(String(cell))));
            const cleanHead = pdfTable.head.map(row => row.map(cell => cleanForPdf(String(cell))));

            autoTable(doc, {
                startY: yPos,
                head: cleanHead,
                body: cleanBody,
                theme: 'striped',
                headStyles: { fillColor: [37, 99, 235] },
                styles: { fontSize: 9, cellPadding: 2 },
            });
        }

        // 5. Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by SAVME.IO - Free Online Tools & Calculators', 105, pageHeight - 10, { align: 'center' });

        doc.save(`${toolName.toLowerCase().replace(/\s+/g, '-')}-result.pdf`);
    };

    // --- AI INSIGHT ---
    const handleAiHelp = async () => {
        if (!aiPrompt) return;
        setLoadingAi(true);
        try {
            const tip = await generateToolInsight(aiPrompt, toolName);
            setAiTip(tip);
        } catch (error) {
            setAiTip("Could not fetch AI insight. Please try again.");
        } finally {
            setLoadingAi(false);
        }
    };

    const renderActions = () => (
        <div className={`flex justify-center gap-2 ${actionsPosition === 'top' ? 'mb-6' : 'mt-8 border-t border-gray-100 pt-6'}`}>
            <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                title="Download detailed PDF report"
            >
                <FaFilePdf className="text-red-500 group-hover:scale-110 transition-transform text-lg" />
                <span>Download PDF</span>
            </button>

            {aiPrompt && (
                <button
                    onClick={handleAiHelp}
                    disabled={loadingAi || !!aiTip}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm text-white
                        ${loadingAi
                            ? 'bg-purple-400 cursor-wait'
                            : !!aiTip
                                ? 'bg-purple-600 opacity-90 cursor-default'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                    title="Get AI analysis"
                >
                    <FaRobot className={`text-lg ${loadingAi ? 'animate-spin' : ''}`} />
                    <span>{loadingAi ? 'Asking AI...' : !!aiTip ? 'AI Insight Ready' : 'Ask AI'}</span>
                </button>
            )}
        </div>
    );

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            {/* Header / Main Result Area */}
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">

                {actionsPosition === 'top' && renderActions()}

                <div className="flex flex-col gap-4 text-center">
                    <div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Result</h3>
                        <div className="text-4xl md:text-5xl font-extrabold text-black break-words leading-tight tracking-tight">
                            {title}
                        </div>
                        {subTitle && <div className="text-lg text-blue-600 font-semibold mt-2">{subTitle}</div>}
                        {details && <div className="text-sm text-gray-500 mt-1">{details}</div>}

                        {extraStats && extraStats.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-8 items-center justify-center">
                                {extraStats.map((stat, idx) => (
                                    <div key={idx} className="flex flex-col min-w-max">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</span>
                                        <span className="text-xl font-bold text-gray-900 leading-tight">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {actionsPosition === 'bottom' && renderActions()}
            </div>

            {/* Explanation Section */}
            {(explanation.length > 0) && (
                <div className="p-6 md:p-8 bg-white">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                        <FaInfoCircle className="text-blue-500" />
                        How it's calculated
                    </h4>
                    <div className="space-y-3">
                        {explanation.map((step, index) => (
                            <div key={index} className="flex gap-3 text-gray-700 leading-relaxed">
                                <FaCheckCircle className="text-green-500 mt-1 shrink-0 text-sm" />
                                <div dangerouslySetInnerHTML={{ __html: step }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Insight Section */}
            {(aiTip || loadingAi) && (
                <div className="p-6 md:p-8 bg-purple-50/50 border-t border-purple-100">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-purple-900 mb-3">
                        <FaLightbulb className="text-purple-600" />
                        AI Analysis & Tips
                    </h4>
                    <div className="prose prose-purple max-w-none text-gray-800">
                        {loadingAi ? (
                            <div className="flex items-center gap-2 text-purple-700 animate-pulse">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                Generating smart insights for you...
                            </div>
                        ) : (
                            <p className="whitespace-pre-line">{aiTip}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

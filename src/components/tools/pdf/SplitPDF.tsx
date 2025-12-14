'use client';

import { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { FaUpload, FaFilePdf, FaDownload, FaSpinner, FaCheckCircle, FaTrash } from 'react-icons/fa';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
    // Use unpkg to get the worker version matching the installed pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}


export default function SplitPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [thumbnails, setThumbnails] = useState<string[]>([]); // Data URLs
    const [selectedPages, setSelectedPages] = useState<number[]>([]); // 1-based indices
    const [mode, setMode] = useState<'visual' | 'range'>('visual');
    const [rangeInput, setRangeInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

    // Upload Handler
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            if (uploadedFile.type !== 'application/pdf') {
                alert('Please upload a valid PDF file.');
                return;
            }
            setFile(uploadedFile);
            setSelectedPages([]);
            setRangeInput('');
            setThumbnails([]);

            // Start processing
            generateThumbnails(uploadedFile);
        }
    };

    // Generate Thumbnails
    const generateThumbnails = async (uploadedFile: File) => {
        setIsGeneratingThumbnails(true);
        try {
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            setPageCount(pdf.numPages);

            const thumbList: string[] = [];

            // Limit thumbnail generation for very large files to avoid crashing
            const maxThumbs = 50;
            const countToRender = Math.min(pdf.numPages, maxThumbs);

            for (let i = 1; i <= countToRender; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 }); // Low scale for thumbnail
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport } as any).promise;
                    thumbList.push(canvas.toDataURL());
                }
            }
            setThumbnails(thumbList);
        } catch (error) {
            console.error("Error generating thumbnails:", error);
            alert("Failed to load PDF preview. But you can still split by range.");
        } finally {
            setIsGeneratingThumbnails(false);
        }
    };

    // Handle Visual Selection
    const togglePageSelection = (pageIndex: number) => {
        const pageNum = pageIndex + 1;
        setSelectedPages(prev => {
            if (prev.includes(pageNum)) {
                return prev.filter(p => p !== pageNum);
            } else {
                return [...prev, pageNum].sort((a, b) => a - b);
            }
        });
    };

    // Parse Range Input (e.g., "1-3, 5")
    const parseRange = (input: string, max: number): number[] => {
        const pages = new Set<number>();
        const parts = input.split(',');

        parts.forEach(part => {
            const range = part.trim().split('-').map(Number);
            if (range.length === 1 && !isNaN(range[0])) {
                if (range[0] >= 1 && range[0] <= max) pages.add(range[0]);
            } else if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
                const start = Math.min(range[0], range[1]);
                const end = Math.max(range[0], range[1]);
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= max) pages.add(i);
                }
            }
        });
        return Array.from(pages).sort((a, b) => a - b);
    };

    // Split Action
    const handleSplit = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            let pagesToExtract: number[] = [];

            if (mode === 'visual') {
                pagesToExtract = selectedPages;
            } else {
                pagesToExtract = parseRange(rangeInput, pageCount);
            }

            if (pagesToExtract.length === 0) {
                alert('Please select at least one page to split.');
                setIsProcessing(false);
                return;
            }

            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer);

            // Create a new PDF with just the selected pages
            const newPdf = await PDFDocument.create();
            // pdf-lib uses 0-based index
            const indices = pagesToExtract.map(p => p - 1);
            const copiedPages = await newPdf.copyPages(srcPdf, indices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();

            // Download logic
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `split_${file.name.replace('.pdf', '')}_pages.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Split failed:', error);
            alert('An error occurred while splitting the PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Split Every Page to ZIP (Burst)
    const handleBurst = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const zip = new JSZip();
            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer);

            const count = srcPdf.getPageCount();

            for (let i = 0; i < count; i++) {
                const newPdf = await PDFDocument.create();
                const [page] = await newPdf.copyPages(srcPdf, [i]);
                newPdf.addPage(page);
                const pdfBytes = await newPdf.save();
                zip.file(`page_${i + 1}.pdf`, pdfBytes);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${file.name.replace('.pdf', '')}_extracted_pages.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Burst failed:', error);
            alert('An error occurred while extracting pages.');
        } finally {
            setIsProcessing(false);
        }
    }


    return (
        <div className="max-w-4xl mx-auto p-4">

            {/* 1. Upload Section */}
            {!file && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors h-64 flex flex-col items-center justify-center cursor-pointer relative">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FaUpload className="text-4xl text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">Drop PDF here</h3>
                    <p className="text-gray-500 mt-2">or click to upload</p>
                </div>
            )}

            {/* 2. Editor Section */}
            {file && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-3">
                            <FaFilePdf className="text-red-500 text-2xl" />
                            <div>
                                <p className="font-bold text-gray-800">{file.name}</p>
                                <p className="text-sm text-gray-500">{pageCount} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Remove file"
                        >
                            <FaTrash />
                        </button>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 text-sm font-bold ${mode === 'visual' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setMode('visual')}
                        >
                            Visual Selection
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-bold ${mode === 'range' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => setMode('range')}
                        >
                            Range Mode "1-5"
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">

                        {/* Loading State */}
                        {isGeneratingThumbnails && (
                            <div className="text-center py-10">
                                <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto mb-3" />
                                <p className="text-gray-500">Generating preview...</p>
                            </div>
                        )}

                        {/* Visual Mode */}
                        {!isGeneratingThumbnails && mode === 'visual' && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-600">Click to select pages to extract.</p>
                                    <div className="flex gap-2 text-sm">
                                        <button onClick={() => setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1))} className="text-blue-600 hover:underline">Select All</button>
                                        <button onClick={() => setSelectedPages([])} className="text-gray-500 hover:underline">Clear</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[500px] overflow-y-auto pr-2">
                                    {thumbnails.map((src, idx) => {
                                        const pageNum = idx + 1;
                                        const isSelected = selectedPages.includes(pageNum);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => togglePageSelection(idx)}
                                                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <img src={src} alt={`Page ${pageNum}`} className="w-full h-auto" />
                                                <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm border border-gray-200">
                                                    {isSelected && <FaCheckCircle className="text-blue-500 text-lg" />}
                                                </div>
                                                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1">
                                                    Page {pageNum}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {pageCount > thumbnails.length && (
                                        <div className="col-span-full text-center py-4 text-gray-500 italic">
                                            {pageCount - thumbnails.length} more pages not shown in preview...
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Range Mode */}
                        {mode === 'range' && (
                            <div className="py-8 text-center max-w-md mx-auto">
                                <label className="block text-gray-700 font-bold mb-2">Page Ranges</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1-5, 8, 11-13"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={rangeInput}
                                    onChange={(e) => setRangeInput(e.target.value)}
                                />
                                <p className="text-sm text-gray-500 mt-2">Enter page numbers and/or page ranges separated by commas.</p>
                            </div>
                        )}

                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {mode === 'visual' ? `${selectedPages.length} pages selected` : 'Extract by range'}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSplit}
                                disabled={isProcessing || (mode === 'visual' && selectedPages.length === 0) || (mode === 'range' && !rangeInput)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isProcessing ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                                Split selected pages
                            </button>

                            <button
                                onClick={handleBurst}
                                disabled={isProcessing || !file}
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-lg disabled:opacity-50 transition-all text-sm"
                            >
                                Extract all pages (Zip)
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Features Info (SEO Content) */}
            <div className="mt-12 prose prose-blue max-w-none text-gray-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Split PDF Files Online?</h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h4 className="font-bold text-gray-900">1. Upload your file</h4>
                        <p>Drag and drop your PDF into the box above to begin.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">2. Select Pages</h4>
                        <p>Click the page thumbnails you want to extract, or type the page range (e.g., 1-5).</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">3. Download PDF</h4>
                        <p>Click "Split PDF" to instantly download your new document with only the selected pages.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

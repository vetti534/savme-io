'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { FaUpload, FaFilePdf, FaDownload, FaSpinner, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
    // Use unpkg to get the worker version matching the installed pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export default function RemovePDFPages() {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [pagesToRemove, setPagesToRemove] = useState<number[]>([]); // 1-based indices
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            if (uploadedFile.type !== 'application/pdf') {
                alert('Please upload a valid PDF file.');
                return;
            }
            setFile(uploadedFile);
            setPagesToRemove([]);
            setThumbnails([]);
            generateThumbnails(uploadedFile);
        }
    };

    const generateThumbnails = async (uploadedFile: File) => {
        setIsGeneratingThumbnails(true);
        try {
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            setPageCount(pdf.numPages);

            const thumbList: string[] = [];
            const maxThumbs = 50;
            const countToRender = Math.min(pdf.numPages, maxThumbs);

            for (let i = 1; i <= countToRender; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
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
            alert("Failed to load preview.");
        } finally {
            setIsGeneratingThumbnails(false);
        }
    };

    const togglePageRemoval = (pageIndex: number) => {
        const pageNum = pageIndex + 1;
        setPagesToRemove(prev => {
            if (prev.includes(pageNum)) {
                return prev.filter(p => p !== pageNum);
            } else {
                return [...prev, pageNum].sort((a, b) => a - b);
            }
        });
    };

    const handleRemovePages = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            if (pagesToRemove.length === 0) {
                alert('Please select at least one page to remove.');
                setIsProcessing(false);
                return;
            }

            if (pagesToRemove.length === pageCount) {
                alert('You cannot remove all pages!');
                setIsProcessing(false);
                return;
            }

            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            // Get all indices (0-based) EXCEPT those marked for removal
            const pagesToKeep = srcPdf.getPageIndices().filter(idx => !pagesToRemove.includes(idx + 1));

            const copiedPages = await newPdf.copyPages(srcPdf, pagesToKeep);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `removed_pages_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Removal failed:', error);
            alert('An error occurred while processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">

            {/* Upload Area */}
            {!file && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors h-64 flex flex-col items-center justify-center cursor-pointer relative">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FaUpload className="text-4xl text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">Drop PDF here</h3>
                    <p className="text-gray-500 mt-2">to remove pages</p>
                </div>
            )}

            {/* Editor Area */}
            {file && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
                            className="text-gray-400 hover:text-gray-600 px-3 py-1"
                        >
                            Change File
                        </button>
                    </div>

                    <div className="p-6">
                        {isGeneratingThumbnails ? (
                            <div className="text-center py-10">
                                <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-3" />
                                <p className="text-gray-500">Loading pages...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-600">Click pages to <span className="text-red-600 font-bold">remove</span> users.</p>
                                    <div className="flex gap-2 text-sm">
                                        <button onClick={() => setPagesToRemove([])} className="text-blue-600 hover:underline">Unselect All</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto pr-2">
                                    {thumbnails.map((src, idx) => {
                                        const pageNum = idx + 1;
                                        const isRemoved = pagesToRemove.includes(pageNum);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => togglePageRemoval(idx)}
                                                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${isRemoved ? 'border-red-500 ring-2 ring-red-200 opacity-60 grayscale' : 'border-gray-200 hover:border-red-300'}`}
                                            >
                                                <img src={src} alt={`Page ${pageNum}`} className="w-full h-auto" />

                                                {/* Overlay Icon */}
                                                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isRemoved ? 'bg-red-500/20 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-black/10'}`}>
                                                    {isRemoved ? <FaTrash className="text-red-600 text-3xl drop-shadow-md" /> : <FaTrash className="text-white text-2xl drop-shadow-md" />}
                                                </div>

                                                <div className={`absolute bottom-0 inset-x-0 text-white text-xs text-center py-1 ${isRemoved ? 'bg-red-500' : 'bg-black/50'}`}>
                                                    {isRemoved ? 'REMOVED' : `Page ${pageNum}`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleRemovePages}
                            disabled={isProcessing || pagesToRemove.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            {isProcessing ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                            Remove {pagesToRemove.length} & Download PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

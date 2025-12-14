'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FaUpload, FaFilePdf, FaTrash, FaArrowUp, FaArrowDown, FaDownload, FaSpinner } from 'react-icons/fa';

export default function MergePDF() {
    const [files, setFiles] = useState<File[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Drag & Drop Upload Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
            setFiles(prev => [...prev, ...droppedFiles]);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newFiles = [...files];
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
            setFiles(newFiles);
        } else if (direction === 'down' && index < files.length - 1) {
            const newFiles = [...files];
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
            setFiles(newFiles);
        }
    };

    // Merge Logic
    const handleMerge = async () => {
        if (files.length < 2) {
            alert('Please select at least 2 PDF files to merge.');
            return;
        }

        setIsMerging(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const fileBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'savme_merged_document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('An error occurred while merging PDFs. Please try again.');
        } finally {
            setIsMerging(false);
        }
    };

    // Drag Sorting (Simple Implementation)
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSortStart = (e: React.DragEvent, index: number) => {
        dragItem.current = index;
    }

    const handleSortEnter = (e: React.DragEvent, index: number) => {
        dragOverItem.current = index;
    }

    const handleSortEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null) {
            const _files = [...files];
            const draggedItemContent = _files[dragItem.current];
            _files.splice(dragItem.current, 1);
            _files.splice(dragOverItem.current, 0, draggedItemContent);
            setFiles(_files);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    }


    return (
        <div className="max-w-4xl mx-auto p-4">

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors h-64 flex flex-col items-center justify-center cursor-pointer relative ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    id="pdf-upload"
                />
                <FaUpload className={`text-4xl mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <h3 className="text-xl font-bold text-gray-700">Drop PDFs here</h3>
                <p className="text-gray-500 mt-2">or click to upload multiple files</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-8 space-y-3">
                    <h3 className="font-bold text-gray-700 mb-2">Files to Merge ({files.length})</h3>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleSortStart(e, index)}
                            onDragEnter={(e) => handleSortEnter(e, index)}
                            onDragEnd={handleSortEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-gray-400 cursor-grab">⋮⋮</div>
                                <FaFilePdf className="text-red-500 text-xl" />
                                <div>
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => moveFile(index, 'up')}
                                    disabled={index === 0}
                                    className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                                >
                                    <FaArrowUp />
                                </button>
                                <button
                                    onClick={() => moveFile(index, 'down')}
                                    disabled={index === files.length - 1}
                                    className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                                >
                                    <FaArrowDown />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-red-500 ml-2"
                                    onClick={() => removeFile(index)}
                                    title="Remove file"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Merge Action */}
            {files.length > 0 && (
                <div className="mt-8 text-center">
                    <button
                        className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-wait"
                        onClick={handleMerge}
                        disabled={isMerging}
                    >
                        {isMerging ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                        {isMerging ? 'Merging PDFs...' : 'Merge PDF Now'}
                    </button>
                    {!isMerging && files.length < 2 && (
                        <p className="text-red-500 mt-2 text-sm">Please select at least 2 files</p>
                    )}
                </div>
            )}
        </div>
    );
}


import type { Metadata } from 'next';
import MergePDFWrapper from '@/components/tools/pdf/MergePDFWrapper';
import AIInsights from '@/components/tools/AIInsights';

export const metadata: Metadata = {
    title: 'Merge PDF – Combine Multiple PDF Files Online | savme.io',
    description: 'Free Merge PDF tool. Combine multiple PDF files into one instantly. Fast, free, secure, no signup.',
    keywords: 'merge pdf, combine pdf, join pdf, pdf merger, free pdf merge',
};

export default function MergePDFPage() {

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SaveMe.io Merge PDF",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Combine multiple PDF files into one single document instantly."
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            {/* Ad Slot Top */}
            <div className="container py-4 text-center">
                <div className="w-full h-[90px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm border border-gray-300">
                    AD SLOT TOP (728x90)
                </div>
            </div>

            <div className="container grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-8">

                {/* Main Content */}
                <main>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Merge PDF Files</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Combine PDFs in the order you want with the easiest PDF merger available.
                        </p>
                    </div>

                    {/* Tool Component */}
                    <MergePDFWrapper />

                    {/* FAQ Section */}
                    <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>How do I merge PDF files?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">Simply drag and drop your files into the box above. You can reorder them by dragging or using the arrows, then click "Merge PDF".</p>
                            </details>
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>Is it secure?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">Yes, 100%. All processing happens in your browser. Your files never leave your device.</p>
                            </details>
                        </div>
                    </div>

                </main>

                {/* Sidebar Ads */}
                <aside className="hidden lg:block space-y-6">
                    <div className="w-full h-[600px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm border border-gray-300 sticky top-24">
                        AD SLOT SIDEBAR (300x600)
                    </div>
                </aside>

            </div>

            {/* Ad Slot Bottom */}
            <div className="container py-4 text-center">
                <div className="w-full h-[90px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm border border-gray-300">
                    AD SLOT BOTTOM (728x90)
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </div>
    );
}

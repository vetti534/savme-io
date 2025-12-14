
import type { Metadata } from 'next';
import SplitPDFWrapper from '@/components/tools/pdf/SplitPDFWrapper';
import AIInsights from '@/components/tools/AIInsights';

export const metadata: Metadata = {
    title: 'Split PDF – Separate PDF Pages Online | savme.io',
    description: 'Free Split PDF tool. Extract or separate PDF pages with one click. Fast, secure, no signup.',
    keywords: 'split pdf, extract pdf pages, separate pdf, cut pdf, free pdf splitter',
};

export default function SplitPDFPage() {

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SaveMe.io Split PDF",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Extract pages from your PDF files instantly with our free Split PDF tool. No registration required."
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
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Split PDF Online</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Extract pages from your PDF or save selected pages as a separate file. Fast, free, and secure.
                        </p>
                    </div>

                    {/* Tool Component */}
                    <SplitPDFWrapper />

                    {/* AI Insights Integration (Placeholder for future) */}
                    {/* <div className="mt-8">
                    <AIInsights toolName="Split PDF" inputData={{}} resultData={{ status: 'Page Viewed' }} promptType="advice" />
                 </div> */}

                    {/* FAQ Section */}
                    <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>Is it safe to split PDF files here?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">Yes! The tool works entirely in your browser. Your files are never uploaded to our servers, ensuring 100% privacy.</p>
                            </details>
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>Can I extract specific page ranges?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">Absolutely. You can select pages visually by clicking on them or type a range like "1-5" to extract specific sections.</p>
                            </details>
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>Is there a file size limit?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">This client-side tool handles large files efficiently, but performance depends on your device memory. For very large PDFs (100MB+), it might take a few seconds longer.</p>
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

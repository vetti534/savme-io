
import type { Metadata } from 'next';
import RemovePDFPagesWrapper from '@/components/tools/pdf/RemovePDFPagesWrapper';
import AIInsights from '@/components/tools/AIInsights';

export const metadata: Metadata = {
    title: 'Remove PDF Pages – Delete Pages from PDF Online | savme.io',
    description: 'Free Remove PDF Pages tool. Delete specific pages from your PDF documents instantly. Fast, secure, no signup required.',
    keywords: 'remove pdf pages, delete pdf pages, cut pdf pages, pdf page remover',
};

export default function RemovePDFPagesPage() {

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SaveMe.io Remove PDF Pages",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Delete unwanted pages from your PDF files instantly online."
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
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Remove Pages from PDF</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Click the pages you invite to remove, and download your clean PDF instantly.
                        </p>
                    </div>

                    {/* Tool Component */}
                    <RemovePDFPagesWrapper />

                    {/* FAQ Section */}
                    <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>How do I delete pages from a PDF?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">Upload your PDF, click on the thumbnails of the pages you want to remove (they will turn red), and then click the download button.</p>
                            </details>
                            <details className="group border-b border-gray-100 pb-4">
                                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 group-hover:text-blue-600">
                                    <span>Is it free?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 leading-relaxed text-gray-600">Yes, this tool is completely free to use with no limits on usage.</p>
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

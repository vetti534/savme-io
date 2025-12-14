'use client';
import dynamic from 'next/dynamic';

const SplitPDF = dynamic(() => import('./SplitPDF'), {
    ssr: false,
    loading: () => <p className="text-center p-8">Loading PDF Tool...</p>
});

export default function SplitPDFWrapper() {
    return <SplitPDF />;
}

'use client';
import dynamic from 'next/dynamic';

const MergePDF = dynamic(() => import('./MergePDF'), {
    ssr: false,
    loading: () => <p className="text-center p-8">Loading PDF Tool...</p>
});

export default function MergePDFWrapper() {
    return <MergePDF />;
}

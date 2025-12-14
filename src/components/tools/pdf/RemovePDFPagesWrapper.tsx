'use client';
import dynamic from 'next/dynamic';

const RemovePDFPages = dynamic(() => import('./RemovePDFPages'), {
    ssr: false,
    loading: () => <p className="text-center p-8">Loading PDF Tool...</p>
});

export default function RemovePDFPagesWrapper() {
    return <RemovePDFPages />;
}

import PdfHub from '@/components/tools/pdf/PdfHub';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF Tools | Merge, Split, Compress & Convert PDF',
    description: 'Every tool you need to work with PDFs in one place. Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.',
};

export default function PdfToolsPage() {
    return (
        <main>
            <PdfHub />
        </main>
    );
}

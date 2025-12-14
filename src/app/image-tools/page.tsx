import { Metadata } from 'next';
import ImageHub from '@/components/tools/image/ImageHub';

export const metadata: Metadata = {
    title: 'Image Tools - SavMe.io',
    description: 'Free online image tools: Resize, compress, convert, and edit images easily.',
};

export default function ImageToolsPage() {
    return <ImageHub />;
}

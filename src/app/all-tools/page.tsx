import { tools } from '@/lib/tools';
import CategoryClient from '@/components/category/CategoryClient';

export const metadata = {
    title: 'All Online Tools - SavMe.io',
    description: 'Browse our complete collection of 500+ free online tools including PDF editors, Calculators, Image Converters, and more.',
};

export default function AllToolsPage() {
    // create a synthetic category object for the shared component
    const allToolsCategory = {
        id: 'all-tools',
        name: 'All Tools',
        description: 'Browse our complete collection of free online tools.'
    };

    return <CategoryClient category={allToolsCategory} tools={tools} />;
}

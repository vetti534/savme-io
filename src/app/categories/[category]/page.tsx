import { tools, categories, STUDENT_FAVORITE_IDS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import CategoryClient from '@/components/category/CategoryClient';

interface Props {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        category: category.id,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { category: categoryId } = await params;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} - Free Online Tools | SAVEMI.IO`,
        description: `Best free online ${category.name.toLowerCase()}. Secure, fast, and no installation required. Access 100+ ${category.name} instantly.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category: categoryId } = await params;

    const category = categories.find((c) => c.id === categoryId);
    if (!category) {
        notFound();
    }

    let categoryTools = tools.filter((t) => t.category === categoryId);

    // If viewing Student Tools, also include the favorite generic tools
    if (categoryId === 'student-exam' || categoryId === 'student-tools') {
        const favoriteTools = tools.filter(t => STUDENT_FAVORITE_IDS.includes(t.id));
        // Merge and deduplicate
        categoryTools = [...categoryTools, ...favoriteTools];
    }

    return <CategoryClient category={category} tools={categoryTools} />;
}

import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import ToolHistoryTracker from '@/components/tools/ToolHistoryTracker';
import styles from './page.module.css';

import dynamic from 'next/dynamic';

// Lazy Load Calculator Components
const AgeCalculator = dynamic(() => import('@/components/tools/calculators/AgeCalculator'), { loading: () => <p>Loading Tool...</p> });
const GSTCalculator = dynamic(() => import('@/components/tools/calculators/GSTCalculator'), { loading: () => <p>Loading Tool...</p> });
const EMICalculator = dynamic(() => import('@/components/tools/calculators/EMICalculator'), { loading: () => <p>Loading Tool...</p> });
const LoanCalculator = dynamic(() => import('@/components/tools/calculators/LoanCalculator'), { loading: () => <p>Loading Tool...</p> });
const FDCalculator = dynamic(() => import('@/components/tools/calculators/FDCalculator'), { loading: () => <p>Loading Tool...</p> });
const RDCalculator = dynamic(() => import('@/components/tools/calculators/RDCalculator'), { loading: () => <p>Loading Tool...</p> });
const SIPCalculator = dynamic(() => import('@/components/tools/calculators/SIPCalculator'), { loading: () => <p>Loading Tool...</p> });
const IncomeTaxCalculator = dynamic(() => import('@/components/tools/calculators/IncomeTaxCalculator'), { loading: () => <p>Loading Tool...</p> });
const CurrencyConverter = dynamic(() => import('@/components/tools/calculators/CurrencyConverter'), { loading: () => <p>Loading Tool...</p> });
const CompoundInterestCalculator = dynamic(() => import('@/components/tools/calculators/CompoundInterestCalculator'), { loading: () => <p>Loading Tool...</p> });
const BudgetCalculator = dynamic(() => import('@/components/tools/calculators/BudgetCalculator'), { loading: () => <p>Loading Tool...</p> });
const SimpleCalculator = dynamic(() => import('@/components/tools/calculators/SimpleCalculator'), { loading: () => <p>Loading Tool...</p> });
const ROICalculator = dynamic(() => import('@/components/tools/calculators/ROICalculator'), { loading: () => <p>Loading Tool...</p> });
const InflationCalculator = dynamic(() => import('@/components/tools/calculators/InflationCalculator'), { loading: () => <p>Loading Tool...</p> });
const MarginCalculator = dynamic(() => import('@/components/tools/calculators/MarginCalculator'), { loading: () => <p>Loading Tool...</p> });
const BMICalculator = dynamic(() => import('@/components/tools/calculators/BMICalculator'), { loading: () => <p>Loading Tool...</p> });

// Lazy Load Image & PDF Imports
const ImageResizer = dynamic(() => import('@/components/tools/image/ImageResizer'), { loading: () => <p>Loading Tool...</p> });
const MergePDF = dynamic(() => import('@/components/tools/pdf/MergePDF'), { loading: () => <p>Loading Tool...</p> });

// Static Params Generation for Ultra Fast Loading
export async function generateStaticParams() {
    return tools.map((tool) => ({
        slug: tool.slug,
    }));
}

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const tool = tools.find((t) => t.slug === slug);
    if (!tool) return { title: 'Tool Not Found' };

    return {
        title: `${tool.name} - SavMe.io`,
        description: tool.description,
    };
}

const toolComponents: Record<string, React.ComponentType> = {
    'age-calculator': AgeCalculator,
    'gst-calculator': GSTCalculator,
    'emi-calculator': EMICalculator,
    'loan-calculator': LoanCalculator,
    'fd-calculator': FDCalculator,
    'rd-calculator': RDCalculator,
    'sip-calculator': SIPCalculator,
    'income-tax-calculator': IncomeTaxCalculator,
    'currency-converter': CurrencyConverter,
    'compound-interest-calculator': CompoundInterestCalculator,
    'budget-calculator': BudgetCalculator,
    'simple-calculator': SimpleCalculator,
    'roi-calculator': ROICalculator,
    'inflation-calculator': InflationCalculator,
    'margin-calculator': MarginCalculator,
    'bmi-calculator': BMICalculator,
    'image-resizer': ImageResizer,
    'merge-pdf': MergePDF,
};

export default async function ToolPage({ params }: Props) {
    const { slug } = await params;
    const tool = tools.find((t) => t.slug === slug);

    if (!tool) {
        notFound();
    }

    const ToolComponent = toolComponents[slug];

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            {/* Track History Client Component */}
            <ToolHistoryTracker tool={tool} />

            <div className={styles.header}>
                <h1 className={styles.title}>{tool.name}</h1>
                <p className={styles.description}>{tool.description}</p>
            </div>

            <div className={styles.toolContainer}>
                {ToolComponent ? (
                    <ToolComponent />
                ) : (
                    <div className={styles.comingSoon}>
                        <h2>Coming Soon</h2>
                        <p>This tool is currently under development. Check back later!</p>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h2>About {tool.name}</h2>
                <p>
                    This is a free online {tool.name.toLowerCase()} that allows you to {tool.description.toLowerCase()}
                    It is fast, secure, and works on any device.
                </p>
            </div>
        </div>
    );
}

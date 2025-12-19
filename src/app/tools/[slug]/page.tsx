import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import ToolHistoryTracker from '@/components/tools/ToolHistoryTracker';
import AdSlot from '@/components/ads/AdSlot';
import dynamic from 'next/dynamic';
import RelatedTools from '@/components/tools/RelatedTools';

// Lazy Load Calculator Components
const AgeCalculator = dynamic(() => import('@/components/tools/calculators/AgeCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const GSTCalculator = dynamic(() => import('@/components/tools/calculators/GSTCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const EMICalculator = dynamic(() => import('@/components/tools/calculators/EMICalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const LoanCalculator = dynamic(() => import('@/components/tools/calculators/LoanCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const FDCalculator = dynamic(() => import('@/components/tools/calculators/FDCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const RDCalculator = dynamic(() => import('@/components/tools/calculators/RDCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const SIPCalculator = dynamic(() => import('@/components/tools/calculators/SIPCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const IncomeTaxCalculator = dynamic(() => import('@/components/tools/calculators/IncomeTaxCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const CurrencyConverter = dynamic(() => import('@/components/tools/calculators/CurrencyConverter'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const CompoundInterestCalculator = dynamic(() => import('@/components/tools/calculators/CompoundInterestCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const BudgetCalculator = dynamic(() => import('@/components/tools/calculators/BudgetCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const SimpleCalculator = dynamic(() => import('@/components/tools/calculators/SimpleCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const ROICalculator = dynamic(() => import('@/components/tools/calculators/ROICalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const InflationCalculator = dynamic(() => import('@/components/tools/calculators/InflationCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const MarginCalculator = dynamic(() => import('@/components/tools/calculators/MarginCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const BMICalculator = dynamic(() => import('@/components/tools/calculators/BMICalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const ScientificCalculator = dynamic(() => import('@/components/tools/calculators/ScientificCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const DiscountCalculator = dynamic(() => import('@/components/tools/calculators/DiscountCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const ProfitLossCalculator = dynamic(() => import('@/components/tools/calculators/ProfitLossCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const AverageCalculator = dynamic(() => import('@/components/tools/calculators/AverageCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const RatioCalculator = dynamic(() => import('@/components/tools/calculators/RatioCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const LCMHCFCalculator = dynamic(() => import('@/components/tools/calculators/LCMHCFCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const PercentageCalculator = dynamic(() => import('@/components/tools/calculators/PercentageCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const SalesTaxCalculator = dynamic(() => import('@/components/tools/calculators/SalesTaxCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const FractionCalculator = dynamic(() => import('@/components/tools/calculators/FractionCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const AutoLoanCalculator = dynamic(() => import('@/components/tools/calculators/AutoLoanCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const DateCalculator = dynamic(() => import('@/components/tools/calculators/DateCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const TimeCalculator = dynamic(() => import('@/components/tools/calculators/TimeCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const CreditCardPayoffCalculator = dynamic(() => import('@/components/tools/calculators/CreditCardPayoffCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const RentVsBuyCalculator = dynamic(() => import('@/components/tools/calculators/RentVsBuyCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const MortgageCalculator = dynamic(() => import('@/components/tools/calculators/MortgageCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const SimpleInterestCalculator = dynamic(() => import('@/components/tools/calculators/SimpleInterestCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });

// Lazy Load Image & PDF Imports
const ImageResizer = dynamic(() => import('@/components/tools/image/ImageResizer'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const MergePDF = dynamic(() => import('@/components/tools/pdf/MergePDFWrapper'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const SplitPDF = dynamic(() => import('@/components/tools/pdf/SplitPDFWrapper'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const RemovePDFPages = dynamic(() => import('@/components/tools/pdf/RemovePDFPagesWrapper'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const UnitConverter = dynamic(() => import('@/components/tools/converters/UnitConverter'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const WorkingDaysCalculator = dynamic(() => import('@/components/tools/calculators/WorkingDaysCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const CountdownTimer = dynamic(() => import('@/components/tools/calculators/CountdownTimer'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const TimeZoneConverter = dynamic(() => import('@/components/tools/calculators/TimeZoneConverter'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const AttendanceCalculator = dynamic(() => import('@/components/tools/calculators/AttendanceCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const MarksPercentageCalculator = dynamic(() => import('@/components/tools/calculators/MarksPercentageCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const PercentageToCGPACalculator = dynamic(() => import('@/components/tools/calculators/PercentageToCGPACalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const GPACalculator = dynamic(() => import('@/components/tools/calculators/GPACalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const FuelCostCalculator = dynamic(() => import('@/components/tools/calculators/FuelCostCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const ElectricityBillCalculator = dynamic(() => import('@/components/tools/calculators/ElectricityBillCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const WeightLossCalculator = dynamic(() => import('@/components/tools/calculators/WeightLossCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });
const GDPCalculator = dynamic(() => import('@/components/tools/calculators/GDPCalculator'), { loading: () => <p className="text-sm text-gray-400">Loading...</p> });

// Static Params Generation
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
        title: `${tool.name} - Free Online Tool | SAVEMI.IO`,
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
    'split-pdf': SplitPDF,
    'remove-pages': RemovePDFPages,
    'scientific-calculator': ScientificCalculator,
    'percentage-calculator': PercentageCalculator,
    'fraction-calculator': FractionCalculator,
    'date-calculator': DateCalculator,
    'time-calculator': TimeCalculator,
    'mortgage-calculator': MortgageCalculator,
    'auto-loan-calculator': AutoLoanCalculator,
    'amortization-calculator': LoanCalculator, // Reusing Loan Calc
    'credit-card-payoff-calculator': CreditCardPayoffCalculator,
    'simple-interest-calculator': SimpleInterestCalculator,
    'discount-calculator': DiscountCalculator,
    'profit-loss-calculator': ProfitLossCalculator,
    'average-calculator': AverageCalculator,
    'ratio-calculator': RatioCalculator,
    'lcm-calculator': LCMHCFCalculator,
    'gcf-calculator': LCMHCFCalculator,
    'rent-vs-buy-calculator': RentVsBuyCalculator,
    'sales-tax-calculator': SalesTaxCalculator,
    // Converters
    'length-converter': UnitConverter,
    'weight-calculator': UnitConverter, // Existing slug
    'temperature-converter': UnitConverter,
    'area-converter': UnitConverter,
    'volume-converter': UnitConverter,
    'time-converter': UnitConverter,
    'speed-calculator': UnitConverter,
    'conversion-calculator': UnitConverter,

    // Time & Date
    'working-days-calculator': WorkingDaysCalculator,
    'countdown-timer': CountdownTimer,
    'time-zone-calculator': TimeZoneConverter,

    // Student / Exam
    'attendance-calculator': AttendanceCalculator,
    'marks-percentage-calculator': MarksPercentageCalculator,
    'percentage-to-cgpa-calculator': PercentageToCGPACalculator,
    'gpa-calculator': GPACalculator,
    'cgpa-calculator': GPACalculator, // Reuse GPA calc for CGPA for now (similar logic usually)
    'grade-calculator': MarksPercentageCalculator, // Reuse marks % for basic grade calc

    // Utility & Health
    'fuel-cost-calculator': FuelCostCalculator,
    'electricity-calculator': ElectricityBillCalculator,
    'weight-loss-calculator': WeightLossCalculator,
    'gdp-calculator': GDPCalculator,
};

// Tools that already implement their own Sidebar/Grid layout
const CUSTOM_LAYOUT_TOOLS = [
    'age-calculator',
    'mortgage-calculator',
    'emi-calculator',
    'gst-calculator',
    'income-tax-calculator',
    'time-calculator',
    'sip-calculator',
    'fd-calculator',
    'rd-calculator',
    'roi-calculator',
    'margin-calculator',
    'gdp-calculator'
];

export default async function ToolPage({ params }: Props) {
    const { slug } = await params;
    const tool = tools.find((t) => t.slug === slug);

    if (!tool) {
        notFound();
    }

    const ToolComponent = toolComponents[slug];

    // Determine if we should use the standard wrapper or render the tool directly
    // because it handles its own full-page layout.
    const isCustomLayout = CUSTOM_LAYOUT_TOOLS.includes(slug);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Track History */}
            <ToolHistoryTracker tool={tool} />

            {/* Added extra padding-top for breathing room below fixed header */}
            <div className={`container mx-auto px-4 pt-6 ${isCustomLayout ? 'max-w-6xl' : 'max-w-6xl'}`}>

                {/* 1. HEADER (Only for Standard Layouts - Custom tools have their own headers often, 
                    but to be safe, we check if they want to hide it. 
                    Actually, AgeCalc has its own header inside the card, but let's keep the global one 
                    consistent or hide it if the tool duplicates it.
                    For now, we will render the header for EVERYONE for SEO consistency, 
                    unless the tool specifically hides it (which we aren't handling yet).
                    Wait, AgeCalculator.tsx DOES have a header inside. 
                    Let's hide this global header for Custom Layout Tools to avoid duplication.
                */}
                {!isCustomLayout && (
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                            {tool.name}
                        </h1>
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                            {tool.description}
                        </p>
                    </div>
                )}

                {/* 2. LAYOUT SWITCH */}
                {isCustomLayout ? (
                    // === CUSTOM LAYOUT (Age, Mortgage, etc.) ===
                    // They handle their own grid and sidebars
                    <>
                        {ToolComponent ? <ToolComponent /> : null}
                    </>
                ) : (
                    // === STANDARD LAYOUT (Sidebar for everyone else) ===
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Tool + SEO */}
                        <div className="lg:col-span-2">


                            {/* TOOL CARD */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] p-4 md:p-8 mb-12">
                                {ToolComponent ? (
                                    <ToolComponent />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Coming Soon</h2>
                                        <p className="text-sm text-gray-500">This tool is currently under development.</p>
                                    </div>
                                )}
                            </div>

                            {/* SEO CONTENT */}
                            <div className="prose prose-sm max-w-none text-gray-600">
                                <h2 className="text-lg font-bold text-gray-900 mb-3">About {tool.name}</h2>
                                <p>
                                    This is a free online <strong>{tool.name}</strong> that allows you to {tool.description.toLowerCase()} securely and instantly.
                                    It is designed to be fast, reliable, and works on any device without installation.
                                </p>
                                <p>
                                    Whether you are a student, professional, or business owner, our <strong>{tool.name}</strong> helps you save time and increase productivity.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                {/* UNIFIED SIDEBAR BOX (Ad + Related Tools) */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                    <div className="min-h-[400px] bg-gray-50 rounded-lg mb-6 flex items-center justify-center border border-dashed border-gray-200">
                                        <AdSlot label="Advertisement" className="h-full w-full" variant="clean" />
                                    </div>
                                    <RelatedTools currentToolSlug={slug} category={tool.category} variant="clean" />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaCalculator, FaUndo, FaFilePdf, FaRobot } from 'react-icons/fa';
import styles from './EMICalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolResult from '@/components/tools/ToolResult';
import { generateToolInsight } from '@/actions/tools/ai-insight';

const MODES = [
    { id: 1, name: 'Simple', desc: 'Standard EMI Calculation' },
    { id: 2, name: 'Loan Types', desc: 'Car, Home, Personal, or Bike Loans' },
    { id: 3, name: 'Reducing vs Flat', desc: 'See how much you save with Reducing Balance' },
    { id: 4, name: 'By Months', desc: 'Calculate for short-term loans in months' },
    { id: 5, name: 'Compare', desc: 'Compare two different loan scenarios' },
];

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'USD - US Dollar' },
    { code: 'EUR', symbol: '€', name: 'EUR - Euro' },
    { code: 'GBP', symbol: '£', name: 'GBP - British Pound' },
    { code: 'INR', symbol: '₹', name: 'INR - Indian Rupee' },
    { code: 'AED', symbol: ' د.إ', name: 'AED - UAE Dirham' },
    { code: 'AFN', symbol: '؋', name: 'AFN - Afghan Afghani' },
    { code: 'ALL', symbol: 'L', name: 'ALL - Albanian Lek' },
    { code: 'AMD', symbol: '֏', name: 'AMD - Armenian Dram' },
    { code: 'ANG', symbol: 'ƒ', name: 'ANG - Neth. Antillean Guilder' },
    { code: 'AOA', symbol: 'Kz', name: 'AOA - Angolan Kwanza' },
    { code: 'ARS', symbol: '$', name: 'ARS - Argentine Peso' },
    { code: 'AUD', symbol: '$', name: 'AUD - Australian Dollar' },
    { code: 'AWG', symbol: 'ƒ', name: 'AWG - Aruban Florin' },
    { code: 'AZN', symbol: '₼', name: 'AZN - Azerbaijani Manat' },
    { code: 'BAM', symbol: 'KM', name: 'BAM - Bosnia-Herz. Mark' },
    { code: 'BBD', symbol: '$', name: 'BBD - Barbadian Dollar' },
    { code: 'BDT', symbol: '৳', name: 'BDT - Bangladeshi Taka' },
    { code: 'BGN', symbol: 'лв', name: 'BGN - Bulgarian Lev' },
    { code: 'BHD', symbol: '.د.ب', name: 'BHD - Bahraini Dinar' },
    { code: 'BIF', symbol: 'FBu', name: 'BIF - Burundian Franc' },
    { code: 'BMD', symbol: '$', name: 'BMD - Bermudan Dollar' },
    { code: 'BND', symbol: '$', name: 'BND - Brunei Dollar' },
    { code: 'BOB', symbol: 'Bs.', name: 'BOB - Bolivian Boliviano' },
    { code: 'BRL', symbol: 'R$', name: 'BRL - Brazilian Real' },
    { code: 'BSD', symbol: '$', name: 'BSD - Bahamian Dollar' },
    { code: 'BTN', symbol: 'Nu.', name: 'BTN - Bhutanese Ngultrum' },
    { code: 'BWP', symbol: 'P', name: 'BWP - Botswanan Pula' },
    { code: 'BYN', symbol: 'Br', name: 'BYN - Belarusian Ruble' },
    { code: 'BZD', symbol: '$', name: 'BZD - Belize Dollar' },
    { code: 'CAD', symbol: '$', name: 'CAD - Canadian Dollar' },
    { code: 'CDF', symbol: 'FC', name: 'CDF - Congolese Franc' },
    { code: 'CHF', symbol: 'CHF', name: 'CHF - Swiss Franc' },
    { code: 'CLP', symbol: '$', name: 'CLP - Chilean Peso' },
    { code: 'CNY', symbol: '¥', name: 'CNY - Chinese Yuan' },
    { code: 'COP', symbol: '$', name: 'COP - Colombian Peso' },
    { code: 'CRC', symbol: '₡', name: 'CRC - Costa Rican Colón' },
    { code: 'CUP', symbol: '$', name: 'CUP - Cuban Peso' },
    { code: 'CVE', symbol: '$', name: 'CVE - Cape Verdean Escudo' },
    { code: 'CZK', symbol: 'Kč', name: 'CZK - Czech Koruna' },
    { code: 'DJF', symbol: 'Fdj', name: 'DJF - Djiboutian Franc' },
    { code: 'DKK', symbol: 'kr', name: 'DKK - Danish Krone' },
    { code: 'DOP', symbol: 'RD$', name: 'DOP - Dominican Peso' },
    { code: 'DZD', symbol: 'د.ج', name: 'DZD - Algerian Dinar' },
    { code: 'EGP', symbol: '£', name: 'EGP - Egyptian Pound' },
    { code: 'ERN', symbol: 'Nfk', name: 'ERN - Eritrean Nakfa' },
    { code: 'ETB', symbol: 'Br', name: 'ETB - Ethiopian Birr' },
    { code: 'FJD', symbol: '$', name: 'FJD - Fijian Dollar' },
    { code: 'FKP', symbol: '£', name: 'FKP - Falkland Islands Pound' },
    { code: 'FOK', symbol: 'kr', name: 'FOK - Faroese Króna' },
    { code: 'GEL', symbol: '₾', name: 'GEL - Georgian Lari' },
    { code: 'GGP', symbol: '£', name: 'GGP - Guernsey Pound' },
    { code: 'GHS', symbol: '₵', name: 'GHS - Ghanaian Cedi' },
    { code: 'GIP', symbol: '£', name: 'GIP - Gibraltar Pound' },
    { code: 'GMD', symbol: 'D', name: 'GMD - Gambian Dalasi' },
    { code: 'GNF', symbol: 'FG', name: 'GNF - Guinean Franc' },
    { code: 'GTQ', symbol: 'Q', name: 'GTQ - Guatemalan Quetzal' },
    { code: 'GYD', symbol: '$', name: 'GYD - Guyanaese Dollar' },
    { code: 'HKD', symbol: '$', name: 'HKD - Hong Kong Dollar' },
    { code: 'HNL', symbol: 'L', name: 'HNL - Honduran Lempira' },
    { code: 'HRK', symbol: 'kn', name: 'HRK - Croatian Kuna' },
    { code: 'HTG', symbol: 'G', name: 'HTG - Haitian Gourde' },
    { code: 'HUF', symbol: 'Ft', name: 'HUF - Hungarian Forint' },
    { code: 'IDR', symbol: 'Rp', name: 'IDR - Indonesian Rupiah' },
    { code: 'ILS', symbol: '₪', name: 'ILS - Israeli New Shekel' },
    { code: 'IMP', symbol: '£', name: 'IMP - Manx Pound' },
    { code: 'IQD', symbol: 'ع.د', name: 'IQD - Iraqi Dinar' },
    { code: 'IRR', symbol: '﷼', name: 'IRR - Iranian Rial' },
    { code: 'ISK', symbol: 'kr', name: 'ISK - Icelandic Króna' },
    { code: 'JEP', symbol: '£', name: 'JEP - Jersey Pound' },
    { code: 'JMD', symbol: '$', name: 'JMD - Jamaican Dollar' },
    { code: 'JOD', symbol: 'د.ا', name: 'JOD - Jordanian Dinar' },
    { code: 'JPY', symbol: '¥', name: 'JPY - Japanese Yen' },
    { code: 'KES', symbol: 'KSh', name: 'KES - Kenyan Shilling' },
    { code: 'KGS', symbol: 'с', name: 'KGS - Kyrgystani Som' },
    { code: 'KHR', symbol: '៛', name: 'KHR - Cambodian Riel' },
    { code: 'KID', symbol: '$', name: 'KID - Kiribati Dollar' },
    { code: 'KMF', symbol: 'CF', name: 'KMF - Comorian Franc' },
    { code: 'KRW', symbol: '₩', name: 'KRW - South Korean Won' },
    { code: 'KWD', symbol: 'د.ك', name: 'KWD - Kuwaiti Dinar' },
    { code: 'KYD', symbol: '$', name: 'KYD - Cayman Islands Dollar' },
    { code: 'KZT', symbol: '₸', name: 'KZT - Kazakhstani Tenge' },
    { code: 'LAK', symbol: '₭', name: 'LAK - Laotian Kip' },
    { code: 'LBP', symbol: 'ل.ل', name: 'LBP - Lebanese Pound' },
    { code: 'LKR', symbol: 'Rs', name: 'LKR - Sri Lankan Rupee' },
    { code: 'LRD', symbol: '$', name: 'LRD - Liberian Dollar' },
    { code: 'LSL', symbol: 'L', name: 'LSL - Lesotho Loti' },
    { code: 'LYD', symbol: 'ل.د', name: 'LYD - Libyan Dinar' },
    { code: 'MAD', symbol: 'dh', name: 'MAD - Moroccan Dirham' },
    { code: 'MDL', symbol: 'L', name: 'MDL - Moldovan Leu' },
    { code: 'MGA', symbol: 'Ar', name: 'MGA - Malagasy Ariary' },
    { code: 'MKD', symbol: 'ден', name: 'MKD - Macedonian Denar' },
    { code: 'MMK', symbol: 'K', name: 'MMK - Myanmar Kyat' },
    { code: 'MNT', symbol: '₮', name: 'MNT - Mongolian Tugrik' },
    { code: 'MOP', symbol: 'MOP$', name: 'MOP - Macanese Pataca' },
    { code: 'MRU', symbol: 'UM', name: 'MRU - Mauritanian Ouguiya' },
    { code: 'MUR', symbol: '₨', name: 'MUR - Mauritian Rupee' },
    { code: 'MVR', symbol: '.ރ', name: 'MVR - Maldivian Rufiyaa' },
    { code: 'MWK', symbol: 'MK', name: 'MWK - Malawian Kwacha' },
    { code: 'MXN', symbol: '$', name: 'MXN - Mexican Peso' },
    { code: 'MYR', symbol: 'RM', name: 'MYR - Malaysian Ringgit' },
    { code: 'MZN', symbol: 'MT', name: 'MZN - Mozambican Metical' },
    { code: 'NAD', symbol: '$', name: 'NAD - Namibian Dollar' },
    { code: 'NGN', symbol: '₦', name: 'NGN - Nigerian Naira' },
    { code: 'NIO', symbol: 'C$', name: 'NIO - Nicaraguan Córdoba' },
    { code: 'NOK', symbol: 'kr', name: 'NOK - Norwegian Krone' },
    { code: 'NPR', symbol: '₨', name: 'NPR - Nepalese Rupee' },
    { code: 'NZD', symbol: '$', name: 'NZD - New Zealand Dollar' },
    { code: 'OMR', symbol: 'ر.ع.', name: 'OMR - Omani Rial' },
    { code: 'PAB', symbol: 'B/.', name: 'PAB - Panamanian Balboa' },
    { code: 'PEN', symbol: 'S/.', name: 'PEN - Peruvian Sol' },
    { code: 'PGK', symbol: 'K', name: 'PGK - Papua New Guinean Kina' },
    { code: 'PHP', symbol: '₱', name: 'PHP - Philippine Peso' },
    { code: 'PKR', symbol: '₨', name: 'PKR - Pakistani Rupee' },
    { code: 'PLN', symbol: 'zł', name: 'PLN - Polish Złoty' },
    { code: 'PYG', symbol: '₲', name: 'PYG - Paraguayan Guarani' },
    { code: 'QAR', symbol: 'ر.ق', name: 'QAR - Qatari Rial' },
    { code: 'RON', symbol: 'lei', name: 'RON - Romanian Leu' },
    { code: 'RSD', symbol: 'дин.', name: 'RSD - Serbian Dinar' },
    { code: 'RUB', symbol: '₽', name: 'RUB - Russian Ruble' },
    { code: 'RWF', symbol: 'FRw', name: 'RWF - Rwandan Franc' },
    { code: 'SAR', symbol: 'ر.س', name: 'SAR - Saudi Riyal' },
    { code: 'SBD', symbol: '$', name: 'SBD - Solomon Islands Dollar' },
    { code: 'SCR', symbol: '₨', name: 'SCR - Seychellois Rupee' },
    { code: 'SDG', symbol: 'ج.س.', name: 'SDG - Sudanese Pound' },
    { code: 'SEK', symbol: 'kr', name: 'SEK - Swedish Krona' },
    { code: 'SGD', symbol: '$', name: 'SGD - Singapore Dollar' },
    { code: 'SHP', symbol: '£', name: 'SHP - Saint Helena Pound' },
    { code: 'SLE', symbol: 'Le', name: 'SLE - Sierra Leonean Leone' },
    { code: 'SOS', symbol: 'S', name: 'SOS - Somali Shilling' },
    { code: 'SRD', symbol: '$', name: 'SRD - Surinamese Dollar' },
    { code: 'SSP', symbol: '£', name: 'SSP - South Sudanese Pound' },
    { code: 'STN', symbol: 'Db', name: 'STN - São Tomé and Príncipe Dobra' },
    { code: 'SYP', symbol: '£', name: 'SYP - Syrian Pound' },
    { code: 'SZL', symbol: 'L', name: 'SZL - Swazi Lilangeni' },
    { code: 'THB', symbol: '฿', name: 'THB - Thai Baht' },
    { code: 'TJS', symbol: 'SM', name: 'TJS - Tajikistani Somoni' },
    { code: 'TMT', symbol: 'T', name: 'TMT - Turkmenistani Manat' },
    { code: 'TND', symbol: 'د.ت', name: 'TND - Tunisian Dinar' },
    { code: 'TOP', symbol: 'T$', name: 'TOP - Tongan Paʻanga' },
    { code: 'TRY', symbol: '₺', name: 'TRY - Turkish Lira' },
    { code: 'TTD', symbol: 'TT$', name: 'TTD - Trinidad and Tobago Dollar' },
    { code: 'TVD', symbol: '$', name: 'TVD - Tuvaluan Dollar' },
    { code: 'TWD', symbol: 'NT$', name: 'TWD - New Taiwan Dollar' },
    { code: 'TZS', symbol: 'Sh', name: 'TZS - Tanzanian Shilling' },
    { code: 'UAH', symbol: '₴', name: 'UAH - Ukrainian Hryvnia' },
    { code: 'UGX', symbol: 'USh', name: 'UGX - Ugandan Shilling' },
    { code: 'UYU', symbol: '$U', name: 'UYU - Uruguayan Peso' },
    { code: 'UZS', symbol: 'so\'m', name: 'UZS - Uzbekistan Som' },
    { code: 'VES', symbol: 'Bs.S', name: 'VES - Venezuelan Bolívar Soberano' },
    { code: 'VND', symbol: '₫', name: 'VND - Vietnamese Dong' },
    { code: 'VUV', symbol: 'VT', name: 'VUV - Vanuatu Vatu' },
    { code: 'WST', symbol: 'T', name: 'WST - Samoan Tala' },
    { code: 'XAF', symbol: 'FCFA', name: 'XAF - CFA Franc BEAC' },
    { code: 'XCD', symbol: '$', name: 'XCD - East Caribbean Dollar' },
    { code: 'XOF', symbol: 'CFA', name: 'XOF - CFA Franc BCEAO' },
    { code: 'XPF', symbol: '₣', name: 'XPF - CFP Franc' },
    { code: 'YER', symbol: '﷼', name: 'YER - Yemeni Rial' },
    { code: 'ZAR', symbol: 'R', name: 'ZAR - South African Rand' },
    { code: 'ZMW', symbol: 'ZK', name: 'ZMW - Zambian Kwacha' },
    { code: 'ZWL', symbol: '$', name: 'ZWL - Zimbabwean Dollar' },
];

export default function EMICalculator() {
    const { addToHistory } = useHistory();
    const [activeMode, setActiveMode] = useState(1);
    const [result, setResult] = useState<any>(null);
    const [explanation, setExplanation] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // AI State
    const [aiInsight, setAiInsight] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);

    // Inputs
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(10.5);
    const [tenure, setTenure] = useState(5); // Default in Years for most modes
    const [tenureType, setTenureType] = useState<'Years' | 'Months'>('Years');

    // Comparison Inputs
    const [c2Amount, setC2Amount] = useState(500000);
    const [c2Rate, setC2Rate] = useState(12.0);
    const [c2Tenure, setC2Tenure] = useState(5);

    // Currency
    const [currency, setCurrency] = useState('INR');

    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => {
        setResult(null);
        setExplanation([]);
        setAiInsight('');
    }, [activeMode, currency, amount, rate, tenure, tenureType]);

    // Preset Handlers
    const applyPreset = (type: string) => {
        if (type === 'Home') { setAmount(3000000); setRate(8.5); setTenure(20); setTenureType('Years'); }
        if (type === 'Car') { setAmount(800000); setRate(9.0); setTenure(5); setTenureType('Years'); }
        if (type === 'Personal') { setAmount(200000); setRate(11.0); setTenure(3); setTenureType('Years'); }
        if (type === 'Bike') { setAmount(100000); setRate(12.0); setTenure(2); setTenureType('Years'); }
    };

    if (!isMounted) return <div className="p-10 text-center">Loading EMI Calculator...</div>;

    const formatCurrency = (val: number) => {
        const cur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[1];
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur.code }).format(val);
    };

    const getCurSym = () => CURRENCIES.find(c => c.code === currency)?.symbol || '₹';

    const calculateEMI = (P: number, R: number, N_Months: number) => {
        if (R === 0) return P / N_Months;
        const r = R / 12 / 100;
        return (P * r * Math.pow(1 + r, N_Months)) / (Math.pow(1 + r, N_Months) - 1);
    };

    const calculateFlatEMI = (P: number, R: number, N_Months: number) => {
        const totalInterest = P * (R / 100) * (N_Months / 12);
        return (P + totalInterest) / N_Months;
    };

    const handleCalculate = () => {
        setResult(null);
        setExplanation([]);
        setAiInsight('');

        let res: any = {};
        let steps: string[] = [];

        try {
            const months = tenureType === 'Years' ? tenure * 12 : tenure;
            const emi = calculateEMI(amount, rate, months);
            const totalPay = emi * months;
            const totalInt = totalPay - amount;

            // Common Steps
            const commonSteps = [
                `<b>Step 1:</b> Identify Inputs`,
                `> Loan Amount (P) = ${formatCurrency(amount)}`,
                `> Interest Rate (R) = ${rate}% per annum`,
                `> Tenure (n) = ${months} months`,
                `<br/>`,
                `<b>Step 2:</b> Calculate Monthly Rate`,
                `> r = ${rate} / 12 / 100 = ${(rate / 12 / 100).toFixed(6)}`,
                `<br/>`,
                `<b>Step 3:</b> Apply EMI Formula`,
                `> EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]`,
                `> EMI = [${amount} x ${(rate / 12 / 100).toFixed(4)} x (1+${(rate / 12 / 100).toFixed(4)})^${months}] / ...`,
            ];

            if (activeMode === 1 || activeMode === 2 || activeMode === 4) {
                res = {
                    main: formatCurrency(emi),
                    subTitle: 'Monthly EMI',
                    extraStats: [
                        { label: 'Principal', value: formatCurrency(amount) },
                        { label: 'Total Interest', value: formatCurrency(totalInt) },
                        { label: 'Total Amount', value: formatCurrency(totalPay) }
                    ]
                };
                steps = [...commonSteps, `<b>Result:</b> Your Monthly EMI is <b>${formatCurrency(emi)}</b>`];
            }

            else if (activeMode === 3) {
                // Reduces vs Flat
                const flatEmi = calculateFlatEMI(amount, rate, months);
                const flatTotal = flatEmi * months;
                const flatInt = flatTotal - amount;
                const savings = flatTotal - totalPay;

                res = {
                    main: formatCurrency(emi),
                    subTitle: 'Reducing Balance EMI',
                    extraStats: [
                        { label: 'Flat Rate EMI', value: formatCurrency(flatEmi) },
                        { label: 'Reducing EMI', value: formatCurrency(emi) },
                        { label: 'Interest Saved', value: formatCurrency(Math.max(0, savings)) }
                    ]
                };

                steps = [
                    `<b>Reducing Balance Method (Standard):</b>`,
                    `Interest is calculated on the outstanding principal relative to monthly payments.`,
                    `> EMI: ${formatCurrency(emi)}`,
                    `> Total Interest: ${formatCurrency(totalInt)}`,
                    `<br/>`,
                    `<b>Flat Rate Method:</b>`,
                    `Interest is calculated on the FULL principal for the entire tenure.`,
                    `> Flat EMI: ${formatCurrency(flatEmi)}`,
                    `> Total Interest: ${formatCurrency(flatInt)}`,
                    `<br/>`,
                    `<b>Conclusion:</b> Reducing Balance saves you <b>${formatCurrency(savings)}</b> over the loan term compared to Flat Rate.`
                ];
            }

            else if (activeMode === 5) {
                // Compare
                const m2 = c2Tenure * 12;
                const emi2 = calculateEMI(c2Amount, c2Rate, m2);
                const total2 = emi2 * m2;

                const diffEmi = Math.abs(emi - emi2);
                const diffTotal = Math.abs(totalPay - total2);
                const better = totalPay < total2 ? 'Scenario 1' : 'Scenario 2';

                res = {
                    main: `${formatCurrency(diffEmi)} / mo`,
                    subTitle: `Difference in EMI`,
                    extraStats: [
                        { label: 'Scenario 1 EMI', value: formatCurrency(emi) },
                        { label: 'Scenario 2 EMI', value: formatCurrency(emi2) },
                        { label: 'Total Diff', value: formatCurrency(diffTotal) },
                    ]
                };

                steps = [
                    `<b>Scenario 1:</b> ${formatCurrency(amount)} @ ${rate}% for ${tenure}yr = ${formatCurrency(emi)}/mo`,
                    `<b>Scenario 2:</b> ${formatCurrency(c2Amount)} @ ${c2Rate}% for ${c2Tenure}yr = ${formatCurrency(emi2)}/mo`,
                    `<br/>`,
                    `<b>Comparison:</b>`,
                    `> EMI Difference: ${formatCurrency(diffEmi)}`,
                    `> Total Payment Difference: ${formatCurrency(diffTotal)}`,
                    `> <b>${better}</b> is cheaper considering total repayment.`
                ];
            }

            setResult(res);
            setExplanation(steps);
            addToHistory({ toolName: `EMI Calculator (${MODES[activeMode - 1].name})`, summary: res.main, url: '/tools/emi-calculator' });

        } catch (e) {
            console.error(e);
            alert("Error in calculation. Please check inputs.");
        }
    };

    const downloadPDF = async () => {
        if (!result) return;
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const curDate = new Date().toLocaleString();

        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text("EMI Calculator - Report", 14, 20);

        doc.setFontSize(10);
        doc.text(`Generated on: ${curDate}`, 14, 28);
        doc.text("savme.io", 180, 20);

        doc.setLineWidth(0.5);
        doc.line(14, 32, 196, 32);

        doc.setFontSize(14);
        doc.text("Inputs", 14, 42);

        doc.setFontSize(11);
        doc.text(`Loan Amount: ${formatCurrency(amount)}`, 14, 52);
        doc.text(`Interest Rate: ${rate}%`, 14, 58);
        doc.text(`Tenure: ${tenure} ${tenureType}`, 14, 64);

        if (activeMode === 5) {
            doc.text(`Scenario 2 Amount: ${formatCurrency(c2Amount)}`, 100, 52);
            doc.text(`Scenario 2 Rate: ${c2Rate}%`, 100, 58);
            doc.text(`Scenario 2 Tenure: ${c2Tenure} Years`, 100, 64);
        }

        doc.setFontSize(14);
        doc.text("Results", 14, 80);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`Main Result: ${result.main}`, 14, 90);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        let y = 100;
        result.extraStats.forEach((stat: any) => {
            doc.text(`${stat.label}: ${stat.value}`, 14, y);
            y += 6;
        });

        doc.setLineWidth(0.5);
        doc.line(14, y + 5, 196, y + 5);

        doc.setFontSize(14);
        doc.text("Explanation", 14, y + 15);

        y += 25;
        doc.setFontSize(10);
        explanation.forEach((step) => {
            const cleanStep = step.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
            const lines = doc.splitTextToSize(cleanStep, 180);
            doc.text(lines, 14, y);
            y += lines.length * 5;
        });

        doc.save(`EMI-Calculation-${new Date().getTime()}.pdf`);
    };

    const fetchAiInsight = async () => {
        if (!result) return;
        setLoadingAi(true);
        const prompt = `
            Analyze this EMI Scenario as a financial advisor:
            Loan: ${formatCurrency(amount)}, Rate: ${rate}%, Tenure: ${tenure} ${tenureType}.
            EMI: ${result.main}.
            User Goal: ${MODES[activeMode - 1].desc}.
            Provide 2-3 short, actionable tips on affordability, prepayment, or loan selection. 
            Be friendly and concise (max 3 sentences).
        `;
        const text = await generateToolInsight(prompt);
        setAiInsight(text);
        setLoadingAi(false);
    };

    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>

                {/* 1. Modes */}
                <div className={styles.tabs}>
                    {MODES.map(m => (
                        <button key={m.id} className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`} onClick={() => { setActiveMode(m.id); if (m.id === 4) setTenureType('Months'); else setTenureType('Years'); }}>
                            {m.name}
                        </button>
                    ))}
                </div>

                {/* 2. Currency Selector */}
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 w-fit mb-6">
                    <label className="text-sm font-bold text-gray-500 uppercase">Currency:</label>
                    <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="p-2 border border-gray-300 rounded font-bold bg-white text-black min-w-[200px]"
                    >
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}><FaCalculator /> {MODES.find(m => m.id === activeMode)?.name}</h2>
                        <p className={styles.cardDesc}>{MODES.find(m => m.id === activeMode)?.desc}</p>
                    </div>

                    {/* PRESETS for Mode 2 */}
                    {activeMode === 2 && (
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {['Home', 'Car', 'Personal', 'Bike'].map(type => (
                                <button key={type} onClick={() => applyPreset(type)} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-100 transition">
                                    {type} Loan
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={styles.inputSection}>
                        {/* MAIN INPUTS */}
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Loan Amount</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.prefix}>{getCurSym()}</span>
                                    <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Interest Rate</label>
                                <div className={styles.inputWrapper}>
                                    <input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className={styles.hasSuffix} />
                                    <span className={styles.suffix}>%</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Tenure ({tenureType})</label>
                                <div className="flex gap-2">
                                    <div className={styles.inputWrapper + ' flex-1'}>
                                        <input type="number" value={tenure} onChange={e => setTenure(+e.target.value)} className={styles.hasSuffix} />
                                        <span className={styles.suffix}>{tenureType === 'Years' ? 'Yr' : 'Mo'}</span>
                                    </div>
                                    {activeMode !== 4 && (
                                        <button onClick={() => setTenureType(t => t === 'Years' ? 'Months' : 'Years')} className="px-3 bg-gray-100 rounded text-xs font-bold uppercase tracking-wider text-gray-600 border border-gray-200">
                                            Switch to {tenureType === 'Years' ? 'Months' : 'Years'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* COMPARISON INPUTS */}
                        {activeMode === 5 && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Compare With (Scenario 2)</h3>
                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label>Loan Amount</label>
                                        <div className={styles.inputWrapper}><span className={styles.prefix}>{getCurSym()}</span><input type="number" value={c2Amount} onChange={e => setC2Amount(+e.target.value)} /></div>
                                    </div>
                                    <div className={styles.row}>
                                        <div className={styles.inputGroup}>
                                            <label>Rate (%)</label>
                                            <input type="number" value={c2Rate} onChange={e => setC2Rate(+e.target.value)} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Tenure (Yr)</label>
                                            <input type="number" value={c2Tenure} onChange={e => setC2Tenure(+e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={handleCalculate}>Calculate EMI</button>
                        <button className={styles.btnSecondary} onClick={() => { setResult(null); setAiInsight(''); }}><FaUndo /> Reset</button>
                    </div>

                    {result && (
                        <div className="animate-fade-in">
                            <ToolResult
                                title={result.main}
                                subTitle={result.subTitle}
                                extraStats={result.extraStats}
                                explanation={explanation}
                                toolName="EMI Calculator"
                            />

                            {/* ACTION BUTTONS: EXPORT & AI */}
                            <div className="flex flex-wrap gap-4 mt-6">
                                <button onClick={downloadPDF} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
                                    <FaFilePdf /> Download PDF
                                </button>

                                <button
                                    onClick={fetchAiInsight}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                                    disabled={loadingAi}
                                >
                                    <FaRobot /> {loadingAi ? 'Asking AI...' : 'Ask AI Help'}
                                </button>
                            </div>

                            {/* AI RESULT */}
                            {aiInsight && (
                                <div className="mt-6 p-6 bg-indigo-50 border border-indigo-100 rounded-xl relative">
                                    <div className="absolute -top-3 left-6 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        AI Financial Insight
                                    </div>
                                    <p className="text-gray-800 leading-relaxed font-medium">
                                        {aiInsight}
                                    </p>
                                </div>
                            )}

                        </div>
                    )}

                </div>

                {/* SEO CONTENT */}
                <article className={styles.seoContent}>
                    <h3>Advanced EMI Calculator</h3>
                    <p>
                        Use our free <strong>EMI Calculator</strong> to plan your loans effectively.
                        Compare different loan scenarios, understand reducing balance vs flat rate interest, and get AI-powered financial advice.
                    </p>
                    <div className={styles.faq}>
                        <details>
                            <summary>What is EMI?</summary>
                            <p>EMI stands for Equated Monthly Installment. It is a fixed payment made by a borrower to a lender at a specified date each month.</p>
                        </details>
                        <details>
                            <summary>How is EMI calculated?</summary>
                            <p>The mathematical formula for calculating EMI is: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is interest rate per month, and N is tenure in months.</p>
                        </details>
                        <details>
                            <summary>Reducing vs Flat Rate?</summary>
                            <p>Flat rate calculates interest on the full principal for the entire tenure. Reducing balance calculates interest only on the remaining loan amount, making it cheaper for the borrower.</p>
                        </details>
                    </div>
                </article>

            </div>

            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    <div className={styles.card}>
                        <AdSlot label="Advertisement" className="h-full mb-8" variant="clean" />
                        <RelatedTools currentToolSlug="emi-calculator" variant="clean" />
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { FaHome, FaUndo, FaChartLine, FaPercentage } from 'react-icons/fa';
import styles from './MortgageCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolResult from '@/components/tools/ToolResult';

const MODES = [
    { id: 1, name: 'Simple', desc: 'Basic monthly payment calculation.' },
    { id: 2, name: 'With Tax & Ins', desc: 'Include taxes, insurance, and HOA.' },
    { id: 3, name: 'FHA Loan', desc: 'FHA specifics with MIP.' },
    { id: 4, name: 'Payoff', desc: 'Calculate impact of extra payments.' },
    { id: 5, name: 'Compare', desc: 'Compare two loan scenarios.' },
];

export default function MortgageCalculator() {
    const { addToHistory } = useHistory();
    const [activeMode, setActiveMode] = useState(1);
    const [result, setResult] = useState<any>(null);
    const [explanation, setExplanation] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Common Inputs
    const [homePrice, setHomePrice] = useState(300000);
    const [downPayment, setDownPayment] = useState(60000);
    const [rate, setRate] = useState(6.5);
    const [term, setTerm] = useState(30);

    // Mode 2 Inputs
    const [propertyTax, setPropertyTax] = useState(3000); // Annual
    const [homeInsurance, setHomeInsurance] = useState(1200); // Annual
    const [hoa, setHoa] = useState(0); // Monthly

    // Mode 3 (FHA) Inputs - reusing some, plus MIP
    const [fhaMip, setFhaMip] = useState(1.75); // Upfront MIP %
    const [fhaAnnualMip, setFhaAnnualMip] = useState(0.55); // Annual MIP %

    // Mode 4 (Payoff)
    const [extraPayment, setExtraPayment] = useState(100);

    // Mode 5 (Compare) - Scenario 2
    const [c2Price, setC2Price] = useState(300000);
    const [c2Down, setC2Down] = useState(60000);
    const [c2Rate, setC2Rate] = useState(6.0);
    const [c2Term, setC2Term] = useState(15);

    // Currency State
    const [currency, setCurrency] = useState('USD');
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

    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => { setResult(null); setExplanation([]); }, [activeMode, currency]);

    if (!isMounted) return <div className="p-10 text-center">Loading Mortgage Calculator...</div>;

    // --- LOGIC ---
    const calculateMortgage = (p: number, r: number, nYears: number) => {
        const i = r / 100 / 12;
        const n = nYears * 12;
        if (i === 0) return p / n;
        return (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(val);

    const calculate = () => {
        setResult(null);
        setExplanation([]);
        let res: any = {};
        let steps: string[] = [];

        try {
            const principal = homePrice - downPayment;
            const monthlyPI = calculateMortgage(principal, rate, term);
            const curSym = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

            // MODE 1: SIMPLE
            if (activeMode === 1) {
                const totalPayment = monthlyPI * term * 12;
                const totalInterest = totalPayment - principal;

                res = {
                    main: formatCurrency(monthlyPI),
                    subTitle: 'Estimated Monthly Payment',
                    extraStats: [
                        { label: 'Principal', value: formatCurrency(principal) },
                        { label: 'Total Interest', value: formatCurrency(totalInterest) },
                        { label: 'Total Paid', value: formatCurrency(totalPayment) }
                    ]
                };

                steps.push(`<b>Loan Amount:</b> ${curSym}${homePrice} (price) - ${curSym}${downPayment} (down) = ${formatCurrency(principal)}`);
                steps.push(`<b>Rate per Month:</b> ${rate}% / 12 = ${(rate / 12).toFixed(4)}%`);
                steps.push(`<b>Number of Payments:</b> ${term} years * 12 = ${term * 12} months`);
                steps.push(`<b>Formula Result:</b> Monthly P&I = ${formatCurrency(monthlyPI)}`);
            }

            // MODE 2: TAX & INS
            else if (activeMode === 2) {
                const monthlyTax = propertyTax / 12;
                const monthlyIns = homeInsurance / 12;
                const totalMonthly = monthlyPI + monthlyTax + monthlyIns + hoa;

                res = {
                    main: formatCurrency(totalMonthly),
                    subTitle: 'Total Monthly Payment',
                    extraStats: [
                        { label: 'P&I', value: formatCurrency(monthlyPI) },
                        { label: 'Tax/Mo', value: formatCurrency(monthlyTax) },
                        { label: 'Ins/Mo', value: formatCurrency(monthlyIns) },
                        { label: 'HOA', value: formatCurrency(hoa) }
                    ]
                };

                steps.push(`<b>Principal & Interest:</b> ${formatCurrency(monthlyPI)}`);
                steps.push(`<b>Monthly Tax:</b> ${curSym}${propertyTax} / 12 = ${formatCurrency(monthlyTax)}`);
                steps.push(`<b>Monthly Insurance:</b> ${curSym}${homeInsurance} / 12 = ${formatCurrency(monthlyIns)}`);
                steps.push(`<b>Total:</b> Sum of all components = ${formatCurrency(totalMonthly)}`);
            }

            // MODE 3: FHA
            else if (activeMode === 3) {
                const upfrontMipAmt = principal * (fhaMip / 100);
                const baseLoan = principal + upfrontMipAmt;
                const monthlyBasePI = calculateMortgage(baseLoan, rate, term);
                const monthlyMip = (baseLoan * (fhaAnnualMip / 100)) / 12;
                const totalFHA = monthlyBasePI + monthlyMip + (propertyTax / 12) + (homeInsurance / 12);

                res = {
                    main: formatCurrency(totalFHA),
                    subTitle: 'FHA Monthly Payment',
                    extraStats: [
                        { label: 'Base P&I', value: formatCurrency(monthlyBasePI) },
                        { label: 'Mo MIP', value: formatCurrency(monthlyMip) },
                        { label: 'Upfront MIP', value: formatCurrency(upfrontMipAmt) },
                        { label: 'Tax/Ins', value: formatCurrency((propertyTax + homeInsurance) / 12) }
                    ]
                };
                steps.push(`<b>FHA Loan Amount:</b> ${curSym}${principal} + ${curSym}${upfrontMipAmt.toFixed(0)} (Upfront MIP) = ${curSym}${baseLoan.toFixed(0)}`);
                steps.push(`<b>Monthly P&I:</b> Calculated on ${curSym}${baseLoan.toFixed(0)} = ${formatCurrency(monthlyBasePI)}`);
                steps.push(`<b>Monthly MIP:</b> (${curSym}${baseLoan.toFixed(0)} * ${fhaAnnualMip}%) / 12 = ${formatCurrency(monthlyMip)}`);
            }

            // MODE 4: PAYOFF
            else if (activeMode === 4) {
                // Simple estimation: standard tenure vs tenure with extra payment
                // We'll iterate to find new n
                let balance = principal;
                let months = 0;
                const rMonthly = rate / 100 / 12;
                const regularPmt = monthlyPI;
                const acceleratedPmt = monthlyPI + extraPayment;
                let totalIntNormal = (monthlyPI * term * 12) - principal;
                let totalIntNew = 0;

                while (balance > 0 && months < 1000) {
                    const int = balance * rMonthly;
                    let pmt = acceleratedPmt;
                    if (balance + int < pmt) pmt = balance + int;
                    balance = balance + int - pmt;
                    totalIntNew += int;
                    months++;
                }

                const savings = totalIntNormal - totalIntNew;
                const yearsSaved = term - (months / 12);

                res = {
                    main: `${(months / 12).toFixed(1)} Years`,
                    subTitle: 'New Payoff Time',
                    extraStats: [
                        { label: 'Original Term', value: `${term} Years` },
                        { label: 'Interest Saved', value: formatCurrency(savings) },
                        { label: 'New Date', value: new Date(new Date().setMonth(new Date().getMonth() + months)).toLocaleDateString() }
                    ]
                };
                steps.push(`<b>Regular Payment:</b> ${formatCurrency(regularPmt)}`);
                steps.push(`<b>Extra Payment:</b> ${formatCurrency(extraPayment)} (Total: ${formatCurrency(acceleratedPmt)})`);
                steps.push(`<b>New Term:</b> Reduced from ${term} years to ${(months / 12).toFixed(1)} years`);
                steps.push(`<b>Savings:</b> You save ${formatCurrency(savings)} in interest!`);
            }

            // MODE 5: COMPARE
            else if (activeMode === 5) {
                const s1P = homePrice - downPayment;
                const s1PI = calculateMortgage(s1P, rate, term);
                const s1Total = s1PI * term * 12;

                const s2P = c2Price - c2Down;
                const s2PI = calculateMortgage(s2P, c2Rate, c2Term);
                const s2Total = s2PI * c2Term * 12;

                const diffMo = Math.abs(s1PI - s2PI);
                const diffTot = Math.abs(s1Total - s2Total);

                res = {
                    main: `${formatCurrency(diffMo)}/mo`,
                    subTitle: `Scenario ${s1PI < s2PI ? '1' : '2'} is cheaper`,
                    extraStats: [
                        { label: 'Scenario 1', value: `${formatCurrency(s1PI)}/mo` },
                        { label: 'Scenario 2', value: `${formatCurrency(s2PI)}/mo` },
                        { label: 'Total Diff', value: formatCurrency(diffTot) }
                    ]
                };
                steps.push(`<b>Scenario 1:</b> ${term}yr @ ${rate}% = ${formatCurrency(s1PI)}/mo`);
                steps.push(`<b>Scenario 2:</b> ${c2Term}yr @ ${c2Rate}% = ${formatCurrency(s2PI)}/mo`);
                steps.push(`<b>Comparison:</b> Scenario ${s1PI < s2PI ? '1' : '2'} is cheaper by ${formatCurrency(diffMo)}/mo.`);
            }

            setResult(res);
            setExplanation(steps);
            addToHistory({ toolName: `Mortgage Calc (${MODES[activeMode - 1].name})`, summary: res.main, url: '/tools/mortgage-calculator' });

        } catch (e) {
            console.error(e);
            alert("Calculation error. Verify inputs.");
        }
    };



    return (
        <div className={styles.pageGrid}>
            <div className={styles.mainColumn}>

                <div className="flex flex-col gap-4 mb-6">
                    {/* Line 1: Modes */}
                    <div className={styles.tabs}>
                        {MODES.map(m => (
                            <button key={m.id} className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`} onClick={() => setActiveMode(m.id)}>
                                {m.name}
                            </button>
                        ))}
                    </div>

                    {/* Line 2: Currency */}
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 w-fit">
                        <label className="text-sm font-bold text-gray-500 uppercase">Currency:</label>
                        <select
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            className="p-2 border border-gray-300 rounded font-bold bg-white text-black min-w-[200px]"
                        >
                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}><FaHome /> {MODES.find(m => m.id === activeMode)?.name}</h2>
                        <p className={styles.cardDesc}>{MODES.find(m => m.id === activeMode)?.desc}</p>
                    </div>

                    <div className={styles.inputSection}>
                        {/* COMMON INPUTS */}
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Home Price</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                                    <input type="number" value={homePrice} onChange={e => setHomePrice(+e.target.value)} />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Down Payment</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                                    <input type="number" value={downPayment} onChange={e => setDownPayment(+e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Interest Rate</label>
                                <div className={styles.inputWrapper}>
                                    <input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className={styles.hasSuffix} />
                                    <span className={styles.suffix}>%</span>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Loan Term</label>
                                <div className={styles.inputWrapper}>
                                    <input type="number" value={term} onChange={e => setTerm(+e.target.value)} className={styles.hasSuffix} />
                                    <span className={styles.suffix}>Years</span>
                                </div>
                            </div>
                        </div>

                        {/* MODE SPECIFIC */}
                        {(activeMode === 2 || activeMode === 3) && (
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Property Tax / Year</label>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                                        <input type="number" value={propertyTax} onChange={e => setPropertyTax(+e.target.value)} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Home Insurance / Year</label>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                                        <input type="number" value={homeInsurance} onChange={e => setHomeInsurance(+e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeMode === 2 && (
                            <div className={styles.inputGroup}>
                                <label>HOA Fees / Month</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                                    <input type="number" value={hoa} onChange={e => setHoa(+e.target.value)} />
                                </div>
                            </div>
                        )}
                        {activeMode === 4 && (
                            <div className={styles.inputGroup}>
                                <label>Extra Monthly Payment</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                                    <input type="number" value={extraPayment} onChange={e => setExtraPayment(+e.target.value)} />
                                </div>
                            </div>
                        )}
                        {activeMode === 5 && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Scenario 2</h3>
                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label>Price</label>
                                        <div className={styles.inputWrapper}><span className={styles.prefix}>{CURRENCIES.find(c => c.code === currency)?.symbol}</span><input type="number" value={c2Price} onChange={e => setC2Price(+e.target.value)} /></div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Rate</label>
                                        <input type="number" value={c2Rate} onChange={e => setC2Rate(+e.target.value)} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Term</label>
                                        <input type="number" value={c2Term} onChange={e => setC2Term(+e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={calculate}>Calculate</button>
                        <button className={styles.btnSecondary} onClick={() => setResult(null)}><FaUndo /> Reset</button>
                    </div>

                    {result && (
                        <ToolResult
                            title={result.main}
                            subTitle={result.subTitle}
                            details={result.details}
                            extraStats={result.extraStats}
                            explanation={explanation}
                            toolName={`Mortgage Calculator - ${MODES[activeMode - 1].name}`}
                            aiPrompt={`Mortgage Calculator Context (${MODES[activeMode - 1].name}).
                            Home Price: ${homePrice}, Rate: ${rate}%, Term: ${term} years.
                            Result: ${result.main}.
                            Breakdown: ${result.extraStats?.map((s: any) => s.label + ': ' + s.value).join(', ')}.
                            Provide a financial insight or savings tip about this mortgage scenario.`}
                        />
                    )}
                </div>

                {/* SEO CONTENT */}
                <article className={styles.seoContent}>
                    <h3>Mortgage Calculator</h3>
                    <p>
                        Our free <strong>Mortgage Calculator</strong> goes beyond the basics.
                        Calculate your monthly payments with taxes, insurance, and HOA fees included.
                        Whether you are looking for an FHA loan or planning to pay off your mortgage early, this tool gives you the exact numbers you need.
                    </p>
                    <div className={styles.faq}>
                        <details>
                            <summary>How does a mortgage calculator work?</summary>
                            <p>It uses the loan amount, interest rate, and term to calculate your monthly principal and interest payment using the standard amortization formula.</p>
                        </details>
                        <details>
                            <summary>Is this mortgage calculator free?</summary>
                            <p>Yes, it is 100% free and supports advanced modes like FHA and Payoff calculations.</p>
                        </details>
                        <details>
                            <summary>Can I calculate FHA mortgage?</summary>
                            <p>Absolutely. Switch to "FHA Loan" mode to include Upfront and Annual MIP automatically.</p>
                        </details>
                        <details>
                            <summary>Can I calculate payoff early?</summary>
                            <p>Yes, use the "Payoff" mode to see how much interest and time you save by making extra payments.</p>
                        </details>
                    </div>
                </article>

                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Mortgage Calculator",
                        "applicationCategory": "FinanceApplication",
                        "featureList": "Mortgage Payment, FHA Loan, Payoff Calculator, Taxes and Insurance"
                    })
                }} />
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.stickyAd}>
                    <div className={styles.card}>
                        <AdSlot label="Advertisement" className="h-full mb-8" variant="clean" />
                        <RelatedTools currentToolSlug="mortgage-calculator" variant="clean" />
                    </div>
                </div>
            </div>
        </div>
    );
}

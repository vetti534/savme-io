'use client';

import React, { useState, useEffect } from 'react';
import { FaCalculator, FaUndo, FaFilePdf, FaRobot, FaPercentage } from 'react-icons/fa';
import styles from './GSTCalculator.module.css';
import { useHistory } from '@/context/HistoryContext';
import AdSlot from '@/components/ads/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolResult from '@/components/tools/ToolResult';
import { generateToolInsight } from '@/actions/tools/ai-insight';

const MODES = [
  { id: 1, name: 'Add GST', desc: 'Calculate Inclusive Price (Base + GST)' },
  { id: 2, name: 'Remove GST', desc: 'Calculate Exclusive Price (Total - GST)' },
  { id: 3, name: 'India Split', desc: 'CGST, SGST, IGST Breakdown' },
  { id: 4, name: 'Global Tax', desc: 'Calculate VAT/Sales Tax for any Country' },
  { id: 5, name: 'Presets', desc: 'One-click GST Calculation' },
];

const PRESET_RATES = [5, 12, 18, 28];

export default function GSTCalculator() {
  const { addToHistory } = useHistory();
  const [activeMode, setActiveMode] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [explanation, setExplanation] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // AI State
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Inputs
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [indiaTxType, setIndiaTxType] = useState('intra'); // intra | inter
  const [country, setCountry] = useState('USD'); // Using CURRENCY codes for simplicity

  const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'USA (Dollar)' },
    { code: 'INR', symbol: '₹', name: 'India (Rupee)' },
    { code: 'EUR', symbol: '€', name: 'Europe (Euro)' },
    { code: 'GBP', symbol: '£', name: 'UK (Pound)' },
    { code: 'AUD', symbol: 'A$', name: 'Australia (Dollar)' },
    { code: 'CAD', symbol: 'C$', name: 'Canada (Dollar)' },
  ];

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    setResult(null);
    setExplanation([]);
    setAiInsight('');
  }, [activeMode, amount, rate, indiaTxType, country]);

  if (!isMounted) return <div className="p-10 text-center">Loading GST Calculator...</div>;

  const formatCurrency = (val: number, curCode = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curCode }).format(val);
  };

  const handleCalculate = (overrideRate?: number) => {
    setResult(null);
    setExplanation([]);
    setAiInsight('');

    const r = overrideRate !== undefined ? overrideRate : rate;
    if (overrideRate !== undefined) setRate(overrideRate);

    let res: any = {};
    let steps: string[] = [];
    const curCode = activeMode === 4 ? country : 'INR'; // Default to INR for most, Global uses selection
    const curSym = CURRENCIES.find(c => c.code === curCode)?.symbol || (activeMode === 4 ? '' : '₹');

    try {
      // MODE 1: ADD GST
      if (activeMode === 1 || activeMode === 5) {
        const gstAmt = (amount * r) / 100;
        const total = amount + gstAmt;

        res = {
          main: formatCurrency(total, curCode),
          subTitle: 'Total Inclusive Amount',
          extraStats: [
            { label: 'Base Amount', value: formatCurrency(amount, curCode) },
            { label: 'GST Amount', value: formatCurrency(gstAmt, curCode) },
            { label: 'GST Rate', value: `${r}%` },
          ]
        };
        steps = [
          `<b>Formula:</b> GST Amount = (Base Amount x Rate) / 100`,
          `> GST = (${amount} x ${r}) / 100 = ${gstAmt.toFixed(2)}`,
          `<b>Total:</b> Base + GST`,
          `> Total = ${amount} + ${gstAmt.toFixed(2)} = <b>${total.toFixed(2)}</b>`
        ];
      }

      // MODE 2: REMOVE GST
      else if (activeMode === 2) {
        const base = (amount * 100) / (100 + r);
        const gstAmt = amount - base;

        res = {
          main: formatCurrency(base, curCode),
          subTitle: 'Base Amount (Pre-Tax)',
          extraStats: [
            { label: 'Total Amount', value: formatCurrency(amount, curCode) },
            { label: 'GST Component', value: formatCurrency(gstAmt, curCode) },
            { label: 'GST Rate', value: `${r}%` },
          ]
        };
        steps = [
          `<b>Formula:</b> Base Amount = (Total x 100) / (100 + Rate)`,
          `> Base = (${amount} x 100) / (100 + ${r})`,
          `> Base = ${amount * 100} / ${100 + r} = <b>${base.toFixed(2)}</b>`,
          `<b>GST Value:</b> Total - Base`,
          `> GST = ${amount} - ${base.toFixed(2)} = ${gstAmt.toFixed(2)}`
        ];
      }

      // MODE 3: INDIA SPLIT
      else if (activeMode === 3) {
        const gstAmt = (amount * r) / 100;
        const total = amount + gstAmt;
        const isIntra = indiaTxType === 'intra';

        res = {
          main: formatCurrency(total, 'INR'),
          subTitle: 'Total with Tax Breakdown',
          extraStats: [
            { label: 'Base', value: formatCurrency(amount, 'INR') },
            { label: 'Total GST', value: formatCurrency(gstAmt, 'INR') },
          ]
        };

        if (isIntra) {
          res.extraStats.push({ label: 'CGST', value: formatCurrency(gstAmt / 2, 'INR') });
          res.extraStats.push({ label: 'SGST', value: formatCurrency(gstAmt / 2, 'INR') });
        } else {
          res.extraStats.push({ label: 'IGST', value: formatCurrency(gstAmt, 'INR') });
        }

        steps = [
          `<b>Calculation:</b> GST (${r}%) on ${formatCurrency(amount, 'INR')} is ${formatCurrency(gstAmt, 'INR')}`,
          `<b>Tax Type:</b> ${isIntra ? 'Intra-State (Same State)' : 'Inter-State (Different State)'}`,
          isIntra
            ? `> <b>CGST (${r / 2}%):</b> ${formatCurrency(gstAmt / 2, 'INR')} (Central Gov)`
            : `> <b>IGST (${r}%):</b> ${formatCurrency(gstAmt, 'INR')} (Integrated Tax)`,
          isIntra
            ? `> <b>SGST (${r / 2}%):</b> ${formatCurrency(gstAmt / 2, 'INR')} (State Gov)`
            : null
        ].filter(Boolean) as string[];
      }

      // MODE 4: GLOBAL TAX
      else if (activeMode === 4) {
        const taxAmt = (amount * r) / 100;
        const total = amount + taxAmt;

        res = {
          main: formatCurrency(total, country),
          subTitle: 'Total Payable Amount',
          extraStats: [
            { label: 'Tax Amount', value: formatCurrency(taxAmt, country) },
            { label: 'Original', value: formatCurrency(amount, country) },
          ]
        };
        steps = [
          `<b>Tax Calculation for ${CURRENCIES.find(c => c.code === country)?.name}:</b>`,
          `> Base Amount: ${formatCurrency(amount, country)}`,
          `> Tax Rate: ${r}%`,
          `> Tax Value: ${formatCurrency(taxAmt, country)}`,
          `> <b>Final Total:</b> ${formatCurrency(total, country)}`
        ];
      }

      setResult(res);
      setExplanation(steps);
      addToHistory({ toolName: `GST Calculator (${MODES[activeMode - 1].name})`, summary: res.main, url: '/tools/gst-calculator' });

    } catch (e) {
      console.error(e);
      alert("Error in calculation");
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const curDate = new Date().toLocaleString();

    doc.setFontSize(22);
    doc.text("GST Calculator - Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${curDate}`, 14, 28);
    doc.text("savme.io", 180, 20);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(14);
    doc.text("Input Details", 14, 45);
    doc.setFontSize(11);
    doc.text(`Base Amount: ${amount}`, 14, 55);
    doc.text(`Tax Rate: ${rate}%`, 14, 61);
    doc.text(`Mode: ${MODES[activeMode - 1].name}`, 14, 67);

    doc.setFontSize(14);
    doc.text("Result", 14, 85);
    doc.setFontSize(16);
    doc.text(`Final Value: ${result.main}`, 14, 95);

    let y = 105;
    doc.setFontSize(11);
    result.extraStats.forEach((s: any) => {
      doc.text(`${s.label}: ${s.value}`, 14, y);
      y += 6;
    });

    doc.line(14, y + 5, 196, y + 5);
    doc.text("Explanation", 14, y + 15);
    y += 25;
    doc.setFontSize(10);
    explanation.forEach(step => {
      const clean = step.replace(/<\/?[^>]+(>|$)/g, "");
      doc.text(clean, 14, y);
      y += 6;
    });

    doc.save(`GST-Report-${Date.now()}.pdf`);
  };

  const fetchAiInsight = async () => {
    if (!result) return;
    setLoadingAi(true);
    const prompt = `
            Act as a tax expert. Analyze this GST calculation:
            Base: ${amount}, Rate: ${rate}%, Result: ${result.main}.
            Mode: ${MODES[activeMode - 1].name}.
            Explain simply how this tax affects the final price. 
            For India, mention HSN codes briefly if relevant.
            Keep it under 3 sentences, very friendly.
        `;
    const text = await generateToolInsight(prompt);
    setAiInsight(text);
    setLoadingAi(false);
  };

  return (
    <div className={styles.pageGrid}>
      <div className={styles.mainColumn}>

        <div className={styles.tabs}>
          {MODES.map(m => (
            <button key={m.id} className={`${styles.tab} ${activeMode === m.id ? styles.activeTab : ''}`} onClick={() => setActiveMode(m.id)}>
              {m.name}
            </button>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><FaCalculator /> {MODES.find(m => m.id === activeMode)?.name}</h2>
            <p className={styles.cardDesc}>{MODES.find(m => m.id === activeMode)?.desc}</p>
          </div>

          {activeMode === 5 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {PRESET_RATES.map(r => (
                <button key={r} onClick={() => handleCalculate(r)} className="p-4 bg-black text-white rounded-xl text-xl font-bold hover:scale-105 transition shadow-lg">
                  {r}% GST
                </button>
              ))}
            </div>
          )}

          {activeMode !== 5 && (
            <div className={styles.inputSection}>
              {/* GLOBAL COUNTRY SELECTOR */}
              {activeMode === 4 && (
                <div className={styles.inputGroup}>
                  <label>Select Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="p-3 border rounded text-lg font-bold">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
                  </select>
                </div>
              )}

              {/* COMMON INPUTS */}
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>{activeMode === 2 ? 'Total Amount (Inclusive)' : 'Base Amount'}</label>
                  <div className={styles.inputWrapper}>
                    <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Tax Percentage (%)</label>
                  <input type="number" value={rate} onChange={e => setRate(+e.target.value)} />
                </div>
              </div>

              {/* INDIA MODE SPECIFIC */}
              {activeMode === 3 && (
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input type="radio" checked={indiaTxType === 'intra'} onChange={() => setIndiaTxType('intra')} /> Intra-State (Same State)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input type="radio" checked={indiaTxType === 'inter'} onChange={() => setIndiaTxType('inter')} /> Inter-State (Different State)
                  </label>
                </div>
              )}
            </div>
          )}

          {activeMode !== 5 && (
            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={() => handleCalculate()}>Calculate</button>
              <button className={styles.btnSecondary} onClick={() => { setResult(null); setAiInsight(''); }}><FaUndo /> Reset</button>
            </div>
          )}

          {result && (
            <div className="animate-fade-in relative">
              <ToolResult
                title={result.main}
                subTitle={result.subTitle}
                extraStats={result.extraStats}
                explanation={explanation}
                toolName="GST Calculator"
              />

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

              {aiInsight && (
                <div className="mt-6 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <h4 className="flex items-center gap-2 font-bold text-indigo-800 mb-2"><FaRobot /> AI Expert says:</h4>
                  <p className="text-gray-800 leading-relaxed font-medium">{aiInsight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <article className={styles.seoContent}>
          <h3>About GST Calculator</h3>
          <p>
            Our <strong>GST Calculator</strong> helps you find the correct tax amount whether you are adding GST to a price or removing it.
            Support for GST (India), VAT (Global), and Sales Tax calculations.
          </p>
          <div className={styles.faq}>
            <details>
              <summary>How to calculate GST?</summary>
              <p>To add GST: Price * (1 + Rate/100). To remove GST: Price - [Price * (100 / (100+Rate))].</p>
            </details>
            <details>
              <summary>What is CGST, SGST, IGST?</summary>
              <p>CGST (Central) and SGST (State) apply on intra-state sales. IGST (Integrated) applies on inter-state sales. Total tax remains the same.</p>
            </details>
          </div>
        </article>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.stickyAd}>
          <div className={styles.card}>
            <AdSlot label="Advertisement" className="h-full mb-8" variant="clean" />
            <RelatedTools currentToolSlug="gst-calculator" variant="clean" />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './GSTCalculator.module.css';

type TaxType = 'exclusive' | 'inclusive';
type SupplyType = 'intra' | 'inter';

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [taxType, setTaxType] = useState<TaxType>('exclusive');
  const [supplyType, setSupplyType] = useState<SupplyType>('intra');

  // Calculation Results
  const [netAmount, setNetAmount] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cgst, setCgst] = useState<number>(0);
  const [sgst, setSgst] = useState<number>(0);
  const [igst, setIgst] = useState<number>(0);

  const calculateGST = () => {
    if (amount <= 0 || rate < 0) return;

    let base = 0;
    let tax = 0;
    let total = 0;

    if (taxType === 'exclusive') {
      base = amount;
      tax = (amount * rate) / 100;
      total = base + tax;
    } else {
      // Inclusive: Total = Base + Base * (Rate/100) = Base * (1 + Rate/100)
      // Base = Total / (1 + Rate/100)
      base = amount / (1 + rate / 100);
      total = amount;
      tax = total - base;
    }

    setNetAmount(Number(base.toFixed(2)));
    setGstAmount(Number(tax.toFixed(2)));
    setTotalAmount(Number(total.toFixed(2)));

    if (supplyType === 'intra') {
      setCgst(Number((tax / 2).toFixed(2)));
      setSgst(Number((tax / 2).toFixed(2)));
      setIgst(0);
    } else {
      setCgst(0);
      setSgst(0);
      setIgst(Number(tax.toFixed(2)));
    }
  };



  // Re-run effect when dependencies change
  // Note: The previous logic inside useState only runs once. Using useEffect.
  const isFirstRun = useRef(true);
  if (isFirstRun.current) {
    // Initial Calc
    calculateGST();
    isFirstRun.current = false;
  }

  // Use effect to recalculate when inputs change
  // We can't use useEffect easily with safe server rendering without 'use client', which we have.
  // But standard practice is useEffect.
  // Converting to useEffect:

  // Actually, better to just call calculateGST in useEffect

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('GST Invoice Estimate', 14, 20);

    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Description', 'Value']],
      body: [
        ['Supply Type', supplyType === 'intra' ? 'Intra-State (Within State)' : 'Inter-State (Across State)'],
        ['GST Rate', `${rate}%`],
        ['Calculation Mode', taxType === 'exclusive' ? 'Exclusive of Tax' : 'Inclusive of Tax'],
        ['Base Amount', `Rs. ${netAmount.toFixed(2)}`],
        ['Total Tax', `Rs. ${gstAmount.toFixed(2)}`],
        ['Total Amount', `Rs. ${totalAmount.toFixed(2)}`],
      ],
      theme: 'grid',
    });

    const breakdown = supplyType === 'intra'
      ? [['CGST', `${rate / 2}%`, `Rs. ${cgst.toFixed(2)}`], ['SGST', `${rate / 2}%`, `Rs. ${sgst.toFixed(2)}`]]
      : [['IGST', `${rate}%`, `Rs. ${igst.toFixed(2)}`]];

    doc.text('Tax Breakdown:', 14, (doc as any).lastAutoTable.finalY + 10);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Component', 'Rate', 'Amount']],
      body: breakdown,
      theme: 'striped'
    });

    doc.save('gst-invoice.pdf');
  };

  // Replace the useState initial calc hack with proper useEffect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _ensureCalc = () => { calculateGST(); };

  // We need to trigger calculation on change.
  // Let's attach calculateGST to the inputs directly or use a LayoutEffect/Effect


  useEffect(() => {
    calculateGST();
  }, [amount, rate, taxType, supplyType]);


  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label>Amount</label>
            <div className={styles.inputWrapper}>
              <span>₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div className={styles.toggleRow}>
              <button
                className={taxType === 'exclusive' ? styles.activeToggle : styles.toggle}
                onClick={() => setTaxType('exclusive')}
              >
                Specific Amount (Excl. Gst)
              </button>
              <button
                className={taxType === 'inclusive' ? styles.activeToggle : styles.toggle}
                onClick={() => setTaxType('inclusive')}
              >
                Final Amount (Incl. GST)
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>GST Rate (%)</label>
            <div className={styles.presets}>
              {[3, 5, 12, 18, 28].map(val => (
                <button
                  key={val}
                  onClick={() => setRate(val)}
                  className={rate === val ? styles.activePreset : ''}
                >
                  {val}%
                </button>
              ))}
              <div className={styles.customRate}>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  placeholder="Custom"
                />
                <span>%</span>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Supply Type</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  checked={supplyType === 'intra'}
                  onChange={() => setSupplyType('intra')}
                />
                <span>Intra-State (Same State)</span>
                <small>CGST + SGST</small>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  checked={supplyType === 'inter'}
                  onChange={() => setSupplyType('inter')}
                />
                <span>Inter-State (Different State)</span>
                <small>IGST Only</small>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.resultHeader}>
            <span>Result Preview</span>
          </div>

          <div className={styles.resultTable}>
            <div className={styles.resultRow}>
              <span>Net Amount (Base)</span>
              <span>₹ {netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span>Total GST</span>
              <span className={styles.taxValue}>+ ₹ {gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            {supplyType === 'intra' ? (
              <>
                <div className={`${styles.resultRow} ${styles.subTax}`}>
                  <span>CGST ({rate / 2}%)</span>
                  <span>₹ {cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className={`${styles.resultRow} ${styles.subTax}`}>
                  <span>SGST ({rate / 2}%)</span>
                  <span>₹ {sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            ) : (
              <div className={`${styles.resultRow} ${styles.subTax}`}>
                <span>IGST ({rate}%)</span>
                <span>₹ {igst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className={`${styles.resultRow} ${styles.total}`}>
              <span>Total Amount</span>
              <span>₹ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button className={styles.printBtn} onClick={downloadInvoice}>
            📄 Download Invoice (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

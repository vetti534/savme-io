'use client';

import { useState, useEffect } from 'react';
import styles from './AutoLoanCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function AutoLoanCalculator() {
    const [price, setPrice] = useState<number>(30000);
    const [downPayment, setDownPayment] = useState<number>(5000);
    const [tradeIn, setTradeIn] = useState<number>(0);
    const [taxRate, setTaxRate] = useState<number>(7);
    const [interestRate, setInterestRate] = useState<number>(6.5);
    const [months, setMonths] = useState<number>(60);

    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [loanAmount, setLoanAmount] = useState<number>(0);

    useEffect(() => {
        calculateAutoLoan();
    }, [price, downPayment, tradeIn, taxRate, interestRate, months]);

    const calculateAutoLoan = () => {
        if (price < 0 || months <= 0) return;

        // Sales Tax usually on the full price (simplified) or Price - TradeIn in some states.
        // Let's assume Tax on (Price - TradeIn) to be conservative/fair for most generic calcs
        const taxableAmount = Math.max(0, price - tradeIn);
        const taxAmount = (taxableAmount * taxRate) / 100;

        const principal = price + taxAmount - downPayment - tradeIn;

        if (principal <= 0) {
            setMonthlyPayment(0);
            setTotalInterest(0);
            setTotalCost(price + taxAmount);
            setLoanAmount(0);
            return;
        }

        const r = interestRate / 100 / 12;
        const n = months;

        let pmt = 0;
        if (interestRate === 0) {
            pmt = principal / n;
        } else {
            pmt = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totPay = pmt * n;
        const totInt = totPay - principal;

        setLoanAmount(Math.round(principal));
        setMonthlyPayment(Math.ceil(pmt));
        setTotalInterest(Math.round(totInt));
        setTotalCost(Math.round(totPay + downPayment + tradeIn));
        // Total Cost of CAR = Loan Payments + Down + TradeIn Value
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Vehicle Price</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Down Payment</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Trade-In Value</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={tradeIn}
                                onChange={(e) => setTradeIn(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Sales Tax (%)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Interest Rate (%)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                            />
                            <span>%</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Loan Term (Months)</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                            />
                            <span>Mo</span>
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`₹ ${monthlyPayment.toLocaleString()}`}
                        subTitle="Monthly Payment"
                        toolName="Auto Loan Calculator"
                        extraStats={[
                            { label: 'Loan Amount', value: `₹ ${loanAmount.toLocaleString()}` },
                            { label: 'Total Interest', value: `₹ ${totalInterest.toLocaleString()}` },
                            { label: 'Total Cost', value: `₹ ${totalCost.toLocaleString()}` },
                        ]}
                        aiPrompt={`Auto Loan Analysis. Price: ${price}, Rate: ${interestRate}%, Term: ${months} months. Monthly: ${monthlyPayment}. Is this a good deal?`}
                    />
                </div>
            </div>
        </div>
    );
}

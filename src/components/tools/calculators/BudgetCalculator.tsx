'use client';

import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './BudgetCalculator.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

type Expense = {
    id: string;
    category: string;
    amount: number;
    type: 'need' | 'want' | 'savings';
};

const DEFAULT_EXPENSES: Expense[] = [
    { id: '1', category: 'Housing (Rent/EMI)', amount: 15000, type: 'need' },
    { id: '2', category: 'Groceries & Food', amount: 8000, type: 'need' },
    { id: '3', category: 'Transportation', amount: 3000, type: 'need' },
    { id: '4', category: 'Utilities (Elec, Net)', amount: 2000, type: 'need' },
    { id: '5', category: 'Insurance & Medical', amount: 1500, type: 'need' },
    { id: '6', category: 'Dining Out & Ent.', amount: 4000, type: 'want' },
    { id: '7', category: 'Shopping', amount: 3000, type: 'want' },
    { id: '8', category: 'Investments / Savings', amount: 5000, type: 'savings' },
];

export default function BudgetCalculator() {
    const [income, setIncome] = useState<number>(50000);
    const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
    const [newCategory, setNewCategory] = useState('');

    // Stats
    const [totalNeed, setTotalNeed] = useState(0);
    const [totalWant, setTotalWant] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        calculateStats();
    }, [income, expenses]);

    const calculateStats = () => {
        let tNeed = 0, tWant = 0, tSave = 0;

        expenses.forEach(e => {
            if (e.type === 'need') tNeed += e.amount;
            else if (e.type === 'want') tWant += e.amount;
            else tSave += e.amount;
        });

        setTotalNeed(tNeed);
        setTotalWant(tWant);
        setTotalSavings(tSave);
        const total = tNeed + tWant + tSave;
        setTotalExpense(total);
        setBalance(income - total);
    };

    const handleExpenseChange = (id: string, field: 'amount' | 'category' | 'type', value: any) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const addExpense = () => {
        if (!newCategory.trim()) return;
        const newExp: Expense = {
            id: Date.now().toString(),
            category: newCategory,
            amount: 0,
            type: 'want'
        };
        setExpenses([...expenses, newExp]);
        setNewCategory('');
    };

    const removeExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    };

    const apply503020 = () => {
        // Suggestion: This sets expenses to match the rule exactly? 
        // Or just sets INCOME allocation?
        // Let's reset expenses to a template aimed at 50/30/20 
        const needs = income * 0.5;
        const wants = income * 0.3;
        const savings = income * 0.2;

        setExpenses([
            { id: '1', category: 'Essential Needs (Housing, Food)', amount: needs, type: 'need' },
            { id: '2', category: 'Wants & Lifestyle', amount: wants, type: 'want' },
            { id: '3', category: 'Savings & Investments', amount: savings, type: 'savings' },
        ]);
    };

    const chartData = {
        labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
        datasets: [
            {
                data: [totalNeed, totalWant, totalSavings],
                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                borderWidth: 0,
            },
        ],
    };

    // Real percentages
    const pNeed = Math.round((totalNeed / income) * 100) || 0;
    const pWant = Math.round((totalWant / income) * 100) || 0;
    const pSave = Math.round((totalSavings / income) * 100) || 0;

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Monthly Budget Plan', 14, 15);
        doc.setFontSize(10);
        doc.text(`Monthly Income: ₹${income}`, 14, 25);
        doc.text(`Total Expenses: ₹${totalExpense}`, 14, 30);
        doc.text(`Balance: ₹${balance}`, 14, 35);

        const tableData = expenses.map(e => [e.category, e.type.toUpperCase(), `Rs. ${e.amount}`]);

        autoTable(doc, {
            startY: 45,
            head: [['Category', 'Type', 'Amount']],
            body: tableData,
        });

        doc.save('my-monthly-budget.pdf');
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.incomeCard}>
                    <label>Monthly Net Income</label>
                    <div className={styles.inputWrapper}>
                        <span>₹</span>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                        />
                    </div>
                    <button className={styles.presetBtn} onClick={apply503020}>
                        Apply 50/30/20 Rule
                    </button>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.chartContainer}>
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: '#3b82f6' }}></span>
                            <span>Needs: {pNeed}% <small>(Target: 50%)</small></span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: '#f59e0b' }}></span>
                            <span>Wants: {pWant}% <small>(Target: 30%)</small></span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: '#10b981' }}></span>
                            <span>Savings: {pSave}% <small>(Target: 20%)</small></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.balanceBar}>
                <div className={styles.balanceItem}>
                    <span>Total Expenses</span>
                    <strong>₹ {totalExpense.toLocaleString()}</strong>
                </div>
                <div className={styles.balanceItem}>
                    <span>Remaining Balance</span>
                    <strong style={{ color: balance >= 0 ? '#10b981' : '#ef4444' }}>
                        ₹ {balance.toLocaleString()}
                    </strong>
                </div>
            </div>

            <div className={styles.expensesSection}>
                <h3>Expense Distribution</h3>
                <div className={styles.tableHead}>
                    <span>Category</span>
                    <span>Type</span>
                    <span>Amount</span>
                    <span>Action</span>
                </div>

                <div className={styles.expenseList}>
                    {expenses.map(exp => (
                        <div key={exp.id} className={styles.expenseRow}>
                            <input
                                type="text"
                                value={exp.category}
                                onChange={(e) => handleExpenseChange(exp.id, 'category', e.target.value)}
                                className={styles.catInput}
                            />

                            <select
                                value={exp.type}
                                onChange={(e) => handleExpenseChange(exp.id, 'type', e.target.value)}
                                className={styles.typeSelect}
                            >
                                <option value="need">Need</option>
                                <option value="want">Want</option>
                                <option value="savings">Savings</option>
                            </select>

                            <div className={styles.amountInput}>
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={exp.amount}
                                    onChange={(e) => handleExpenseChange(exp.id, 'amount', Number(e.target.value))}
                                />
                            </div>

                            <button onClick={() => removeExpense(exp.id)} className={styles.delBtn}>×</button>
                        </div>
                    ))}
                </div>

                <div className={styles.addSection}>
                    <input
                        type="text"
                        placeholder="Add new category..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addExpense()}
                    />
                    <button onClick={addExpense}>+ Add</button>
                </div>

                <button className={styles.downloadBtn} onClick={downloadPDF}>
                    Download Budget PDF
                </button>
            </div>
        </div>
    );
}

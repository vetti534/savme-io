'use client';

import { useState, useEffect } from 'react';
import styles from './DiscountCalculator.module.css';
import ToolResult from '@/components/tools/ToolResult';

export default function DiscountCalculator() {
    const [originalPrice, setOriginalPrice] = useState<number>(1000);
    const [discount, setDiscount] = useState<number>(20);
    const [discountType, setDiscountType] = useState<'%'>('%');

    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [savedAmount, setSavedAmount] = useState<number>(0);

    useEffect(() => {
        calculateDiscount();
    }, [originalPrice, discount, discountType]);

    const calculateDiscount = () => {
        if (originalPrice < 0 || discount < 0) return;

        let saved = 0;
        if (discountType === '%') {
            saved = (originalPrice * discount) / 100;
        } else {
            // Fixed amount off
            saved = discount;
        }

        let final = originalPrice - saved;
        if (final < 0) final = 0;

        setSavedAmount(parseFloat(saved.toFixed(2)));
        setFinalPrice(parseFloat(final.toFixed(2)));
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>

                    <div className={styles.inputGroup}>
                        <label>Original Price</label>
                        <div className={styles.inputWrapper}>
                            <span>₹</span>
                            <input
                                type="number"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Discount</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                            />
                            {/* Simple toggle for context if we add fixed later, for now just % or allow inputs? 
                                 Let's stick to % as primary for "Discount Calc", but some prefer fixed off.
                                 Let's make the span clickable or just % for now.
                             */}
                            <span>%</span>
                        </div>
                    </div>

                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`₹ ${finalPrice.toLocaleString()}`}
                        subTitle="Final Price"
                        toolName="Discount Calculator"
                        extraStats={[
                            { label: 'You Save', value: `₹ ${savedAmount.toLocaleString()}` },
                            { label: 'Original', value: `₹ ${originalPrice.toLocaleString()}` },
                        ]}
                        aiPrompt={`Discount Analysis. Original: ${originalPrice}, Discount: ${discount}%.`}
                    />
                </div>
            </div>
        </div>
    );
}

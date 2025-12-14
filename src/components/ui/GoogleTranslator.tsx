'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GoogleTranslator = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Define generic callback for Google Translate
        // @ts-ignore
        window.googleTranslateElementInit = () => {
            // @ts-ignore
            if (window.google && window.google.translate) {
                // @ts-ignore
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        layout: 0, // 0 = Vertical
                        autoDisplay: true,
                    },
                    'google_translate_element'
                );
            }
        };
    }, []);

    if (!mounted) return null;

    return (
        <div className="google-translate-wrapper">
            <div id="google_translate_element"></div>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="lazyOnload"
            />
        </div>
    );
};

export default GoogleTranslator;

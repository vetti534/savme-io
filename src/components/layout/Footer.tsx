import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.grid}>
                    <div>
                        <h3 className={styles.title}>SavMe.io</h3>
                        <p className={styles.description}>
                            Professional online tools for everyone. Fast, free, and secure.
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.subtitle}>Tools</h4>
                        <ul className={styles.list}>
                            <li><Link href="/categories/pdf-tools">PDF Tools</Link></li>
                            <li><Link href="/categories/calculators">Calculators</Link></li>
                            <li><Link href="/categories/image-tools">Image Tools</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.subtitle}>Company</h4>
                        <ul className={styles.list}>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} SavMe.io. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

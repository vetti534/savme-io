import styles from './TrustSection.module.css';

const TRUST_ITEMS = [
    { title: 'Super Fast Tools', icon: '⚡' },
    { title: '100% Free & Unlimited', icon: '💎' },
    { title: 'No Signup Required', icon: '🔓' },
    { title: 'Secure & Private', icon: '🛡️' },
    { title: 'Multi-Language Support', icon: '🌍' }
];

export default function TrustSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Why SavMe.io?</h2>
                <div className={styles.grid}>
                    {TRUST_ITEMS.map((item, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.icon}>{item.icon}</div>
                            <h3 className={styles.title}>{item.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

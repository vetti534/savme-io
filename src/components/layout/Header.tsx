import Link from 'next/link';
import Search from '../ui/Search';
import styles from './Header.module.css';
import GoogleTranslator from '../ui/GoogleTranslator';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.boxContainer}`}>

        {/* Left: Logo & Nav */}
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <span>SAV</span>ME.IO
          </Link>

          <nav className={styles.nav}>
            <Link href="/all-tools" className={styles.link}>ALL TOOLS</Link>
            <Link href="/pdf-tools" className={styles.link}>PDF TOOLS</Link>
            <Link href="/financial-calculators" className={styles.link}>CALCULATORS</Link>
            <Link href="/image-tools" className={styles.link}>IMAGE TOOLS</Link>
          </nav>
        </div>

        {/* Right: Search & Login */}
        <div className={styles.right}>
          <Search />
          {/* Removed Login/Signup for cleanliness as per previous instructions or keep them? User reverted them back in. */}
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/signup" className={styles.signupBtn}>Sign up</Link>
          <div className={styles.translatorWrapper}>
            <GoogleTranslator />
          </div>
        </div>
      </div>
    </header>
  );
}

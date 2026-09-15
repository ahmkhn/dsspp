import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/components/site.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand} aria-label="DSSP home">
          <span className={styles.brandMark} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 16h24M7 8.5c5 3 13 3 18 0M7 23.5c5-3 13-3 18 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span className={styles.brandName}>DSSP<span className={styles.brandDot}>.</span></span>
          <span className={styles.brandDescriptor}>A world of<br />shared perspectives</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/about" className={styles.navAbout}>About<span className={styles.navAboutSuffix}> DSSP</span></Link>
          <Link href="/map" className={styles.navExplore}>
            Explore the map <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/components/site.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div><Link href="/" className={styles.footerBrand}>DSSP<span>.</span></Link><p>Decolonizing Social Sciences in Pakistan.</p></div>
        <div className={styles.footerMeta}>
          <p>Built for a world of shared perspectives.</p>
          <p>Developed by <a href="https://www.linkedin.com/in/ahmkh" target="_blank" rel="noreferrer">Ahmed Khan <ArrowUpRight size={12} aria-hidden="true" /></a></p>
        </div>
      </div>
    </footer>
  );
}

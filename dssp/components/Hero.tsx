import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Globe2, MapPin } from "lucide-react";
import styles from "./site.module.css";

export function HeroHighlightDemo() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span /> Rooted in Pakistan. Connected globally.</p>
        <h1 id="hero-heading">Local perspectives.<br /><span>Global connections.</span></h1>
        <p className={styles.heroDescription}>
          Decolonizing Social Sciences in Pakistan.<br className={styles.desktopBreak} />
          A shared space to discover researchers, exchange ideas, and bring local knowledge into a global conversation.
        </p>
        <div className={styles.heroActions}>
          <Link href="/login" className={styles.primaryButton}>
            Join the community <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <Link href="/map" className={styles.textButton}>
            Explore the map <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.heroNote}>
          <span className={styles.noteIcon}><Globe2 size={20} strokeWidth={1.5} aria-hidden="true" /></span>
          <p>Different disciplines. Shared curiosity.<br /><strong>Your perspective belongs here.</strong></p>
        </div>
      </div>

      <figure className={styles.networkFigure}>
        <div className={styles.figureTopline}>
          <span><span className={styles.liveDot} /> THE DSSP COMMUNITY</span>
          <Globe2 size={19} strokeWidth={1.4} aria-hidden="true" />
        </div>
        <div className={styles.figureHeading}>Knowledge grows<br />when we connect.</div>
        <div className={styles.mapIllustration} aria-hidden="true">
          <div className={styles.mapGrid} />
          <Image src="/world-outline.svg" alt="" width={1000} height={520} priority className={styles.worldOutline} />
          <svg className={styles.networkLines} viewBox="0 0 1000 520" fill="none">
            <path d="M706 182Q590 42 495 113M706 182Q460-27 294 151M706 182Q647 198 600 304M706 182Q805 224 914 425M706 182Q792 79 853 164" stroke="currentColor" strokeWidth="1.8" strokeDasharray="5 6" />
            {[[495,113], [294,151], [600,304], [914,425], [853,164]].map(([cx,cy]) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="15" fill="#f5f4e9" fillOpacity="0.8" />
                <circle cx={cx} cy={cy} r="7" fill="#255c46" stroke="#f5f4e9" strokeWidth="2.5" />
              </g>
            ))}
            <circle cx="706" cy="182" r="29" fill="#255c46" fillOpacity="0.1" />
            <circle cx="706" cy="182" r="19" fill="#255c46" fillOpacity="0.15" />
            <circle cx="706" cy="182" r="10" fill="#255c46" stroke="#f5f4e9" strokeWidth="3.5" />
          </svg>
          <div className={styles.pakistanLabel}><MapPin size={13} /> Pakistan</div>
        </div>
        <div className={styles.mapCallout}>
          <span className={styles.calloutIcon}><MapPin size={21} strokeWidth={1.7} aria-hidden="true" /></span>
          <div><strong>Every pin, a new perspective.</strong><p>Find the people behind the research.</p></div>
          <ArrowUpRight size={20} aria-hidden="true" />
        </div>
        <figcaption className={styles.figureCaption}>
          <span>Illustrative network</span>
          <Link href="/map">Discover the live map <ArrowRight size={14} aria-hidden="true" /></Link>
        </figcaption>
      </figure>
      <a href="#how-it-works" className={styles.scrollHint}><ArrowDown size={14} aria-hidden="true" /> A little connection can go a long way</a>
    </section>
  );
}

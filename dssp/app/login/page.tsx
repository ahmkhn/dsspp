import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Globe2, MapPin, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { OAuthButtons } from "./oauth-signin";
import Footer from "../footer/page";
import Nav from "@/components/nav/Nav";
import styles from "./login.module.css";

export default async function Login({ searchParams }: {
  searchParams: Promise<{ message?: string | string[] }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return redirect("/map");

  const { message } = await searchParams;

  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <section className={styles.story} aria-labelledby="community-heading">
          <Link href="/" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Back to the community</Link>
          <p className={styles.eyebrow}><span /> MANY PLACES. SHARED PURPOSE.</p>
          <h2 id="community-heading">A world of ideas.<br /><span>A place for yours.</span></h2>
          <p className={styles.description}>Meet the people bringing local perspectives into a global conversation. Your next connection starts here.</p>
          <div className={styles.illustration} aria-hidden="true">
            <img src="/world-outline.svg" alt="" width="1000" height="520" />
            <span className={styles.mapPoint}><MapPin size={22} /></span>
            <span className={styles.mapPointSmall} />
            <div className={styles.illustrationCaption}><Globe2 size={18} /> Rooted in Pakistan. Connected globally.</div>
          </div>
          <div className={styles.communityNote}><span><Users size={21} aria-hidden="true" /></span><p>Researchers, students, and curious minds.<br /><strong>Different disciplines. Shared curiosity.</strong></p></div>
        </section>

        <section className={styles.card} aria-labelledby="login-heading">
          <span className={styles.cardIcon}><Globe2 size={28} strokeWidth={1.4} aria-hidden="true" /></span>
          <p className={styles.eyebrow}>WELCOME TO DSSP</p>
          <h1 id="login-heading">Your perspective<br />belongs here.</h1>
          <p className={styles.cardDescription}>Sign in to add your pin, share your research, and become part of the community.</p>
          {message && <p className={styles.error} role="alert">{Array.isArray(message) ? message[0] : message}. Please try again.</p>}
          <OAuthButtons />
          <p className={styles.signInNote}>New here? Continue with Google to get started.<br />Already a member? Use the same Google account.</p>
          <div className={styles.divider}><span />or take a look around<span /></div>
          <Link href="/map" className={styles.guestButton}>Explore without signing in <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <p className={styles.guestNote}>The map is open to everyone.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

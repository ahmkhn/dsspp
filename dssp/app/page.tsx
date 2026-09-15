import Link from "next/link";
import { createClient } from "@/supa/supabase/server";
import { HeroHighlightDemo } from "@/components/Hero";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ArrowUpRight, Compass, MapPin, MessagesSquare } from "lucide-react";
import Nav from "@/components/nav/Nav";
import Footer from "./footer/page";
import styles from "@/components/site.module.css";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Find your community",
    description: "Explore the map and discover people working on the questions you care about, nearby and around the world.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Put your work on the map",
    description: "Choose your location, share your research interests, and introduce your perspective to the community.",
  },
  {
    number: "03",
    icon: MessagesSquare,
    title: "Take the conversation further",
    description: "Get to know the people behind the profiles. Follow their links to connect and explore opportunities to collaborate.",
  },
];

export default async function Index() {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <div className={styles.site}>
      <Nav />
      <main id="main-content">
        <HeroHighlightDemo />

        <section className={styles.disciplines} aria-label="A community across disciplines">
          <div className={styles.disciplinesInner}>
            <p>MANY DISCIPLINES.<br /><strong>ONE OPEN CONVERSATION.</strong></p>
            <div className={styles.disciplineList}>
              {["Anthropology", "Sociology", "Political Science", "History", "Development Studies"].map((discipline) => (
                <span key={discipline}>{discipline}</span>
              ))}
              <Link href="/map" aria-label="Explore all research disciplines">& more <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howSection} aria-labelledby="how-heading">
          <div className={styles.sectionHeader}>
            <div><p className={styles.eyebrow}>A PLACE TO BEGIN</p><h2 id="how-heading">Big ideas start with<br /><span>a simple connection.</span></h2></div>
            <p>A community built around people and their perspectives. Here&apos;s how to become part of it.</p>
          </div>
          <div className={styles.steps}>
            {steps.map(({ number, icon: Icon, title, description }) => (
              <article className={styles.step} key={number}>
                <div className={styles.stepTop}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><span>{number}</span></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.mission} aria-labelledby="mission-heading">
          <div className={styles.missionCopy}>
            <p className={styles.eyebrow}>LOCAL KNOWLEDGE. SHARED POSSIBILITY.</p>
            <h2 id="mission-heading">Research is richer<br />with your perspective.</h2>
            <p>Help reshape the social sciences through local contexts, indigenous knowledge, and connections that cross borders.</p>
          </div>
          <div className={styles.missionAction}>
            <Link href="/login" className={styles.lightButton}>Add your voice <ArrowUpRight size={19} aria-hidden="true" /></Link>
            <Link href="/about" className={styles.missionLink}>Learn about DSSP <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

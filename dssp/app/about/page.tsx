import Link from "next/link";
import { ArrowUpRight, BookOpen, Globe2, Mail, MapPin, Users } from "lucide-react";
import Nav from "@/components/nav/Nav";
import Footer from "@/app/footer/page";
import styles from "./about.module.css";

export const metadata = { title: "About DSSP | Decolonizing Social Sciences" };

// Replace each placeholder with a profile photo URL, or a path to an image in public/.
const profilePhotos = {
  rabia: "https://media.licdn.com/dms/image/v2/D4D03AQFMv_G3mRTlrA/profile-displayphoto-crop_800_800/B4DZsynpJuI8AI-/0/1766080813722?e=1791417600&v=beta&t=dSiNjtLaKaeFnCwghDGE--jJlBKd97xYxR9-_Q_J6es",
  ahmed: "https://media.licdn.com/dms/image/v2/D4E03AQEQJxVRMlF5fQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718856735598?e=1791417600&v=beta&t=hPQzyuwvYb1g_AqnxEbgKGlIw6el2xgB2LqQ0JJbUhA",
};

const principles = [
  { icon: BookOpen, title: "Start with local knowledge", text: "Make space for indigenous knowledge, lived experiences, and research grounded in the realities of Pakistan." },
  { icon: Users, title: "Look beyond your discipline", text: "Bring different fields into conversation. Shared questions can create connections across academic boundaries." },
  { icon: Globe2, title: "Connect across borders", text: "Find people with a shared curiosity and take the conversation further through their research and profiles." },
];

export default function About() {
  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>ABOUT DSSP</p>
            <h1>Knowledge grows<br /><span>with more perspectives.</span></h1>
            <p className={styles.introduction}>Decolonizing Social Sciences in Pakistan is a space for researchers, students, and curious minds to connect—and rethink whose knowledge shapes our understanding of the world.</p>
            <Link href="/map" className={styles.primaryLink}>Meet the community <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <aside className={styles.mission} aria-labelledby="mission-heading">
            <Globe2 size={32} strokeWidth={1.3} aria-hidden="true" />
            <p className={styles.eyebrow}>ROOTED LOCALLY. OPEN GLOBALLY.</p>
            <h2 id="mission-heading">A broader view<br />of the social sciences.</h2>
            <p>We want to challenge colonial legacies in research and make room for local contexts, indigenous perspectives, and more inclusive conversations.</p>
            <span className={styles.missionFoot}><MapPin size={16} aria-hidden="true" /> From Pakistan, to a shared world.</span>
          </aside>
        </header>

        <section className={styles.principles} aria-labelledby="principles-heading">
          <p className={styles.eyebrow}>WHAT BRINGS US TOGETHER</p>
          <h2 id="principles-heading">Different disciplines. Shared purpose.</h2>
          <div className={styles.principleGrid}>{principles.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <div className={styles.principleTop}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}</div>
        </section>

        <section className={styles.people} aria-labelledby="people-heading">
          <div className={styles.peopleIntro}><p className={styles.eyebrow}>THE PEOPLE BEHIND DSSP</p><h2 id="people-heading">An idea.<br />A collaboration.<br /><span>A growing community.</span></h2><p>DSSP began with Dr. Rabia Akhtar’s vision to bring minds together. Through collaboration with Ahmed Khan, that idea became this platform.</p></div>
          <div className={styles.peopleCards}>
            <article className={styles.person}>
              <img className={styles.profilePhoto} src={profilePhotos.rabia} alt="" width={56} height={56} loading="lazy" decoding="async" />
              <div><p className={styles.role}>DSSP LEAD</p><h3>Dr. Rabia Akhtar</h3><p>An academic entrepreneur whose work connects research, policy, and public discourse. Rabia initiated the vision for DSSP.</p>
                <div className={styles.contact}><a href="mailto:rabia.akhtar@csspr.uol.edu.pk"><Mail size={15} aria-hidden="true" /> Email Rabia</a><a href="https://www.linkedin.com/in/dr-rabia-akhtar-4a702b49/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a></div>
              </div>
            </article>
            <article className={styles.person}>
              <img className={styles.profilePhoto} src={profilePhotos.ahmed} alt="" width={56} height={56} loading="lazy" decoding="async" />
              <div><p className={styles.role}>DEVELOPER</p><h3>Ahmed Khan</h3><p>Ahmed built DSSP to turn a shared vision into a place where people can discover one another and connect through their interests.</p>
                <div className={styles.contact}><a href="mailto:ahmkhnwork@gmail.com"><Mail size={15} aria-hidden="true" /> Email Ahmed</a><a href="https://www.linkedin.com/in/ahmkh" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a></div>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.invitation} aria-labelledby="invitation-heading"><div><p className={styles.eyebrow}>YOUR PERSPECTIVE BELONGS HERE</p><h2 id="invitation-heading">Be part of the conversation.</h2><p>Explore the map, share your interests, and find your community.</p></div><Link href="/login" className={styles.primaryLink}>Add your voice <ArrowUpRight size={18} aria-hidden="true" /></Link></section>
      </main>
      <Footer />
    </div>
  );
}

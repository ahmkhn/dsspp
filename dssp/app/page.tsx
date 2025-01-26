import { createClient } from "@/supa/supabase/server";
import { signOut } from "@/app/login/actions";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { HeroHighlightDemo } from "@/components/Hero";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import Nav from "@/components/nav/Nav";
import Footer from "./footer/page";
export default async function Index() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen w-full bg-black group overflow-hidden">
  <StarsBackground className="!fixed inset-0 z-0" starDensity={0.0002}/>
  <ShootingStars starColor="#16a34a" trailColor="white" minDelay={800} maxDelay={1200} starHeight={10} starWidth={40}/>
  <Nav/>

  <main className="mb-60 z-20 flex-grow flex items-center justify-center w-full z-10">
    <div className=" flex flex-col items-center justify-center w-full max-w-4xl p-4">
      <HeroHighlightDemo/>
      <a className="-mt-60 sm:-mt-40 z-10  font-bold max-w-xs cursor-pointer inline-flex items-center justify-center !bg-green-600 text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground h-11 px-12 sm:px-24 rounded-2xl"
        href="/login">
        Get Started
      </a>
      <p className="mt-20 sm:mt-12 text-center text-xs sm:text-sm md:text-base lg:text-lg font-bold text-green-500 leading-relaxed max-w-md">
            To set a marker, simply tap or click on the map! Explore the map and tap or click on other markers to see other people's stories!
      </p>
    </div>
  </main>

  <Footer/>
  <SpeedInsights/>
  <Analytics/>
</div>
  
  );
}

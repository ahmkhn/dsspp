import { createClient } from "@/supa/supabase/server";
import { signOut } from "@/app/login/actions";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { HeroHighlightDemo } from "@/components/Hero";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import Nav from "@/components/nav/Nav";
import Footer from "./footer/page";
import { MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      <Card className="mt-20 bg-black/10 max-w-md mx-auto border border-green-500/80 backdrop-blur-sm hover:border-green-400/70 transition-all duration-300 shadow-lg shadow-green-500/10 rounded-3xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <MapPinIcon className="w-6 h-6 text-green-500 animate-bounce" />
          </div>
          <p className="text-center text-sm md:text-base font-medium text-green-400 leading-relaxed">
            Click anywhere on the map to drop a marker and share your story. Discover others' stories by exploring existing markers!
          </p>
        </CardContent>
      </Card>
    </div>
  </main>

  <Footer/>
  <SpeedInsights/>
  <Analytics/>
</div>
  
  );
}

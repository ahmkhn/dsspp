import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/asdasd/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { Globe } from "@/components/ui/globe";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { motion } from "framer-motion";
import { HeroHighlightDemo } from "@/components/Hero";
import globeData from "@/data/globe.json"
import { GlobeDemo } from "@/components/GlobeD";
export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className=" h-[40vh] flex-1 w-full flex flex-col items-center max-h-screen min-h-screen  bg-black bg-dot-thick-neutral-800 group">
      <StarsBackground className="important" starDensity={0.0001}/>
      <ShootingStars starColor="green-200" trailColor="white" minDelay={800} maxDelay={1200} starHeight={6} starWidth={40}/>
      <nav className="w-full flex justify-center border-b border-gray-600 h-16">
      {user !== null ? (
            <form action={signOut} className="flex items-center gap-2">
              <p>{user.email}</p>
              <button>Sign Out</button>
            </form>
          ) : (
            <>
            </>
          )}
      </nav>
  <div className="flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className=" flex flex-grow flex-col gap-2 max-w-3xl rounded-lg justify-center align-middle items-center bg-white">
        <HeroHighlightDemo></HeroHighlightDemo>
      
        <a className="z-10 w-[12rem] cursor-pointer inline-flex items-center justify-center bg-gradient-to-r bg-green-600 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  ring-offset-background bg-primary text-primary-foreground h-11 px-8 rounded-2xl"
        href="/login"
      >
        Get Started
      </a>
    </div>
  </div>
  </div>
  <footer className="w-full border-t border-gray-600 h-16 flex justify-center items-center text-center text-xs bg-black bg-dot-thick-neutral-800 group">
        <p>
          Developed by {""}
          <a
            href="https://linkedin.com/in/ahmkhn"
            target="_blank"
            className="font-bold underline"
            rel="noreferrer"
          >
            Ahmed Khan
          </a>
        </p>
      </footer>
  </div>
  );
}

import { createClient } from "@/asdasd/supabase/server";
import { signOut } from "@/app/login/actions";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { HeroHighlightDemo } from "@/components/Hero";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

  return (
    <div className="flex w-full flex-col items-center min-h-screen bg-black bg-dot-thick-neutral-800 group">
    <StarsBackground className="important" starDensity={0.0001}/>
    <ShootingStars starColor="green-200" trailColor="white" minDelay={800} maxDelay={1200} starHeight={6} starWidth={40}/>
    <nav className="w-full flex justify-center border-b border-gray-600 h-[5vh]">
      {user !== null ? (
        <form action={signOut} className="z-10 flex items-center gap-2">
          <p>{user.email}</p>
          <button className="bg-green-600 rounded-xl p-2">Sign Out?</button>
        </form>
      ) : (
        <>
        </>
      )}
    </nav>
    
    <div className="h-[90vh] flex flex-wrap justify-between items-center w-full mx-auto p-4 sm:p-6 lg:p-8 py-12">
      <div className="flex flex-wrap flex-grow flex-col gap-2 w-full lg:w-2/3 sm:w-full rounded-lg justify-center align-middle items-center">
        <HeroHighlightDemo/>
        <a className="z-10 w-[12rem] cursor-pointer inline-flex items-center justify-center bg-gradient-to-r !bg-green-600 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  ring-offset-background bg-primary text-primary-foreground h-11 px-8 rounded-2xl"
          href="/login">
          Get Started
        </a>
      </div>
    </div>
    
    <footer className="w-full border-t border-gray-600 h-[5vh] flex justify-center items-center text-center text-xs bg-black bg-dot-thick-neutral-800 group">
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
    
    <SpeedInsights/>
  </div>
  
  );
}

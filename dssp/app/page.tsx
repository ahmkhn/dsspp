import { createClient } from "@/asdasd/supabase/server";
import { signOut } from "@/app/login/actions";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { HeroHighlightDemo } from "@/components/Hero";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
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
    <div className="flex flex-col min-h-screen w-full bg-black bg-dot-thick-neutral-800 group overflow-hidden">
  <StarsBackground className="!fixed inset-0 z-0" starDensity={0.0002}/>
  <ShootingStars starColor="#16a34a" trailColor="white" minDelay={800} maxDelay={1200} starHeight={10} starWidth={40}/>
  
  

    <nav className="-mb-60 z-20 w-full border-b border-gray-600 py-4">
    <div className="flex flex-wrap justify-between items-center w-full px-4 sm:px-6 gap-4">
      <a 
        className="z-50 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
        href="/"
      >
        Homepage
      </a>
      {user !== null && (
        <form action={signOut} className="flex items-center gap-2 order-last sm:order-none">
          <p className="text-sm truncate max-w-[150px]">{user.email}</p>
          <button className="bg-green-600 rounded-xl p-2 z-50 text-sm whitespace-nowrap">Sign Out</button>
        </form>
      )}
      <a 
        className="z-50 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
        href="/about"
      >
        About DSSP
      </a>
    </div>
  </nav>

  <main className="flex-grow flex items-center justify-center w-full z-10">
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

  <footer className="-mt-20 w-full border-t border-gray-600 py-2 flex justify-center items-center text-center text-xs bg-black bg-dot-thick-neutral-800 group z-10">
    <p>
      Developed by {" "}
      <a href="https://linkedin.com/in/ahmkhn"
        target="_blank"
        className="font-bold underline text-green-500"
        rel="noreferrer">
                Ahmed Khan
      </a>
    </p>
    <p className="ml-[1.5rem]">Your feedback matters! Send us your thoughts and help us improve</p>
  </footer>
  <SpeedInsights/>
  <Analytics/>
</div>
  
  );
}

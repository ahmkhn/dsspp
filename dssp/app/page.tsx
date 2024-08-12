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
  <StarsBackground className="!fixed inset-0 z-0" starDensity={0.0001}/>
  <ShootingStars starColor="green-200" trailColor="white" minDelay={800} maxDelay={1200} starHeight={6} starWidth={40}/>
  
  <nav className="w-full flex justify-center border-b border-gray-600 py-2 z-10">
    {user !== null ? (
      <form action={signOut} className="flex items-center gap-2">
        <p>{user.email}</p>
        <button className="bg-green-600 rounded-xl p-2">Sign Out?</button>
      </form>
    ) : (
      <></>
    )}
  </nav>

  <main className="flex-grow flex items-center justify-center w-full z-10">
    <div className="-mt-40 flex flex-col items-center justify-center w-full max-w-4xl p-4">
      <HeroHighlightDemo/>
      <a className="-mt-20 z-10 w-full max-w-xs cursor-pointer inline-flex items-center justify-center !bg-green-600 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground h-11 px-8 rounded-2xl"
         href="/login">
        Get Started
      </a>
    </div>
  </main>

  <footer className="w-full border-t border-gray-600 py-2 flex justify-center items-center text-center text-xs bg-black bg-dot-thick-neutral-800 group z-10">
    <p>
      Developed by {" "}
      <a href="https://linkedin.com/in/ahmkhn"
        target="_blank"
        className="font-bold underline"
        rel="noreferrer">
                Ahmed Khan
      </a>
    </p>
  </footer>
  <SpeedInsights/>
  <Analytics/>
</div>
  
  );
}

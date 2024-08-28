
import { emailLogin, signup } from "./actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OAuthButtons } from "./oauth-signin";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/map");
  }

  return (
    <div className="flex w-full flex-col items-center min-h-screen bg-black bg-dot-thick-neutral-800 group">
      <nav className="w-full border-b border-gray-600 py-4 flex flex-col sm:flex-row items-center">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-6 space-y-4 sm:space-y-0">
          <a 
            className="z-10 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/"
          >
            Homepage
          </a>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Interactive Map</h1>
          <a 
            className="z-10 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/about"
          >
            About DSSP
          </a>
        </div>
      </nav>
    <StarsBackground className="important" starDensity={0.0001}/>
    <ShootingStars starColor="green-200" trailColor="white" minDelay={800} maxDelay={1200} starHeight={6} starWidth={40}/>
      <section className="z-10 h-[calc(100vh-57px)] flex justify-center items-center">
              <div className="flex flex-col gap-3 border-gray-300 rounded-xl border p-8 text-4xl">
                <OAuthButtons />
              </div>
      </section>
    </div>
  );
}
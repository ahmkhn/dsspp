
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
      <nav className="z-10 w-full border-b border-gray-600 py-4">
        <div className="flex justify-between items-center w-full px-4 sm:px-6">
          <a 
            className="z-20 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/"
          >
            Homepage
          </a>
          <a 
            className="z-20 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
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
    <footer className="-mt-2 w-full border-t border-gray-600 py-2 flex justify-center items-center text-center text-xs bg-black bg-dot-thick-neutral-800 group z-10">
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
    </div>
  );
}
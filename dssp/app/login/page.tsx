
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

import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/asdasd/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import Globe from "@/components/magicui/globe";
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
    <div className="flex-1 w-full flex flex-col items-center max-h-screen min-h-screen">
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
  <div className="flex w-[85vh] flex-col gap-2 max-w-2xl">
    <div className="flex flex-col gap-2 items-start">
      <p className="!leading-tight text-balance font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        Decolonizing{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500">
          Social Sciences
        </span>{' '}
        in Pakistan
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4" />
      <p className="!leading-tight text-balance font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        An application that fosters a global community where users can{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500">
          share their research and collaborate
        </span>{' '}
        promoting a sense of unity and mutual support
      </p>
    </div>
    <div className="flex justify-start space-x-4">
      
        <a className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground h-11 px-8 rounded-md"
        href="/login"
      >
        Get Started
      </a>
    </div>
  </div>
  <div className="relative flex h-full ml-40 max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-10 md:pb-60 md:shadow-xl">
      <span className="pb-20 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Welcome! :)
      </span>
      <Globe className="top-28" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
  </div>
</div>
</div>
      <footer className="w-full border-t border-gray-600 p-8 flex justify-center text-center text-xs">
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

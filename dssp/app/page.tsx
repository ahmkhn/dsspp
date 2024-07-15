import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";

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

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-gray-600 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />

        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">

        <div className="flex justify-center space-x-4">
          <a
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground h-11 px-8 rounded-md"
            href="/login"
          >
            Get Started
          </a>
        </div>
        </main>
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

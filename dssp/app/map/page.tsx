import Worldmap from "@/components/Worldmap/page";
import { createClient } from "@/utils/supabase/server";
export default async function Map(){
    const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen">
      <nav className="z-10 w-full border-b border-gray-600 py-4 flex flex-col sm:flex-row items-center">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-6 space-y-4 sm:space-y-0">
          <a 
            className="z-20 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/"
          >
            Homepage
          </a>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Interactive Map</h1>
          <a 
            className="z-20 inline-flex items-center justify-center text-center bg-white text-black px-4 py-2 rounded text-sm sm:text-base font-bold"
            href="/about"
          >
            About DSSP
          </a>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">
        <section className="flex-1 w-full flex flex-col p-4">
          <div className="flex h-full">
            <div className="flex-grow h-[85vh] border-black rounded-lg" style={{borderRadius: '8px', overflow: 'hidden'}}>
              <Worldmap authorized={user} />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-gray-600 p-4 flex justify-center text-center text-xs">
        <p>
          Developed by {" "}
          <a href="https://linkedin.com/in/ahmkhn" target="_blank" className="font-bold underline" rel="noreferrer">
            Ahmed Khan
          </a>
        </p>
      </footer>
    </div>
  );
}
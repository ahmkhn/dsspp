import Worldmap from "@/components/Worldmap/page";
import { createClient } from "@/utils/supabase/server";
import Nav from "@/components/nav/Nav";
export default async function Map(){
    const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen">
      <Nav/>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">Interactive Map</h1>
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
          <a href="https://linkedin.com/in/ahmkhn" target="_blank" className="text-green-500 font-bold underline" rel="noreferrer">
            Ahmed Khan
          </a>
        </p>
        <p className="ml-10">Your feedback matters! Send us your thoughts and help us improve</p>
      </footer>
    </div>
  );
}
import Worldmap from "@/components/Worldmap/page";
import { createClient } from "@/utils/supabase/server";
import Nav from "@/components/nav/Nav";
export default async function Map(){
    const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex-1 w-full flex flex-col h-screen ">
      <Nav/>
      <main className="flex-1 flex flex-col">
        <section className="flex-1 w-full flex flex-col p-4">
          <div className="flex flex-1">
            <div className="flex-grow border-black rounded-lg" style={{borderRadius: '8px', overflow: 'hidden'}}>
              <Worldmap authorized={user} />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-gray-600 p-2 flex justify-center text-center text-xs">
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
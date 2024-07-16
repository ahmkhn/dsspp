import Worldmap from "@/components/Worldmap";
import { createClient } from "@/utils/supabase/server";
export default async function Map(){
    const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();
  return(
    <>
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center border-b border-gray-600 h-16 items-center font-bold text-4xl">
                <div className="flex justify-center flex-grow mx-6">
                    Interactive Map
                </div>
            </nav>
            <main className="flex flex-grow flex-col gap-6 w-2/3 h-[70vh] max-h-full border-black rounded-lg margin" style={{borderRadius: '8px', overflow: 'hidden'}}>
                <Worldmap authorized={user !== null} />
            </main>
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
        
    </>
  );
}
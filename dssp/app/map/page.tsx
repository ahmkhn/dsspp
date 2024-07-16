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
            <nav className="w-full border-b border-gray-600 h-16 flex font-bold text-4xl">
                <div className="flex justify-between items-center flex-grow mx-6">
                <a
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-pink-500 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground h-11 px-2 rounded-md"
                    href="/">
                    Homepage
                </a>
                    <h1>Interactive Map</h1>
                    <a
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-pink-500 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground h-11 px-2 rounded-md"
                    href="/">
                    About DSSP
                </a>
                </div>
            </nav>
            <div>Hey</div>
            <section className="p-3 pt-6 max-w-full w-full flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                    <div className="mt-60 w-1/6 p-6 flex items-center justify-center flex-col h-[20rem]" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <h1 className="text-2xl">Welcome to the interactive map!</h1>
                    </div>
                    <div className="flex-grow h-[70vh] max-h-full border-black rounded-lg margin" style={{borderRadius: '8px', overflow: 'hidden'}}>
                        <Worldmap authorized={user !== null} />
                    </div>
                    <div className="mt-60 w-1/6 p-6 flex items-center justify-center flex-col h-[20rem]" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <h1 className="text-2xl">Click on the map to set a marker!</h1>
                    </div>
                </div>
             </section>
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
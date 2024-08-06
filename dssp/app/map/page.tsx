import Worldmap from "@/components/Worldmap/page";
import { createClient } from "@/utils/supabase/server";
export default async function Map(){
    const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen">
      <nav className="w-full border-b border-gray-600 h-16 flex font-bold text-4xl">
        <div className="flex justify-between items-center flex-grow mx-6">
          <a className="inline-flex items-center justify-center text-center"  href="/"
            style={{
              font: 'bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif',
              backgroundColor: 'white',
              color: 'black',
              width: '130px',
              display: 'block',
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '3px',}}
          >
            Homepage
          </a>
          <h1 className="ml-6">Interactive Map</h1>
          <a className="inline-flex items-center justify-center" href="/"
          
          style={{
            font: 'bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif',
            backgroundColor: 'white',
            color: 'black',
            width: '130px',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '3px',}}
          >
            About DSSP
          </a>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">
        <section className="flex-1 w-full flex flex-col p-4">
          <div className="flex h-full">
            <div className="flex-grow h-[89vh] border-black rounded-lg" style={{borderRadius: '8px', overflow: 'hidden'}}>
              <Worldmap authorized={user !== null} />
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
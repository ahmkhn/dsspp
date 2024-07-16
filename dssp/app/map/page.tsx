
import { createClient } from "@/utils/supabase/server";
export default async function Map(){
    const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();
  return(
    <>
        <nav className="w-full flex justify-center border-b border-gray-600 h-16">
        </nav>
    </>
  );
}
"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addData(full_name:string,user_location_x:number,user_location_y:number,user_occupation:string,user_research_description:string,user_research_tag:string,li_link:string,summary:string){
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const {avatar_url} = user?.user_metadata || {}
    const { error } = await supabase.from("users").insert({
        avatar_url: avatar_url,
        full_name: full_name,
        id: String(user?.id),
        email: String(user?.email),
        user_location_x: user_location_x,
        user_location_y:  user_location_y,
        user_occupation:  user_occupation,
        user_research_description: user_research_description,
        user_research_tag: user_research_tag,
        linked_in_link: li_link,
        summary:summary

    });
    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Data inserted successfully");
    }
    revalidatePath("/map");
}
export async function removeData(){
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("User is not logged in");
    }
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", String(user.id));

    if (error) {
        throw new Error("Error deleting data");
    }

    revalidatePath("/map");
}

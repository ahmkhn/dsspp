"use server"

import { createClient } from "@/utils/supabase/server";

export async function addData(){
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("users").insert({
        avatar_url:"adsf",
        full_name: "asdf",
        id: String(user?.id),
        user_city_country: "asdf",
        user_location_x: 0,
        user_location_y:  0,
        user_occupation:  "asdf",
        user_research_description: "asdf",
        user_research_tag: "asdf",
        username:  "asdf",
    });
    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Data inserted successfully");
    }
}
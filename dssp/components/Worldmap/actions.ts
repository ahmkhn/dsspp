import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addUserDetails(userFullName:string,userResearchTag:string,userResearchDesc:string,userLocationX:number,userLocationY:number,userOccupation:string){
    // this function adds the user's details along with the marker they set.
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("User is not logged in")
    }
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
    const {data, error} = await supabase.from("users").insert({
        uuid: user.email,
        avatar_url: avatarUrl,
        full_name: userFullName,
        user_research_tag: userResearchTag,
        user_research_description: userResearchDesc,
        user_occupation: userOccupation,
        user_location_x: userLocationX,
        user_location_y: userLocationY,
    })
}
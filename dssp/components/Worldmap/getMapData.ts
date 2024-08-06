"use server"
import { createClient } from "@/utils/supabase/server";

interface User {
    full_name: string;
    user_research_tag: string;
    avatar_url: string;
    user_research_description: string;
    user_occupation: string;
    user_location_x: number;
    user_location_y: number;
    linked_in_link: string;
    summary: string;
}

export async function getAllMarkerUserData(): Promise<User[] | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('users')
        .select('full_name, user_research_tag, avatar_url, user_research_description, user_occupation, user_location_x, user_location_y, linked_in_link, summary')
        .returns<User[]>();

    if (error) {
        console.error('Error fetching user data:', error);
        return null;
    }

    return data;
}

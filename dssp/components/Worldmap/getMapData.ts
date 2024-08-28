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
    email: string;
}

export async function getAllMarkerUserData(): Promise<User[] | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('users')
        .select('full_name, user_research_tag, avatar_url, user_research_description, user_occupation, user_location_x, user_location_y, linked_in_link, summary, email')
        .returns<User[]>();

    if (error) {
        console.error('Error fetching user data:', error);
        return null;
    }

    return data;
}
export async function getUserDataExists() {
    const supabase = createClient();
    
    // Step 1: Check if we can get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error getting user:", userError);
      return false;
    }
    
    if (!user?.id) {
      console.log("No user ID found");
      return false;
    }
    
    
    // Step 2: Query the database
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id);
  
    if (error) {
      console.error('Error querying database:', error);
      return false;
    }
  
    
    // Step 3: Check if user exists in the database
    const exists = data && data.length > 0;
    
    return exists;
  }
  export async function getUserId() {
    const supabase = createClient();
      
    // Step 1: Check if we can get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting current user:', userError);
      return false;
    }
  
    const currentUserID = user?.id;
  
    if (!currentUserID) {
      console.error('No current user found');
      return false;
    }
  
    // Step 2: Check if the current user's ID exists in the users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', currentUserID)
      .single();
  
    if (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  
    if (!data) {
      console.error('Current user not found in users table');
      return false;
    }
  
    return true;
  }

import { supabase } from "./supabaseClient";

/**
 * Verifies if a user has confirmed their email
 * @param userId The user's ID to check
 * @returns Promise<boolean> True if email is confirmed
 */
export const isEmailConfirmed = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error checking email confirmation:", error);
      return false;
    }

    return data?.user?.email_confirmed_at !== null;
  } catch (err) {
    console.error("Error in isEmailConfirmed:", err);
    return false;
  }
};

/**
 * Check if user has email verification requirement based on provider
 * @param user User object
 * @returns boolean True if email verification is required
 */
export const requiresEmailVerification = (provider: string): boolean => {
  // OAuth providers typically verify emails during signup
  return provider === "email";
};

/**
 * Check if user exists in the profiles table
 * @param email Email to check
 * @returns Promise<boolean> True if user exists
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      // PGRST116 means no rows returned - user doesn't exist
      return false;
    } else if (error) {
      console.error("Error checking user:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Error in checkUserExists:", err);
    return false;
  }
};

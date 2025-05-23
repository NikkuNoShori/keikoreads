import { supabase } from "./supabaseClient";

/**
 * Check authentication status - useful for debugging
 */
export const checkAuthStatus = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error checking auth status:", error);
      return;
    }

    if (data.session) {
      const user = data.session.user;
      console.log("Auth status: Authenticated");
      console.log("User:", {
        email: user.email,
        id: user.id,
        provider: user.app_metadata?.provider || "email"
      });
    } else {
      console.log("Auth status: Not authenticated");
    }
  } catch (error) {
    console.error("Exception checking auth status:", error);
  }
};

/**
 * Clear any persisted authentication data
 */
export const clearAuthData = (): void => {
  // Remove all Supabase auth-related items from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith("sb-") ||
        key.includes("supabase") ||
        key === "authReturnUrl")
    ) {
      localStorage.removeItem(key);
      console.log(`Removed auth data: ${key}`);
    }
  }

  // Remove any cookies
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.trim().split("=");
    if (name && (name.startsWith("sb-") || name.includes("supabase"))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log(`Removed auth cookie: ${name}`);
    }
  });

  console.log("Auth data cleared");
};

// Create a type for the debug helper
interface AuthDebugHelper {
  checkStatus: typeof checkAuthStatus;
  clearData: typeof clearAuthData;
}

/**
 * Debug helper for development - Run this in the browser console
 */
export const authDebugHelper: AuthDebugHelper = {
  checkStatus: checkAuthStatus,
  clearData: clearAuthData,
};

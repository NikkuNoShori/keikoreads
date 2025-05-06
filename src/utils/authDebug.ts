import { supabase } from "./supabaseClient";

/**
 * Force sign out for development purposes
 */
export const forceSignOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("clearAuth");
    console.log("User successfully signed out (forced)");
  } catch (error) {
    console.error("Error forcing sign out:", error);
  }
};

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
      console.log("User is authenticated:");
      console.log("  Email:", user.email);
      console.log("  ID:", user.id);
      console.log("  Auth Provider:", user.app_metadata?.provider || "email");
    } else {
      console.log("User is NOT authenticated");
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
  signOut: typeof forceSignOut;
  checkStatus: typeof checkAuthStatus;
  clearData: typeof clearAuthData;
  exposeToWindow: () => void;
}

/**
 * Debug helper for development - Run this in the browser console
 */
export const authDebugHelper: AuthDebugHelper = {
  signOut: forceSignOut,
  checkStatus: checkAuthStatus,
  clearData: clearAuthData,

  // Helper to expose all functions to window
  exposeToWindow: () => {
    if (process.env.NODE_ENV === "development") {
      // Extend window interface
      (window as unknown as Record<string, AuthDebugHelper>).authDebug =
        authDebugHelper;
      console.log("Auth debug functions exposed to window.authDebug");
    }
  },
};

// Auto-expose in development
if (process.env.NODE_ENV === "development") {
  authDebugHelper.exposeToWindow();
}

import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Debug: Check if environment variables are loaded
console.log("Supabase URL:", supabaseUrl ? "loaded" : "missing");
console.log("Supabase Key:", supabaseKey ? "loaded" : "missing");

// Client options to optimize performance
const options: SupabaseClientOptions<"public"> = {
  auth: {
    persistSession: true,
    // Avoid excessive session checks when tab visibility changes
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // Enable to reduce console logging
  // global: {
  //   fetch: (...args) => fetch(...args),
  // },
  realtime: {
    // Disable realtime subscriptions which can cause extra requests
    params: {
      eventsPerSecond: 0,
    },
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, options);

// Prevent excessive session checking on visibility change
if (typeof window !== "undefined") {
  let visibilityTimeout: NodeJS.Timeout | null = null;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // Debounce session checking when tab becomes visible
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
      visibilityTimeout = setTimeout(() => {
        // Only check session if we've been visible for at least 2 seconds
        // This prevents rapid session checks when quickly switching tabs
        supabase.auth.getSession().catch(console.error);
      }, 2000);
    } else if (visibilityTimeout) {
      // Cancel the timeout if the tab becomes hidden again
      clearTimeout(visibilityTimeout);
    }
  });
}

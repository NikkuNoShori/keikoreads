import { useState, useEffect } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  email: string;
  avatar_url: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Check if a user exists with a specific email
  const checkUserExists = async (email: string): Promise<boolean> => {
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

  // Upsert profile from OAuth/session
  const upsertProfileFromOAuth = async (user: User) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const fullName = meta.full_name || meta.name || "";
    const [first_name, ...rest] = fullName.split(" ");
    const last_name = rest.join(" ");
    const avatar_url = meta.avatar_url || null;
    const date_of_birth = meta.birthdate || meta.dob || null;
    const email = user.email || "";
    await supabase.from("profiles").upsert({
      id: user.id,
      first_name: first_name || "",
      last_name: last_name || "",
      date_of_birth,
      email,
      avatar_url,
      updated_at: new Date().toISOString(),
    });
  };

  // Fetch profile from DB
  const fetchProfile = async (user: User) => {
    if (!user) return null;
    setProfileLoading(true);
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(existingProfile || null);
    setProfileLoading(false);
    return existingProfile;
  };

  // Centralized effect: on user/session change, upsert/fetch profile
  useEffect(() => {
    const syncProfile = async () => {
      if (authState.user) {
        // Upsert from OAuth/session
        await upsertProfileFromOAuth(authState.user);
        // Fetch profile
        await fetchProfile(authState.user);

        // Handle redirect after successful OAuth
        const returnUrl = localStorage.getItem("authReturnUrl");
        if (returnUrl) {
          localStorage.removeItem("authReturnUrl");
          window.location.href = returnUrl;
        }
      } else {
        setProfile(null);
      }
    };
    syncProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.user]);

  useEffect(() => {
    // Get the initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setAuthState((prev) => ({
          ...prev,
          session: data.session,
          user: data.session?.user || null,
          loading: false,
        }));
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error as Error,
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;

    // Create a debounced session checker
    let sessionCheckTimer: NodeJS.Timeout | null = null;

    const debouncedSessionCheck = () => {
      if (sessionCheckTimer) clearTimeout(sessionCheckTimer);
      sessionCheckTimer = setTimeout(() => {
        if (isMounted) {
          supabase.auth.getSession().catch(console.error);
        }
      }, 2000); // 2 second debounce
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user || null,
          loading: false,
        }));
      }
    });

    // Handle visibility change
    const handleVisibilityChange = () => {
      // Only trigger session check if page becomes visible
      if (document.visibilityState === "visible") {
        debouncedSessionCheck();
      }
    };

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup subscription and visibility listener
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (sessionCheckTimer) clearTimeout(sessionCheckTimer);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // First check if user exists
      const userExists = await checkUserExists(email);

      if (!userExists) {
        return {
          data: null,
          error: {
            message:
              "No account found with this email address. Please sign up first.",
          },
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithOAuth = async (provider: Provider) => {
    // Always force Google account picker
    const options: {
      redirectTo: string;
      queryParams: Record<string, string>;
    } = {
      redirectTo: window.location.origin + "/auth/callback",
      queryParams: {},
    };
    if (provider === "google") {
      options.queryParams.prompt = "select_account";
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Check if user already exists
      const userExists = await checkUserExists(email);

      if (userExists) {
        return {
          data: null,
          error: {
            message:
              "An account with this email already exists. Please sign in instead.",
          },
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Expose profile and refreshProfile
  const refreshProfile = async () => {
    if (authState.user) {
      await fetchProfile(authState.user);
    }
  };

  // Handle OAuth callback verification
  const checkOAuthCallback = async (user: User) => {
    if (!user || !user.email) return;

    const oauthIntent = localStorage.getItem("oauthIntent");
    if (!oauthIntent) return;

    // Clear the intent regardless of what happens
    localStorage.removeItem("oauthIntent");

    // Check if the user exists in our profiles table
    const userExists = await checkUserExists(user.email);

    if (oauthIntent === "signup" && userExists) {
      // User tried to sign up but already exists
      // Show a welcome back message instead of an error
      localStorage.setItem(
        "welcomeBack",
        "Welcome back! You've signed in with your existing account."
      );
      // They've actually been signed in by Supabase already, so redirect to home or profile
      // after showing the welcome message on the next page
    } else if (oauthIntent === "signin" && !userExists) {
      // User tried to sign in but doesn't exist
      // We need to create their profile since they authenticated successfully
      await upsertProfileFromOAuth(user);
      localStorage.setItem(
        "authWarning",
        "New account created with your OAuth provider."
      );
    } else if (oauthIntent === "signin" && userExists) {
      // Normal sign in flow - just update the profile with latest OAuth data
      await upsertProfileFromOAuth(user);
    } else if (oauthIntent === "signup" && !userExists) {
      // Normal sign up flow - create the profile
      await upsertProfileFromOAuth(user);
    }
  };

  // Add this to the useEffect that watches authState.user
  useEffect(() => {
    if (authState.user) {
      checkOAuthCallback(authState.user).catch(console.error);
    }
  }, [authState.user]);

  return {
    ...authState,
    signIn,
    signInWithOAuth,
    signUp,
    signOut,
    isAuthenticated: !!authState.user,
    profile,
    profileLoading,
    refreshProfile,
  };
};

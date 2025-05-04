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

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState((prev) => ({
        ...prev,
        session,
        user: session?.user || null,
        loading: false,
      }));
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
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
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
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

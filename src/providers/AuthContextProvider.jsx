import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

const AuthContext = createContext(undefined);
const SupabaseContext = createContext(undefined);

export const AuthContextProvider = ({ children, supabase }) => {
  const [localSession, setLocalSession] = useLocalStorage("localSession", null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  window.sb = supabase;
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session", session);
      setSession(session);
      setLocalSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLocalSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, setLocalSession]);

  const authContextValue = {
    session,
    localSession,
    user: session && session.user,
    loading: loading,
    signIn: async () => {
      const { session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            scope: "email profile https://www.googleapis.com/auth/calendar",
          },
        },
      });

      if (error) {
        throw error;
      }
      setSession(session);
      setLocalSession(session);
      setLoading(false);
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setSession(null);
      setLocalSession(null);
      setLoading(false);
    },
  };

  return (
    <SupabaseContext.Provider value={supabase}>
      <AuthContext.Provider value={authContextValue}>
        {children}
      </AuthContext.Provider>
    </SupabaseContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a AuthContextProvider");
  }
  return context;
};

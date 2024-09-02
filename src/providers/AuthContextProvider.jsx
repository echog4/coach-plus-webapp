import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { G_SCOPE, LSN_SESSION_KEY } from "../utils/constant";

const AuthContext = createContext(undefined);
const SupabaseContext = createContext(undefined);

const google = window.google;

export const AuthContextProvider = ({ children, supabase }) => {
  const [localSession, setLocalSession] = useLocalStorage(
    LSN_SESSION_KEY,
    null
  );
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenClient, setTokenClient] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);

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

  useEffect(() => {
    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: G_SCOPE,
        prompt: "",
        callback: (token) => {
          setLocalSession({
            ...localSession,
            provider_token: token.access_token,
          });

          setGoogleToken({
            ...token,
            expires_at: Date.now() + token.expires_in * 1000,
          });
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  window.authContextValue = {
    session,
    localSession,
    user: session && session.user,
    tokenClient,
    googleToken,
    loading: loading,
    signIn: async () => {
      const { session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            scope: G_SCOPE,
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
    refreshGoogleToken: async () => {
      tokenClient.requestAccessToken();
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
      <AuthContext.Provider value={window.authContextValue}>
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

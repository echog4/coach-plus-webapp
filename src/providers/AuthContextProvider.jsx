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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenClient, setTokenClient] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);

  const _setSession = (session) => {
    setSession(session);
    setLocalSession(session);
    setLoading(false);
    if (session) {
      syncUser(session);
    } else {
      setUser(null);
    }
  };

  const syncUser = async (session) => {
    const { data: existing_user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id);

    if (error) {
      console.log(error);
    }

    if (existing_user.length === 1) {
      return setUser({
        ...existing_user[0],
        sessionUser: session && session.user,
      });
    }

    const { data: new_user } = await supabase
      .from("users")
      .insert({
        id: session.user.id,
        full_name: session.user.user_metadata.full_name,
        type: "coach",
        google_access_token: localSession.provider_token,
        google_refresh_token: localSession.refresh_token,
      })
      .select()
      .single();

    setUser({ ...new_user, sessionUser: session && session.user });
  };

  window.sb = supabase;
  useEffect(() => {
    supabase.auth.getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      _setSession(session);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    sessionUser: session && session.user,
    user: user,
    tokenClient,
    googleToken,
    loading: loading,
    syncUser: syncUser,
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
      _setSession(session);
    },
    refreshGoogleToken: async () => {
      tokenClient.requestAccessToken();
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      _setSession(null);
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

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { getSession, signOut as signOutSession } from "@/lib/supabase";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const currentSession = await getSession();
      if (!isMounted) return;

      setSession(currentSession as Session | null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    }

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchProfile(userId: string) {
    if (typeof window !== "undefined") {
      const storedProfile = window.localStorage.getItem(
        "cu-greenverse-mock-profile",
      );
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        return;
      }
    }
    setProfile({ id: userId, name: "", role: "user" });
  }

  async function handleSignOut() {
    await signOutSession();
    setSession(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isLoading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

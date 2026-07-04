import { createClient, type Session, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as
  | string
  | undefined;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const MOCK_SESSION_KEY = "cu-greenverse-mock-session";
const MOCK_PROFILE_KEY = "cu-greenverse-mock-profile";

// ---- Auth Helpers ----

const CU_DOMAINS = ["@student.chula.ac.th", "@chula.ac.th"];

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}

function getMockUser(email: string, fullName?: string): User {
  return {
    id: `mock-${email.replace(/[^a-z0-9]/gi, "-")}`,
    email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_metadata: { full_name: fullName || email.split("@")[0] },
    app_metadata: { provider: "mock" },
    aud: "authenticated",
    role: "authenticated",
  } as User;
}

function createMockSession(email: string, fullName?: string): Session {
  return {
    access_token: "mock-access-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Date.now() + 3600 * 1000,
    user: getMockUser(email, fullName),
  } as Session;
}

function persistMockSession(session: Session | null) {
  const storage = getStorage();
  if (!storage) return;
  if (session) {
    storage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } else {
    storage.removeItem(MOCK_SESSION_KEY);
  }
}

function persistMockProfile(name: string, email: string) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(
    MOCK_PROFILE_KEY,
    JSON.stringify({
      id: email,
      name,
      email,
      role: "user",
      avatar_url: null,
    }),
  );
}

function readMockSession(): Session | null {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(MOCK_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export function isCUEmail(email: string): boolean {
  return CU_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}

export async function signInWithEmail(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isCUEmail(normalizedEmail)) {
    return {
      error: {
        message:
          "กรุณาใช้อีเมลของจุฬาลงกรณ์มหาวิทยาลัย (@student.chula.ac.th หรือ @chula.ac.th) เท่านั้น",
      },
    };
  }

  if (!hasSupabaseConfig && typeof window !== "undefined") {
    if (
      normalizedEmail === "demo@student.chula.ac.th" &&
      password === "demo1234"
    ) {
      const session = createMockSession(normalizedEmail, "Demo User");
      persistMockSession(session);
      persistMockProfile("Demo User", normalizedEmail);
      return { data: { user: session.user }, error: null };
    }

    if (password.length >= 6) {
      const session = createMockSession(
        normalizedEmail,
        normalizedEmail.split("@")[0],
      );
      persistMockSession(session);
      persistMockProfile(normalizedEmail.split("@")[0], normalizedEmail);
      return { data: { user: session.user }, error: null };
    }

    return {
      error: { message: "รหัสผ่านไม่ถูกต้อง" },
    };
  }

  if (!supabase) {
    return {
      error: { message: "Supabase is not configured for this preview." },
    };
  }

  return supabase.auth.signInWithPassword({ email: normalizedEmail, password });
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isCUEmail(normalizedEmail)) {
    return {
      error: {
        message:
          "กรุณาใช้อีเมลของจุฬาลงกรณ์มหาวิทยาลัย (@student.chula.ac.th หรือ @chula.ac.th) เท่านั้น",
      },
    };
  }

  if (!hasSupabaseConfig && typeof window !== "undefined") {
    if (password.length < 6) {
      return {
        error: { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
      };
    }

    const session = createMockSession(
      normalizedEmail,
      fullName || normalizedEmail.split("@")[0],
    );
    persistMockSession(session);
    persistMockProfile(
      fullName || normalizedEmail.split("@")[0],
      normalizedEmail,
    );
    return { data: { user: session.user }, error: null };
  }

  if (!supabase) {
    return {
      error: { message: "Supabase is not configured for this preview." },
    };
  }

  return supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signOut() {
  if (!hasSupabaseConfig && typeof window !== "undefined") {
    persistMockSession(null);
    const storage = getStorage();
    storage?.removeItem(MOCK_PROFILE_KEY);
    return { error: null };
  }

  if (!supabase) {
    return { error: null };
  }

  return supabase.auth.signOut();
}

export async function getSession() {
  if (!hasSupabaseConfig) {
    return readMockSession();
  }

  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as
  | string
  | undefined;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// ---- Auth Helpers ----

const CU_DOMAINS = ["@student.chula.ac.th", "@chula.ac.th"];

export function isCUEmail(email: string): boolean {
  return CU_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}

export async function signInWithEmail(email: string, password: string) {
  if (!isCUEmail(email)) {
    return {
      error: {
        message:
          "กรุณาใช้อีเมลของจุฬาลงกรณ์มหาวิทยาลัย (@student.chula.ac.th หรือ @chula.ac.th) เท่านั้น",
      },
    };
  }
  if (!supabase) {
    return {
      error: { message: "Supabase is not configured for this preview." },
    };
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  if (!isCUEmail(email)) {
    return {
      error: {
        message:
          "กรุณาใช้อีเมลของจุฬาลงกรณ์มหาวิทยาลัย (@student.chula.ac.th หรือ @chula.ac.th) เท่านั้น",
      },
    };
  }
  if (!supabase) {
    return {
      error: { message: "Supabase is not configured for this preview." },
    };
  }
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signOut() {
  if (!supabase) {
    return {
      error: { message: "Supabase is not configured for this preview." },
    };
  }
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) {
    return null;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

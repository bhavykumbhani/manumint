import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

const DEFAULT_SUPABASE_URL = "https://xjfuibpselnkdbpeguhq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_Gxc6QxRuNs7983ppZonz1w_nLCfd2bO";

function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.SUPABASE_URL ||
    process.env.STORAGE_URL ||
    DEFAULT_SUPABASE_URL
  );
}

function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.STORAGE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim().length > 0 &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseUrl.includes("your-project")
  );
}

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured()) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return createClient();
  }

  if (!browserClient && isSupabaseConfigured()) {
    const supabaseUrl = getSupabaseUrl()!;
    const supabaseAnonKey = getSupabaseAnonKey()!;
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

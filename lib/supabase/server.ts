import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_SERVICE_ROLE_KEY_ENV = "SUPABASE_SERVICE_ROLE_KEY";

function getRequiredServerEnv(name: typeof SUPABASE_URL_ENV | typeof SUPABASE_SERVICE_ROLE_KEY_ENV): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function createSupabaseServiceClient(): SupabaseClient {
  const supabaseUrl = getRequiredServerEnv(SUPABASE_URL_ENV);
  const serviceRoleKey = getRequiredServerEnv(SUPABASE_SERVICE_ROLE_KEY_ENV);

  // Server-only helper. Never import this from Client Components or expose the service role key to the browser.
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_KEY in environment variables."
  );
}

const commonOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },

  realtime: {
    transport: WebSocket
  }
};

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  commonOptions
);

export const createAuthenticatedSupabaseClient = (accessToken) => {
  return createClient(supabaseUrl, supabaseKey, {
    ...commonOptions,

    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};
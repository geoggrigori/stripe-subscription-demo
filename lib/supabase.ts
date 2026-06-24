import { createClient } from "@supabase/supabase-js";

// Admin client used ONLY on the server (webhooks, API routes).
// The service-role key bypasses RLS, so it must never be exposed to the client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Reads the current subscription state for a user FROM OUR DB (not from Stripe).
// This is the whole point: after the webhook syncs, our app gates access using
// our own database — fast, and no Stripe call on every page load.
export async function GET(req: NextRequest) {
  // ⚠️ PRODUCTION (STEM): ignore any client-supplied userId (IDOR). Identify the
  // user from the Supabase auth session, OR use a non-admin client so the RLS
  // policy (auth.uid() = user_id) enforces ownership automatically.
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ subscription: null });

  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  return NextResponse.json({ subscription: data ?? null });
}

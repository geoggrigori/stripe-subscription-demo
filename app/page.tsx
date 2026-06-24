"use client";

import { useEffect, useState } from "react";
import { TIERS } from "@/lib/tiers";

// Demo has no real auth, so we hardcode a user. In the STEM project this would
// be the logged-in Supabase auth user.
const DEMO_USER = { id: "demo-user", email: "demo@example.com" };

type Subscription = {
  status: string;
  price_id: string | null;
  customer_id: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export default function Home() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadSubscription() {
    const res = await fetch(`/api/subscription?userId=${DEMO_USER.id}`);
    const data = await res.json();
    setSub(data.subscription);
  }

  useEffect(() => {
    loadSubscription();
  }, []);

  async function subscribe(priceId: string) {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, userId: DEMO_USER.id, email: DEMO_USER.email }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  async function manage() {
    if (!sub) return;
    const res = await fetch("/api/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: sub.customer_id }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  const activeTier = TIERS.find((t) => t.priceId === sub?.price_id);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Mentorship — choose your plan</h1>
        <p className="mt-2 text-neutral-400">
          Stripe subscriptions demo · two tiers · webhook-synced to Supabase
        </p>

        {sub && (
          <div className="mt-8 rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-5">
            <p className="text-sm uppercase tracking-wide text-emerald-400">
              Current subscription
            </p>
            <p className="mt-1 text-lg font-medium">
              {activeTier?.name ?? "Unknown"} —{" "}
              <span className="text-emerald-400">{sub.status}</span>
            </p>
            {sub.current_period_end && (
              <p className="text-sm text-neutral-400">
                {sub.cancel_at_period_end ? "Cancels" : "Renews"} on{" "}
                {new Date(sub.current_period_end).toLocaleDateString()}
              </p>
            )}
            <button
              onClick={manage}
              className="mt-4 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
            >
              Manage subscription
            </button>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
            >
              <h2 className="text-xl font-semibold">{tier.name}</h2>
              <p className="text-neutral-400">{tier.blurb}</p>
              <p className="mt-4 text-3xl font-bold">{tier.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                {tier.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <button
                onClick={() => subscribe(tier.priceId)}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-indigo-500 px-4 py-2.5 font-medium hover:bg-indigo-400 disabled:opacity-50"
              >
                {loading ? "Loading…" : `Subscribe to ${tier.name}`}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={loadSubscription}
          className="mt-8 text-sm text-neutral-500 underline hover:text-neutral-300"
        >
          Refresh status
        </button>
      </div>
    </main>
  );
}

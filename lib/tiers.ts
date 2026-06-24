// The two subscription tiers — mirrors the STEM project's "Group" and "1:1 Premium".
export const TIERS = [
  {
    id: "group",
    name: "Group",
    blurb: "Group mentorship sessions",
    price: "$19/mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROUP!,
    features: ["Weekly group sessions", "Community access", "Session recordings"],
  },
  {
    id: "premium",
    name: "1:1 Premium",
    blurb: "Private 1:1 mentorship",
    price: "$79/mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!,
    features: ["Everything in Group", "1:1 weekly calls", "Priority matching"],
  },
] as const;

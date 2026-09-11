// Master switch for the whole payments feature.
// Set NEXT_PUBLIC_PAYMENTS_ENABLED=true in your env (Vercel + .env.local)
// only when you're ready to go live. Until then, everything stays free
// and none of this code path runs.
export const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';

export const PREMIUM_PRICE_PAISE = Number(
  process.env.NEXT_PUBLIC_PREMIUM_PRICE_PAISE ?? 19900
); // default ₹199.00 (Razorpay works in paise)

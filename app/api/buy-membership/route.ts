import Stripe from "stripe";
import { requestWithAuth } from "@/app/api/_common/endpoints";

export const GET = requestWithAuth(async (supabase, profile, request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1QIelOBMG61myACDnz2W1s0I",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: request.headers.get("referer")!,
    cancel_url: request.headers.get("referer")!,
    metadata: {
      supabase_user_id: profile?.id,
    },
  });

  return { url: session.url };
});

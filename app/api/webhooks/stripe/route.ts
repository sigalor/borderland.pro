import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const relevantEvents = new Set(["checkout.session.completed"]);

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = await createClient();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not found." },
        { status: 400 }
      );
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (!session.metadata?.supabase_user_id) {
            throw new Error("No user ID found in session metadata");
          }

          const { data, error } = await supabase
            .from("profiles")
            .select("api_credits")
            .eq("id", session.metadata.supabase_user_id)
            .single();

          if (error) {
            throw new Error(
              "User not found: " + session.metadata.supabase_user_id
            );
          }

          // add amount_total * 10000 to the user's api credits
          // i.e. €1 = 1,000,000 credits
          const newCredits =
            (data.api_credits ?? 0) + session.amount_total! * 10000;
          await supabase
            .from("profiles")
            .update({
              api_credits: newCredits,
            })
            .eq("id", session.metadata.supabase_user_id);

          console.log(
            `Updated credits for user ${session.metadata.supabase_user_id} to ${newCredits} (added ${session.amount_total! * 10000})`
          );
          break;
        }
        default: {
          throw new Error("Unhandled relevant event!");
        }
      }
    } catch (error) {
      console.error(`Error handling event: ${event.type}`, error);
      return NextResponse.json(
        { error: "Webhook handler failed. View your Next.js function logs." },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: `Unsupported event type: ${event.type}` },
      { status: 400 }
    );
  }
  return NextResponse.json({ received: true }, { status: 200 });
}

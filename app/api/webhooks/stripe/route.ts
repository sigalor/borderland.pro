import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { BurnConfig } from "@/utils/types";
import { query } from "@/app/api/_common/endpoints";
import { stripeCurrenciesWithoutDecimals } from "@/app/api/_common/stripe";

export async function POST(req: Request) {
  const supabase = await createClient();
  const allProjects = await query(() =>
    supabase.from("projects").select("*, burn_config(*)")
  );
  let event: Stripe.Event;

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  // TODO: use webhook endpoint metadata instead to determine which project to use
  const suitableProjects = allProjects.filter((project: any) => {
    const burnConfig: BurnConfig = project.burn_config[0];
    if (burnConfig.stripe_secret_api_key && burnConfig.stripe_webhook_secret) {
      try {
        const stripe = new Stripe(burnConfig.stripe_secret_api_key);
        event = stripe.webhooks.constructEvent(
          body,
          sig,
          burnConfig.stripe_webhook_secret
        );
        return true;
      } catch (e: any) {
        console.log(e);
        return false;
      }
    }
    return false;
  });

  if (suitableProjects.length === 0) {
    return NextResponse.json(
      { error: "No suitable projects found" },
      { status: 400 }
    );
  } else if (suitableProjects.length > 1) {
    return NextResponse.json(
      { error: "Multiple suitable projects found" },
      { status: 400 }
    );
  }

  try {
    if (event!.type === "checkout.session.completed") {
      const membershipId = event.data.object.metadata?.membership_id;
      if (!membershipId) {
        return NextResponse.json(
          { error: "No membership ID found in session metadata" },
          { status: 400 }
        );
      }

      // make sure the membership exists
      const membership = await query(() =>
        supabase
          .from("burn_memberships")
          .select("*")
          .eq("id", membershipId)
          .eq("project_id", suitableProjects[0].id)
          .single()
      );
      if (membership.owner_id !== event.data.object.metadata?.owner_id) {
        console.warn(
          "Wrong owner ID, even though purchase was successful (expected: " +
            membership.owner_id +
            ", got: " +
            event.data.object.metadata?.owner_id +
            ")"
        );
        return NextResponse.json({ error: "Wrong owner ID" }, { status: 400 });
      }

      const session = event.data.object;
      await query(() =>
        supabase
          .from("burn_memberships")
          .update({
            price: stripeCurrenciesWithoutDecimals.includes(
              session.currency!.toUpperCase()
            )
              ? session.amount_total
              : session.amount_total! / 100,
            price_currency: session.currency!.toUpperCase(),
            paid_at: new Date().toISOString(),
          })
          .eq("id", membershipId)
      );

      return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Webhook handler failed. View your Next.js function logs." },
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";
import { BurnRole } from "@/utils/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeCurrenciesWithoutDecimals } from "@/app/api/_common/stripe";

const PurchaseMembershipRequestSchema = s.object({
  origin: s.string(),
  tier: s.number(),
});

export const POST = requestWithProject<
  s.infer<typeof PurchaseMembershipRequestSchema>
>(
  async (supabase, profile, request, body, project) => {
    if (!project?.burn_config.stripe_secret_api_key) {
      return NextResponse.json(
        { error: "No Stripe API key configured" },
        { status: 400 }
      );
    }

    if (!project?.membership) {
      return NextResponse.json(
        { error: "User has no membership" },
        { status: 400 }
      );
    }

    if (project?.membership?.paid_at) {
      return NextResponse.json(
        { error: "Membership already purchased" },
        { status: 400 }
      );
    }

    if (body.tier !== 1 && body.tier !== 2 && body.tier !== 3) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (body.tier === 1 && !project?.lottery_ticket?.is_low_income) {
      return NextResponse.json(
        { error: "Not eligible for low income tier" },
        { status: 400 }
      );
    }

    let stripeUnitAmount = [
      project.burn_config.membership_price_tier_1,
      project.burn_config.membership_price_tier_2,
      project.burn_config.membership_price_tier_3,
    ][body.tier - 1];
    if (
      !stripeCurrenciesWithoutDecimals.includes(
        project.burn_config.membership_price_currency
      )
    ) {
      stripeUnitAmount = Math.round(stripeUnitAmount * 100);
    }

    const stripe = new Stripe(project.burn_config.stripe_secret_api_key);
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: profile.email,
      line_items: [
        {
          price_data: {
            currency:
              project.burn_config.membership_price_currency.toLowerCase(),
            product_data: {
              name: "Membership for " + project.name,
            },
            unit_amount: stripeUnitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: body.origin + "?success=true",
      cancel_url: body.origin,
      metadata: {
        owner_id: profile.id,
        membership_id: project.membership.id,
      },
    });

    if (!project.burn_config.stripe_webhook_secret) {
      const originUrl = new URL(body.origin);
      const isLocal =
        originUrl.hostname === "localhost" ||
        originUrl.hostname === "127.0.0.1";
      const whEndpoint = await stripe.webhookEndpoints.create({
        url: originUrl.origin + "/api/webhooks/stripe",
        enabled_events: ["checkout.session.completed"],
        metadata: {
          project_id: project.id,
        },
      });
      await supabase
        .from("burn_projects")
        .update({
          stripe_webhook_secret: whEndpoint.secret,
        })
        .eq("id", project.id);
    }

    return { url: stripeSession.url };
  },
  PurchaseMembershipRequestSchema,
  BurnRole.Participant
);

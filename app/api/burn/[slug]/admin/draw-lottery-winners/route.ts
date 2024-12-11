import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnLotteryTicket, BurnRole } from "@/utils/types";
import { s } from "ajv-ts";
import { NextResponse } from "next/server";

const DrawLotteryWinnersRequestSchema = s.object({
  count: s.number(),
});

export const POST = requestWithProject<
  s.infer<typeof DrawLotteryWinnersRequestSchema>
>(
  async (supabase, profile, request, { count }, project) => {
    const allLotteryTickets: BurnLotteryTicket[] = await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .select("*")
        .eq("project_id", project!.id)
    );

    if (allLotteryTickets.length < count) {
      return NextResponse.json(
        { error: "Not enough lottery tickets" },
        { status: 400 }
      );
    }

    const winners = allLotteryTickets
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .update({ is_winner: true, can_invite_plus_one: true })
        .in(
          "id",
          winners.map((winner) => winner.id)
        )
    );
  },
  DrawLotteryWinnersRequestSchema,
  BurnRole.Admin
);

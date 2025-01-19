import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";
import { NextResponse } from "next/server";
import { BurnStage, BurnRole } from "@/utils/types";

const EnterLotteryRequestSchema = s.object({
  first_name: s.string(),
  last_name: s.string(),
  birthdate: s.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  is_low_income: s.boolean(),
  metadata: s.object(),
});

export const POST = requestWithProject<
  s.infer<typeof EnterLotteryRequestSchema>
>(
  async (supabase, profile, request, body, project) => {
    if (project?.burn_config.current_stage !== BurnStage.LotteryOpen) {
      return NextResponse.json(
        { error: "Lottery is not open" },
        { status: 400 }
      );
    }

    if (project.lottery_ticket) {
      return NextResponse.json(
        { error: "This account already has a lottery ticket" },
        { status: 400 }
      );
    }

    // check if a lottery ticket with the same first name, last name and birthdate already exists
    const existingTickets = await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .select("id")
        .eq("project_id", project!.id)
        .eq("first_name", body.first_name)
        .eq("last_name", body.last_name)
        .eq("birthdate", body.birthdate)
    );

    if (existingTickets.length > 0) {
      return NextResponse.json(
        { error: "You have already entered the lottery" },
        { status: 400 }
      );
    }

    const ret = await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .insert({
          project_id: project!.id,
          owner_id: profile.id,
          ...body,
        })
        .select()
        .single()
    );
    return ret;
  },
  EnterLotteryRequestSchema,
  BurnRole.Participant
);

export const DELETE = requestWithProject(
  async (supabase, profile, request, body, project) => {
    if (project?.burn_config.current_stage !== BurnStage.LotteryOpen) {
      return NextResponse.json(
        { error: "Lottery is not open" },
        { status: 400 }
      );
    }

    if (!project?.lottery_ticket) {
      return NextResponse.json(
        { error: "No lottery ticket found" },
        { status: 400 }
      );
    }

    const ret = await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .delete()
        .eq("id", project.lottery_ticket!.id)
    );
    return ret;
  },
  undefined,
  BurnRole.Participant
);

import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";
import { BurnRole, BurnStage } from "@/utils/types";
import { getProfile } from "@/app/api/_common/profile";

const InvitePlusOneRequestSchema = s.object({
  email: s.string(),
});

export const POST = requestWithProject<
  s.infer<typeof InvitePlusOneRequestSchema>
>(
  async (supabase, profile, request, body, project) => {
    if (project?.burn_config.current_stage !== BurnStage.LotteryClosed) {
      throw new Error(
        `Expected burn stage to be lottery-closed, got ${project?.burn_config.current_stage}`
      );
    }

    const recipient = await query(() =>
      supabase.from("profiles").select("*").eq("email", body.email)
    );

    if (recipient.length === 0) {
      throw new Error("Recipient not found");
    }

    const recipientProfile = await getProfile(supabase, recipient[0].id);
    const recipientProject = recipientProfile.projects.find(
      (p) => p.id === project!.id
    );

    if (!recipientProject) {
      throw new Error(`Recipient needs to join "${project?.name}" first`);
    }

    if (recipientProject.membership_purchase_right) {
      throw new Error(
        "Recipient already has an available membership to purchase"
      );
    }

    if (recipientProject.membership) {
      throw new Error("Recipient already has a membership");
    }

    // create a membership purchase right for the recipient
    await query(() =>
      supabase.from("burn_membership_purchase_rights").insert({
        project_id: project!.id,
        owner_id: recipientProfile.id,
        expires_at: recipientProject.burn_config.open_sale_starting_at,
        is_low_income: false,
        details_modifiable: true,
      })
    );

    // set "can_invite_plus_one" to false for the lottery ticket,
    // so that the user can't invite another +1
    await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .update({ can_invite_plus_one: false })
        .eq("id", project!.lottery_ticket!.id)
    );
  },
  InvitePlusOneRequestSchema,
  BurnRole.Participant
);

import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";
import { s } from "ajv-ts";
import {
  getProfileByEmail,
  validateNewMembershipEligibility,
} from "@/app/api/_common/profile";

export const GET = requestWithProject(
  async (supabase, profile, request, body, project) => {
    return {
      data: await query(() =>
        supabase
          .from("burn_membership_purchase_rights")
          .select("*, profiles(email)")
          .eq("project_id", project!.id)
          .gt("expires_at", new Date().toISOString())
      ),
    };
  },
  undefined,
  BurnRole.MembershipManager
);

const IssueMembershipPurchaseRightRequestSchema = s.object({
  email: s.string(),
});

export const POST = requestWithProject<
  s.infer<typeof IssueMembershipPurchaseRightRequestSchema>
>(
  async (supabase, profile, request, body, project) => {
    const recipientProfile = await getProfileByEmail(supabase, body.email);
    validateNewMembershipEligibility(recipientProfile, project!);

    await query(() =>
      supabase.from("burn_membership_purchase_rights").insert({
        project_id: project!.id,
        owner_id: recipientProfile.id,
        expires_at: new Date(
          new Date().getTime() +
            project?.burn_config.transfer_reservation_duration! * 1000
        ).toISOString(),
        is_low_income: false,
        details_modifiable: true,
      })
    );
  },
  IssueMembershipPurchaseRightRequestSchema,
  BurnRole.MembershipManager
);

import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";
import { BurnRole } from "@/utils/types";
import { checkNoSuchMembershipOrPurchaseRightExists } from "@/app/api/_common/profile";

const SetMembershipPurchaseRightDetailsRequestSchema = s.object({
  first_name: s.string(),
  last_name: s.string(),
  birthdate: s.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
});

export const PATCH = requestWithProject<
  s.infer<typeof SetMembershipPurchaseRightDetailsRequestSchema>
>(
  async (supabase, profile, request, body, project) => {
    if (!project!.membership_purchase_right) {
      throw new Error("No membership purchase right found");
    }

    if (!project?.membership_purchase_right.details_modifiable) {
      throw new Error("Details are not modifiable");
    }

    await checkNoSuchMembershipOrPurchaseRightExists(
      supabase,
      project!.id,
      body.first_name,
      body.last_name,
      body.birthdate
    );

    await query(() =>
      supabase
        .from("burn_membership_purchase_rights")
        .update({
          first_name: body.first_name,
          last_name: body.last_name,
          birthdate: body.birthdate,
          details_modifiable: false,
        })
        .eq("id", project!.membership_purchase_right!.id)
    );
  },
  SetMembershipPurchaseRightDetailsRequestSchema,
  BurnRole.Participant
);

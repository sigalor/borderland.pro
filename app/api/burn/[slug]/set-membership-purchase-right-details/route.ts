import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";
import { BurnRole, BurnStage } from "@/utils/types";
import { getProfile } from "@/app/api/_common/profile";

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

    const existingMembershipPurchaseRight = await query(() =>
      supabase
        .from("burn_membership_purchase_rights")
        .select("*")
        .eq("project_id", project!.id)
        .eq("first_name", body.first_name)
        .eq("last_name", body.last_name)
        .eq("birthdate", body.birthdate)
        .gte("expires_at", new Date().toISOString())
    );
    if (existingMembershipPurchaseRight.length > 0) {
      throw new Error(
        "This individual already has an active membership purchase right"
      );
    }

    const existingMembership = await query(() =>
      supabase
        .from("burn_memberships")
        .select("*")
        .eq("project_id", project!.id)
        .eq("first_name", body.first_name)
        .eq("last_name", body.last_name)
        .eq("birthdate", body.birthdate)
    );
    if (existingMembership.length > 0) {
      throw new Error("This individual already has a membership");
    }

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

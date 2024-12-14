import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";
import { getAvailableMemberships } from "@/app/api/_common/profile";

export const POST = requestWithProject(
  async (supabase, profile, request, body, project) => {
    const availableMemberships = await getAvailableMemberships(
      supabase,
      project!
    );

    if (availableMemberships === 0) {
      throw new Error("No memberships available");
    }

    await supabase.from("burn_membership_purchase_rights").insert({
      project_id: project!.id,
      owner_id: profile!.id,
      expires_at: new Date(
        new Date().getTime() +
          project?.burn_config.open_sale_reservation_duration! * 1000
      ).toISOString(),
      is_low_income: false,
      details_modifiable: true,
    });
  },
  undefined,
  BurnRole.Participant
);

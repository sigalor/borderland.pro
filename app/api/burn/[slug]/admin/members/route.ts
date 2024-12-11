import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";

export const GET = requestWithProject(
  async (supabase, profile, request, body, project) => {
    const allMemberships = await query(() =>
      supabase
        .from("burn_memberships")
        .select("*, profiles(email)")
        .eq("project_id", project!.id)
    );

    const reservedAndValidMemberships = allMemberships.filter(
      (membership: any) =>
        membership.paid_at || new Date(membership.reserved_until!) > new Date()
    );

    return {
      data: reservedAndValidMemberships,
    };
  },
  undefined,
  BurnRole.Admin
);

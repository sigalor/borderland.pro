import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";

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
  BurnRole.Admin
);

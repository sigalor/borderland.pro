import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";

export const GET = requestWithProject(
  async (supabase, profile, request, body, project) => {
    return {
      data: await query(() =>
        supabase
          .from("burn_memberships")
          .select("*")
          .eq("project_id", project!.id)
      ),
    };
  },
  undefined,
  BurnRole.Admin
);

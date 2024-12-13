import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";

export const DELETE = requestWithProject(
  async (supabase, profile, request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    return await query(() =>
      supabase.from("burn_membership_purchase_rights").delete().eq("id", id)
    );
  },
  undefined,
  BurnRole.Admin
);

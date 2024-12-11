import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";
import { BurnRole } from "@/utils/types";

const UpdateBurnConfigRequestSchema = s.object({
  current_stage: s.string(),
  max_memberships: s.number(),
  open_sale_starting_at: s.string(),
  open_sale_reservation_duration: s.number(),
  transfer_reservation_duration: s.number(),
});

export const PATCH = requestWithProject<
  s.infer<typeof UpdateBurnConfigRequestSchema>
>(
  async (supabase, profile, request, body, project) => {
    const ret = await query(() =>
      supabase
        .from("burn_config")
        .update(body)
        .eq("project_id", project!.id)
        .select()
        .single()
    );
    return ret;
  },
  UpdateBurnConfigRequestSchema,
  BurnRole.Admin
);

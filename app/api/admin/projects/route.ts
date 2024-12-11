import { s } from "ajv-ts";
import { requestWithAuthAdmin, query } from "@/app/api/_common/endpoints";
import { BurnStage, BurnRole } from "@/utils/types";

export const GET = requestWithAuthAdmin(async (supabase) => {
  return { data: await query(() => supabase.from("projects").select("*")) };
});

const CreateProjectRequestSchema = s.object({
  name: s.string(),
  type: s.string(),
  slug: s.string(),
});

export const POST = requestWithAuthAdmin<
  s.infer<typeof CreateProjectRequestSchema>
>(async (supabase, profile, request, body) => {
  const { name, type, slug } = body;

  const project = await query(() =>
    supabase.from("projects").insert({ name, type, slug }).select().single()
  );

  await query(() =>
    supabase.from("burn_config").insert({
      project_id: project.id,
      current_stage: BurnStage.LotteryOpen,
      open_sale_starting_at: new Date().toISOString(),
      open_sale_reservation_duration: 60 * 15,
      transfer_reservation_duration: 60 * 60 * 24 * 3,
      max_memberships: 100,
    })
  );

  const initialRoles = [BurnRole.Admin, BurnRole.Participant];

  for (const role of initialRoles) {
    const newRole = await query(() =>
      supabase
        .from("roles")
        .insert({
          project_id: project.id,
          name: role,
        })
        .select()
        .single()
    );

    await query(() =>
      supabase.from("role_assignments").insert({
        user_id: profile.id,
        role_id: newRole.id,
      })
    );
  }
}, CreateProjectRequestSchema);

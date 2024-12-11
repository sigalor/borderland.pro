import { requestWithAuthAdmin, query } from "@/app/api/_common/endpoints";
import { s } from "ajv-ts";

export const GET = requestWithAuthAdmin(async (supabase) => {
  return {
    data: await query(() => supabase.from("roles").select("*, projects(name)")),
    projects: await query(() => supabase.from("projects").select("*")),
  };
});

const CreateRoleRequestSchema = s.object({
  projectId: s.string(),
  name: s.string(),
});

export const POST = requestWithAuthAdmin<
  s.infer<typeof CreateRoleRequestSchema>
>(async (supabase, profile, request, body) => {
  const { projectId, name } = body;

  return query(() =>
    supabase.from("roles").insert({ project_id: projectId, name })
  );
}, CreateRoleRequestSchema);

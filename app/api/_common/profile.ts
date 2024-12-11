import { SupabaseClient } from "@supabase/supabase-js";
import { query } from "./endpoints";
import { Profile } from "@/utils/types";

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile> {
  const profile = await query(() =>
    supabase
      .from("profiles")
      .select(
        "*, role_assignments(roles(name, project_id)), burn_lottery_tickets(*)"
      )
      .eq("id", userId)
      .single()
  );

  const projectIds = profile.role_assignments.map(
    (ra: any) => ra.roles.project_id
  );
  const projects = await query(() =>
    supabase.from("projects").select("*, burn_config(*)").in("id", projectIds)
  );

  for (const p of projects) {
    p.roles = profile.role_assignments
      .filter((ra: any) => ra.roles.project_id === p.id)
      .map((ra: any) => ra.roles.name);
    p.burn_config = p.burn_config[0];
  }
  delete profile.role_assignments;

  for (const lt of profile.burn_lottery_tickets) {
    const project = projects.find((p: any) => p.id === lt.project_id);
    project.lottery_ticket = lt;
  }
  delete profile.burn_lottery_tickets;

  return { ...profile, projects };
}

import { SupabaseClient } from "@supabase/supabase-js";
import { query } from "./endpoints";
import { Profile, Project } from "@/utils/types";

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile> {
  const profile = await query(() =>
    supabase
      .from("profiles")
      .select(
        "*, role_assignments(roles(name, project_id)), burn_lottery_tickets(*), burn_memberships(*)"
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

  for (const bm of profile.burn_memberships) {
    const project: Project = projects.find((p: any) => p.id === bm.project_id);
    project.membership = bm;

    if (
      !project.membership?.paid_at &&
      (!project.membership?.reserved_until ||
        +new Date(project.membership?.reserved_until) < +new Date())
    ) {
      // if the membership hasn't been paid yet and it hasn't been reserved or the reservation is expired, it doesn't actually belong to the user
      delete project.membership;
    }
  }
  delete profile.burn_memberships;

  return { ...profile, projects };
}

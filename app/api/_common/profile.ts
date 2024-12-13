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
        "*, role_assignments(roles(name, project_id)), burn_lottery_tickets(*), burn_membership_purchase_rights(*), burn_memberships(*)"
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

  for (const bmp of profile.burn_membership_purchase_rights) {
    if (new Date(bmp.expires_at) < new Date()) {
      continue;
    }

    const project: Project = projects.find((p: any) => p.id === bmp.project_id);
    project.membership_purchase_right = bmp;
  }
  delete profile.burn_membership_purchase_rights;

  for (const bm of profile.burn_memberships) {
    const project: Project = projects.find((p: any) => p.id === bm.project_id);
    project.membership = bm;
  }
  delete profile.burn_memberships;

  return { ...profile, projects };
}

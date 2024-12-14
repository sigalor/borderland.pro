import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole } from "@/utils/types";
import { getAvailableMemberships } from "@/app/api/_common/profile";

export const GET = requestWithProject(
  async (supabase, profile, request, body, project) => {
    const availableMemberships = await getAvailableMemberships(
      supabase,
      project!
    );

    return { availableMemberships };
  },
  undefined,
  BurnRole.Participant
);

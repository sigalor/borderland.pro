import { requestWithAuthAdmin, query } from "@/app/api/_common/endpoints";

export const GET = requestWithAuthAdmin(async (supabase) => {
  const allProfiles = await query(() =>
    supabase
      .from("profiles")
      .select("*")
      .order("registered_at", { ascending: false })
  );

  return { data: allProfiles };
});

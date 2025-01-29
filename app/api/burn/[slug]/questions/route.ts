import { requestWithProject, query } from "@/app/api/_common/endpoints";

export const GET = requestWithProject(
  async (supabase, profile, request, body, project) => {
   
    const allQuestions = await query(() =>supabase
    .from("questions")
    .select("*")
    .eq("project_id", project!.id)
    
    );
    return { data: allQuestions };
  
});



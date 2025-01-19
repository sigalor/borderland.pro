import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole, BurnStage } from "@/utils/types";

export const POST = requestWithProject(
  async (supabase, profile, request, body, project) => {
    if (project!.burn_config.current_stage !== BurnStage.LotteryClosed) {
      throw new Error("Burn stage must be lottery-closed");
    }

    if (+new Date() < +new Date(project!.burn_config.open_sale_starting_at)) {
      throw new Error("Cannot start open sale before 'open_sale_starting_at'");
    }

    await query(() =>
      supabase
        .from("burn_config")
        .update({ current_stage: BurnStage.OpenSale })
        .eq("id", project!.burn_config.id!)
    );
  },
  undefined,
  BurnRole.MembershipManager
);

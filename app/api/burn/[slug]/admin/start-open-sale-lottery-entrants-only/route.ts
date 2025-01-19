import { requestWithProject, query } from "@/app/api/_common/endpoints";
import { BurnRole, BurnStage } from "@/utils/types";

export const POST = requestWithProject(
  async (supabase, profile, request, body, project) => {
    if (project!.burn_config.current_stage !== BurnStage.LotteryClosed) {
      throw new Error(`Burn stage must be ${BurnStage.LotteryClosed}`);
    }

    if (
      +new Date() <
      +new Date(
        project!.burn_config.open_sale_lottery_entrants_only_starting_at
      )
    ) {
      throw new Error(
        "Cannot start open sale before 'open_sale_lottery_entrants_only_starting_at'"
      );
    }

    await query(() =>
      supabase
        .from("burn_config")
        .update({ current_stage: BurnStage.OpenSaleLotteryEntrantsOnly })
        .eq("id", project!.burn_config.id!)
    );
  },
  undefined,
  BurnRole.MembershipManager
);

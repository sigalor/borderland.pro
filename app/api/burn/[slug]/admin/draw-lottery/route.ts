import { requestWithProject, query } from "@/app/api/_common/endpoints";
import {
  BurnLotteryTicket,
  BurnRole,
  BurnConfig,
  BurnMembershipPurchaseRight,
} from "@/utils/types";

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// draw lottery winners
export const POST = requestWithProject(
  async (supabase, profile, request, body, project) => {
    const burnConfig: BurnConfig = await query(() =>
      supabase
        .from("burn_config")
        .select("*")
        .eq("project_id", project!.id)
        .single()
    );

    const allLotteryTicketsShuffled: BurnLotteryTicket[] = shuffleArray(
      await query(() =>
        supabase
          .from("burn_lottery_tickets")
          .select("*")
          .eq("project_id", project!.id)
      )
    );

    if (allLotteryTicketsShuffled.some((lt) => lt.is_winner)) {
      throw new Error("Lottery winners already drawn");
    }

    // determine how many lottery winners there are in total
    const numLotteryWinners = Math.floor(
      (burnConfig.max_memberships * burnConfig.share_memberships_lottery) / 100
    );

    // determine how many low income winners there are
    const numReservedForLowIncome = Math.floor(
      (burnConfig.max_memberships * burnConfig.share_memberships_low_income) /
        100
    );

    // draw the low income winners
    const lowIncomeWinnerIds = allLotteryTicketsShuffled
      .filter((ticket) => ticket.is_low_income)
      .slice(0, numReservedForLowIncome)
      .map((ticket) => ticket.id);

    // from everyone who is not a low income winner, draw the rest of the lottery winners
    const otherWinnerIds =
      numLotteryWinners - lowIncomeWinnerIds.length > 0
        ? allLotteryTicketsShuffled
            .filter((ticket) => !lowIncomeWinnerIds.includes(ticket.id))
            .slice(0, numLotteryWinners - lowIncomeWinnerIds.length)
            .map((ticket) => ticket.id)
        : [];

    // update the database with the winners
    const winnerIds = [...lowIncomeWinnerIds, ...otherWinnerIds];
    await query(() =>
      supabase
        .from("burn_lottery_tickets")
        .update({ is_winner: true, can_invite_plus_one: true })
        .in("id", winnerIds)
    );

    // fetch winning lottery tickets
    const winningLotteryTickets: BurnLotteryTicket[] = await query(() =>
      supabase.from("burn_lottery_tickets").select("*").in("id", winnerIds)
    );

    const membershipPurchaseRights: Partial<BurnMembershipPurchaseRight>[] =
      winningLotteryTickets.map((ticket) => ({
        project_id: project!.id,
        owner_id: (ticket as any).owner_id,
        expires_at: burnConfig.open_sale_starting_at,
        first_name: ticket.first_name,
        last_name: ticket.last_name,
        birthdate: ticket.birthdate,
        is_low_income: lowIncomeWinnerIds.includes(ticket.id)
          ? ticket.is_low_income
          : false,
        details_modifiable: false,
      }));

    await query(() =>
      supabase
        .from("burn_membership_purchase_rights")
        .insert(membershipPurchaseRights)
    );

    return {
      numDrawn: lowIncomeWinnerIds.length + otherWinnerIds.length,
    };
  },
  undefined,
  BurnRole.Admin
);

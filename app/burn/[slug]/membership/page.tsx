"use client";

import React from "react";
import Heading from "@/app/_components/Heading";
import { useProject } from "@/app/_components/SessionContext";
import { BurnStage } from "@/utils/types";
import LotteryOpenNotEntered from "./components/LotteryOpenNotEntered";
import LotteryOpenEntered from "./components/LotteryOpenEntered";
import LotteryClosedNotEntered from "./components/LotteryClosedNotEntered";
import LotteryClosedWinner from "./components/LotteryClosedWinner";
import LotteryClosedNotWinner from "./components/LotteryClosedNotWinner";

export enum MembershipStatus {
  LotteryOpenNotEntered,
  LotteryOpenEntered,
  LotteryClosedNotEntered,
  LotteryClosedWinner,
  LotteryClosedNotWinner,
  Invalid,
}

export default function MembershipPage() {
  const { project } = useProject();

  const getMembershipStatus = (): MembershipStatus => {
    const stage = project?.burn_config.current_stage;
    const hasEntered = !!project?.lottery_ticket;
    const hasWon = !!project?.lottery_ticket?.is_winner;

    if (stage === BurnStage.LotteryOpen) {
      if (hasEntered) {
        return MembershipStatus.LotteryOpenEntered;
      } else {
        return MembershipStatus.LotteryOpenNotEntered;
      }
    } else if (stage === BurnStage.LotteryClosed) {
      if (hasEntered) {
        if (hasWon) {
          return MembershipStatus.LotteryClosedWinner;
        } else {
          return MembershipStatus.LotteryClosedNotWinner;
        }
      } else {
        return MembershipStatus.LotteryClosedNotEntered;
      }
    }

    return MembershipStatus.Invalid;
  };

  const renderContent = () => {
    switch (getMembershipStatus()) {
      case MembershipStatus.LotteryOpenNotEntered:
        return <LotteryOpenNotEntered />;
      case MembershipStatus.LotteryOpenEntered:
        return <LotteryOpenEntered />;
      case MembershipStatus.LotteryClosedNotEntered:
        return <LotteryClosedNotEntered />;
      case MembershipStatus.LotteryClosedWinner:
        return <LotteryClosedWinner />;
      case MembershipStatus.LotteryClosedNotWinner:
        return <LotteryClosedNotWinner />;
      case MembershipStatus.Invalid:
        return <div>Invalid membership status</div>;
    }
  };

  return (
    <div>
      <Heading>Membership lottery</Heading>
      {renderContent()}
    </div>
  );
}

"use client";

import React from "react";
import Heading from "@/app/_components/Heading";
import { useProject } from "@/app/_components/SessionContext";
import { BurnStage } from "@/utils/types";
import LotteryOpenNotEntered from "./components/LotteryOpenNotEntered";
import LotteryOpenEntered from "./components/LotteryOpenEntered";
import LotteryClosedNotEntered from "./components/LotteryClosedNotEntered";
import MembershipAvailable from "./components/MembershipAvailable";
import LotteryClosedNotWinner from "./components/LotteryClosedNotWinner";
import Member from "./components/Member";

export enum MembershipStatus {
  LotteryOpenNotEntered,
  LotteryOpenEntered,
  LotteryClosedNotEntered,
  LotteryClosedNotWinner,
  MembershipAvailable,
  Member,
  Invalid,
}

export default function MembershipPage() {
  const { project } = useProject();

  const getMembershipStatus = (): MembershipStatus => {
    const stage = project?.burn_config.current_stage;
    const hasEntered = !!project?.lottery_ticket;
    const hasWon = !!project?.lottery_ticket?.is_winner;

    if (project?.membership) {
      if (project?.membership?.paid_at) {
        return MembershipStatus.Member;
      } else {
        return MembershipStatus.MembershipAvailable;
      }
    }

    if (stage === BurnStage.LotteryOpen) {
      if (hasEntered) {
        return MembershipStatus.LotteryOpenEntered;
      } else {
        return MembershipStatus.LotteryOpenNotEntered;
      }
    } else if (stage === BurnStage.LotteryClosed) {
      if (hasEntered) {
        if (!hasWon) {
          return MembershipStatus.LotteryClosedNotWinner;
        }
      } else {
        return MembershipStatus.LotteryClosedNotEntered;
      }
    }
    return MembershipStatus.Invalid;
  };

  const membershipStatus = getMembershipStatus();

  const renderContent = () => {
    switch (membershipStatus) {
      case MembershipStatus.LotteryOpenNotEntered:
        return <LotteryOpenNotEntered />;
      case MembershipStatus.LotteryOpenEntered:
        return <LotteryOpenEntered />;
      case MembershipStatus.LotteryClosedNotEntered:
        return <LotteryClosedNotEntered />;
      case MembershipStatus.LotteryClosedNotWinner:
        return <LotteryClosedNotWinner />;
      case MembershipStatus.MembershipAvailable:
        return <MembershipAvailable />;
      case MembershipStatus.Member:
        return <Member />;
      case MembershipStatus.Invalid:
        return <div>Invalid membership status</div>;
    }
  };

  return (
    <div>
      <Heading>
        {membershipStatus === MembershipStatus.Member ||
        membershipStatus === MembershipStatus.MembershipAvailable
          ? "Your membership"
          : "Membership lottery"}
      </Heading>
      {renderContent()}
    </div>
  );
}

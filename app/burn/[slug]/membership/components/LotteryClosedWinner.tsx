"use client";

import React from "react";
import { useProject } from "@/app/_components/SessionContext";
import LotteryTicketDetailsWithHeading from "./LotteryTicketDetailsWithHeading";

export default function LotteryClosedWinner() {
  const { project } = useProject();

  return (
    <>
      <div className="flex flex-col gap-4">
        Congratulations, you have won the lottery! 🎉
      </div>
      <LotteryTicketDetailsWithHeading />
    </>
  );
}

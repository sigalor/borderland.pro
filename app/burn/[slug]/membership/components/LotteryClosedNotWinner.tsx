"use client";

import React from "react";
import LotteryTicketDetailsWithHeading from "./LotteryTicketDetailsWithHeading";

export default function LotteryClosedNotWinner() {
  return (
    <>
      <div className="flex flex-col gap-4">You did not win.</div>
      <LotteryTicketDetailsWithHeading />
    </>
  );
}

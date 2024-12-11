"use client";

import React from "react";
import { useProject } from "@/app/_components/SessionContext";
import Heading from "@/app/_components/Heading";
import LotteryTicketDetails from "./LotteryTicketDetails";

export default function LotteryTicketDetailsWithHeading() {
  return (
    <>
      <Heading className="mt-8">Your details</Heading>
      <div className="flex flex-col gap-4">
        <LotteryTicketDetails />
      </div>
    </>
  );
}

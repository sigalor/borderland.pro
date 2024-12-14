"use client";

import React from "react";
import MemberDetailsWithHeading from "./helpers/MemberDetailsWithHeading";
import { useProject } from "@/app/_components/SessionContext";

export default function LotteryClosedNotWinner() {
  const { project } = useProject();

  return (
    <>
      <div className="flex flex-col gap-4">
        Unfortunately you did not win in the lottery, but you will be able to
        purchase a membership in the open sale, which will start on{" "}
        {new Date(project?.burn_config.open_sale_starting_at!).toLocaleString()}
        .
      </div>
      <MemberDetailsWithHeading data={project?.lottery_ticket!} />
    </>
  );
}

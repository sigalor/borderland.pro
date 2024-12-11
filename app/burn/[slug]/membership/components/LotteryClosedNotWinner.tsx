"use client";

import React from "react";
import MemberDetailsWithHeading from "./MemberDetailsWithHeading";
import { useProject } from "@/app/_components/SessionContext";

export default function LotteryClosedNotWinner() {
  const { project } = useProject();

  return (
    <>
      <div className="flex flex-col gap-4">
        Unfortunately you did not win in the lottery, but you will be able to
        purchase a membership in the open sale, which will start on{" "}
        {new Date(project?.membership?.reserved_until!).toLocaleString()}.
      </div>
      <MemberDetailsWithHeading data={project?.lottery_ticket!} />
    </>
  );
}

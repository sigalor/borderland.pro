"use client";

import React from "react";
import { useProject } from "@/app/_components/SessionContext";
import MemberDetails from "./MemberDetails";

export default function Member() {
  const { project } = useProject();

  return (
    <>
      <div className="flex flex-col gap-4">
        <p>
          Congratulations, you have successfully purchased a membership for{" "}
          {project?.name}! 🎉
        </p>
        <MemberDetails data={project?.membership!} />
      </div>
    </>
  );
}

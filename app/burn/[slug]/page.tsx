"use client";

import React from "react";
import { useProject } from "@/app/_components/SessionContext";
import Heading from "@/app/_components/Heading";

export default function ProjectPage() {
  const { project } = useProject();

  return (
    <div>
      <Heading>{project?.name}</Heading>
    </div>
  );
}

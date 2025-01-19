"use client";

import React from "react";
import { useProject } from "@/app/_components/SessionContext";

export default function OpenSaleUnavailable() {
  const { project } = useProject();

  return (
    <p>
      The open sale has started, but is currently only available to those who
      previously entered the lottery. Please check back on{" "}
      {new Date(
        project?.burn_config.open_sale_general_starting_at!
      ).toLocaleString()}
      , which is when the open sale opens for everyone.
    </p>
  );
}

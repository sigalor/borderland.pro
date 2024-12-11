"use client";

import React from "react";
import DataTable from "@/app/_components/admin/DataTable";
import { useProject } from "@/app/_components/SessionContext";

export default function MembersPage() {
  const { project } = useProject();
  return (
    <DataTable
      title="Members"
      endpoint={`/burn/${project?.slug}/admin/members`}
      columns={[{ key: "email", label: "Email" }]}
    />
  );
}

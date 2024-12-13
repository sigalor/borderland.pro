"use client";

import React from "react";
import DataTable from "@/app/_components/DataTable";
import { useProject } from "@/app/_components/SessionContext";

export default function MembershipPurchaseRightsPage() {
  const { project } = useProject();
  return (
    <DataTable
      title="Membership purchase rights"
      endpoint={`/burn/${project?.slug}/admin/membership-purchase-rights`}
      columns={[
        {
          key: "email",
          label: "Email",
          render: (_, row) => row.profiles.email,
        },
        {
          key: "first_name",
          label: "First name",
        },
        {
          key: "last_name",
          label: "Last name",
        },
        {
          key: "birthdate",
          label: "Date of birth",
          render: (bd) => bd,
        },
        {
          key: "is_low_income",
          label: "Is low income?",
        },
        {
          key: "expires_at",
          label: "Expires at",
        },
      ]}
      rowActionsCrud={{
        delete: true,
      }}
    />
  );
}

"use client";

import React from "react";
import DataTable from "@/app/_components/admin/DataTable";
import { useProject } from "@/app/_components/SessionContext";
import { formatMoney } from "@/app/_components/utils";

export default function MembersPage() {
  const { project } = useProject();
  return (
    <DataTable
      title="Memberships"
      endpoint={`/burn/${project?.slug}/admin/members`}
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
          key: "price",
          label: "Price",
          render: (_, { price, price_currency }) =>
            typeof price === "number"
              ? formatMoney(price, price_currency)
              : undefined,
        },
        {
          key: "paid_at",
          label: "Paid at",
        },
      ]}
    />
  );
}

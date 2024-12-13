"use client";

import React from "react";
import DataTable from "@/app/_components/DataTable";

export default function UsersPage() {
  return (
    <DataTable
      endpoint="/admin/users"
      columns={[
        { key: "email", label: "Email" },
        { key: "registered_at", label: "Registration date" },
        { key: "is_admin", label: "Is admin?" },
      ]}
      title="Users"
    />
  );
}

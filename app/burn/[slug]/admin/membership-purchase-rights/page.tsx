"use client";

import React from "react";
import DataTable from "@/app/_components/DataTable";
import { useProject } from "@/app/_components/SessionContext";
import { usePrompt } from "@/app/_components/PromptContext";
import { apiPost } from "@/app/_components/api";
import { isEmail } from "@/app/_components/utils";

export default function MembershipPurchaseRightsPage() {
  const { project } = useProject();
  const prompt = usePrompt();

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
      globalActions={[
        {
          key: "issue-membership-purchase-right",
          label: "Issue membership purchase right",
          onClick: {
            prompt: () =>
              prompt("Enter the email of the recipient.", [
                {
                  key: "email",
                  label: "Email",
                  validate: (email) => isEmail(email),
                },
              ]),
            handler: async (_, promptData) => {
              await apiPost(
                `/burn/${project?.slug}/admin/membership-purchase-rights`,
                promptData
              );
              return true;
            },
          },
        },
      ]}
    />
  );
}

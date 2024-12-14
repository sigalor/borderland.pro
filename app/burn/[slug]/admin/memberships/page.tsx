"use client";

import React from "react";
import DataTable from "@/app/_components/DataTable";
import { useProject } from "@/app/_components/SessionContext";
import { formatMoney } from "@/app/_components/utils";
import { BurnStage } from "@/utils/types";
import { apiPost } from "@/app/_components/api";
import { usePrompt } from "@/app/_components/PromptContext";
import { isEmail } from "@/app/_components/utils";

export default function MembershipsPage() {
  const { project, reloadProfile } = useProject();
  const prompt = usePrompt();

  return (
    <DataTable
      title="Memberships"
      endpoint={`/burn/${project?.slug}/admin/memberships`}
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
            formatMoney(price, price_currency),
        },
      ]}
      globalActions={[
        {
          key: "issue-membership",
          label: "Issue membership",
          onClick: {
            prompt: () =>
              prompt("Enter the details of the membership to be issued.", [
                {
                  key: "email",
                  label: "Email",
                  validate: (email) => isEmail(email),
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
                  validate: (birthdate) =>
                    /^\d{4}-\d{2}-\d{2}$/.test(birthdate),
                },
              ]),
            handler: async (_, promptResult) => {
              await apiPost(
                `/burn/${project?.slug}/admin/memberships`,
                promptResult
              );
              return true;
            },
          },
        },
        {
          key: "start-open-sale",
          label: "Start open sale",
          condition: () =>
            project?.burn_config.current_stage === BurnStage.LotteryClosed,
          onClick: async () => {
            await apiPost(`/burn/${project?.slug}/admin/start-open-sale`);
            await reloadProfile();
          },
        },
      ]}
      rowActionsCrud={{
        delete: true,
      }}
    />
  );
}

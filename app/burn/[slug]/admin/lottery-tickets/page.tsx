"use client";

import React from "react";
import DataTable, { DataItem, FullData } from "@/app/_components/DataTable";
import { useProject } from "@/app/_components/SessionContext";
import { BurnStage } from "@/utils/types";
import { apiPost } from "@/app/_components/api";
import toast from "react-hot-toast";
import { BurnLotteryTicket } from "@/utils/types";
import { EyeOutlined } from "@ant-design/icons";
import { usePrompt } from "@/app/_components/PromptContext";

export default function LotteryTicketsPage() {
  const { project, updateBurnConfig, reloadProfile } = useProject();
  const prompt = usePrompt();

  const stage = project?.burn_config.current_stage;
  const hasWinners = (data?: FullData) =>
    (data ?? { data: [] }).data.some(
      (item: DataItem) => (item as BurnLotteryTicket).is_winner
    );

  return (
    <DataTable
      title="Lottery tickets"
      endpoint={`/burn/${project?.slug}/admin/lottery-tickets`}
      columns={[
        {
          key: "email",
          label: "Email",
          render: (_, row) => row.profiles.email,
        },
        { key: "first_name", label: "First name" },
        { key: "last_name", label: "Last name" },
        {
          key: "birthdate",
          label: "Date of birth",
          render: (bd) => bd,
        },
        { key: "is_low_income", label: "Is low income?" },
        { key: "is_winner", label: "Is winner?" },
        { key: "can_invite_plus_one", label: "Can invite +1?" },
      ]}
      globalActions={[
        {
          key: "close-lottery",
          label: "Close lottery",
          condition: () => stage === BurnStage.LotteryOpen,
          onClick: () =>
            updateBurnConfig({
              current_stage: BurnStage.LotteryClosed,
            }),
        },
        {
          key: "reopen-lottery",
          label: "Reopen lottery",
          condition: (data) =>
            stage === BurnStage.LotteryClosed && !hasWinners(data),
          onClick: () =>
            updateBurnConfig({ current_stage: BurnStage.LotteryOpen }),
        },
        {
          key: "draw-winners",
          label: "Draw winners",
          condition: (data) =>
            stage === BurnStage.LotteryClosed && !hasWinners(data),
          onClick: async () => {
            const { numDrawn } = await apiPost(
              `/burn/${project?.slug}/admin/draw-lottery`
            );
            await reloadProfile();
            toast.success(`${numDrawn} winners were drawn!`);
            return true;
          },
        },
      ]}
      rowActions={[
        {
          key: "view-metadata",
          icon: <EyeOutlined />,
          tooltip: "View metadata",
          condition: (row) =>
            row?.metadata && Object.keys(row.metadata).length > 0,
          onClick: async (row) => {
            await prompt(
              <div className="flex flex-col gap-2">
                <span>Metadata for {row?.profiles.email}</span>
                <pre className="text-sm font-normal">
                  {JSON.stringify(row?.metadata, null, 2)}
                </pre>
              </div>,
              undefined,
              "Close"
            );
          },
        },
      ]}
      rowActionsCrud={{
        delete: true,
      }}
    />
  );
}

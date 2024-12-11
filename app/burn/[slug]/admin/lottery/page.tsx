"use client";

import React from "react";
import DataTable from "@/app/_components/admin/DataTable";
import { useProject } from "@/app/_components/SessionContext";
import { usePrompt } from "@/app/_components/PromptContext";
import { BurnStage } from "@/utils/types";
import { ActionButtonDef } from "@/app/_components/ActionButton";
import { FullData } from "@/app/_components/admin/DataTable";
import { apiPost } from "@/app/_components/api";
import toast from "react-hot-toast";

export default function LotteryTicketsPage() {
  const { project, updateBurnConfig, reloadProfile } = useProject();
  const prompt = usePrompt();

  const actions: ActionButtonDef<FullData>[] = [];
  if (project?.burn_config.current_stage === BurnStage.LotteryOpen) {
    actions.push({
      key: "close-lottery",
      label: "Close lottery",
      onClick: () =>
        updateBurnConfig({
          current_stage: BurnStage.LotteryClosed,
        }),
    });
  } else if (project?.burn_config.current_stage === BurnStage.LotteryClosed) {
    actions.push({
      key: "reopen-lottery",
      label: "Reopen lottery",
      onClick: () => updateBurnConfig({ current_stage: BurnStage.LotteryOpen }),
    });
    actions.push({
      key: "draw-winners",
      label: "Draw winners",
      onClick: {
        prompt: () =>
          prompt(
            "How many winners do you want to draw? Note that you cannot reopen the lottery after winners have been drawn.",
            [
              {
                key: "count",
                label: "Count",
                validate: (value) =>
                  !isNaN(parseInt(value)) && parseInt(value) > 0,
                transform: (value) => parseInt(value),
              },
            ]
          ),
        handler: async (_, data) => {
          await apiPost(
            `/burn/${project?.slug}/admin/draw-lottery-winners`,
            data
          );
          await reloadProfile();
          toast.success(`${data!.count} winners drawn!`);
          return true;
        },
      },
    });
  }

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
          label: "Birthdate",
          render: (bd) => bd,
        },
        { key: "is_winner", label: "Is winner?" },
        { key: "can_invite_plus_one", label: "Can invite +1?" },
      ]}
      globalActions={actions}
    />
  );
}

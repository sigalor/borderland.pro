"use client";

import React from "react";
import { Input, Checkbox } from "@nextui-org/react";
import { LockOutlined } from "@ant-design/icons";
import { useProject } from "@/app/_components/SessionContext";

export default function LotteryTicketDetails() {
  const { project } = useProject();

  return (
    <>
      <Input
        label="First name"
        value={project?.lottery_ticket?.first_name || ""}
        isDisabled
        startContent={<LockOutlined />}
      />
      <Input
        label="Last name"
        value={project?.lottery_ticket?.last_name || ""}
        isDisabled
        startContent={<LockOutlined />}
      />
      <Input
        label="Birthdate (YYYY-MM-DD)"
        value={project?.lottery_ticket?.birthdate || ""}
        isDisabled
        startContent={<LockOutlined />}
      />
      <p className="text-sm text-gray-500">
        {project?.lottery_ticket?.is_low_income
          ? "Low income"
          : "Regular or high income"}
      </p>
    </>
  );
}

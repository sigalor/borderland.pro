"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { apiDelete } from "@/app/_components/api";
import { useProject } from "@/app/_components/SessionContext";
import toast from "react-hot-toast";
import LotteryTicketDetails from "./LotteryTicketDetails";

export default function LotteryOpenEntered() {
  const { project, updateProjectSimple } = useProject();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <LotteryTicketDetails />
      <Button
        color="success"
        isLoading={isLoading}
        onPress={async () => {
          setIsLoading(true);
          try {
            await apiDelete(`/burn/${project?.slug}/lottery`);
            updateProjectSimple({
              lottery_ticket: undefined,
            });
            toast.success("You have left the lottery!");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        You have successfully entered the lottery!
      </Button>
    </div>
  );
}

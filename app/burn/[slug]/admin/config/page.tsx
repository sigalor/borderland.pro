"use client";

import React, { useState } from "react";
import Heading from "@/app/_components/Heading";
import { Button, Input } from "@nextui-org/react";
import { useProject } from "@/app/_components/SessionContext";

export default function ConfigPage() {
  const { project, updateBurnConfig } = useProject();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(
    project!.burn_config.current_stage
  );
  const [maxMemberships, setMaxMemberships] = useState(
    (project!.burn_config.max_memberships ?? 0).toString()
  );
  const [openSaleStartingAt, setOpenSaleStartingAt] = useState(
    project!.burn_config.open_sale_starting_at ?? ""
  );
  const [openSaleReservationDuration, setOpenSaleReservationDuration] =
    useState(
      (project!.burn_config.open_sale_reservation_duration ?? 0).toString()
    );
  const [transferReservationDuration, setTransferReservationDuration] =
    useState(
      (project!.burn_config.transfer_reservation_duration ?? 0).toString()
    );

  const isISODate = (date: string | null) => date && !isNaN(Date.parse(date));
  const isNumber = (value: string) => !isNaN(parseInt(value));
  const isAllValid =
    ["lottery", "lottery-closed", "open-sale"].includes(currentStage) &&
    isNumber(maxMemberships) &&
    isNumber(openSaleReservationDuration) &&
    isNumber(transferReservationDuration) &&
    isISODate(openSaleStartingAt);

  const handleSave = async () => {
    setIsLoading(true);
    const newConfig = {
      current_stage: currentStage,
      max_memberships: parseInt(maxMemberships),
      open_sale_starting_at: new Date(openSaleStartingAt).toISOString(),
      open_sale_reservation_duration: parseInt(openSaleReservationDuration),
      transfer_reservation_duration: parseInt(transferReservationDuration),
    };
    try {
      await updateBurnConfig(newConfig);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Heading>Configuration</Heading>
      <div className="flex flex-col gap-4">
        <Input
          label="Current stage"
          value={currentStage}
          onValueChange={setCurrentStage}
        />
        <Input
          label="Maximum number of memberships"
          value={maxMemberships}
          onValueChange={setMaxMemberships}
        />
        <Input
          label="Open sale starting at"
          value={openSaleStartingAt}
          onValueChange={setOpenSaleStartingAt}
        />
        <Input
          label="Open sale reservation duration (in seconds)"
          value={openSaleReservationDuration}
          onValueChange={setOpenSaleReservationDuration}
        />
        <Input
          label="Transfer reservation duration (in seconds)"
          value={transferReservationDuration}
          onValueChange={setTransferReservationDuration}
        />
        <Button
          color={showSuccess ? "success" : "primary"}
          isDisabled={!isAllValid || showSuccess}
          isLoading={isLoading}
          onClick={handleSave}
        >
          {showSuccess
            ? "Configuration saved!"
            : isAllValid
              ? "Save configuration"
              : "Please fill in all fields correctly"}
        </Button>
      </div>
    </div>
  );
}

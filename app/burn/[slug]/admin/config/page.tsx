"use client";

import React, { useState } from "react";
import Heading from "@/app/_components/Heading";
import { Button, Input } from "@nextui-org/react";
import { useProject } from "@/app/_components/SessionContext";
import { BurnStage, BurnMembershipPricing } from "@/utils/types";
import toast from "react-hot-toast";

export default function ConfigPage() {
  const { project, updateBurnConfig } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(
    project!.burn_config.current_stage
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
  const [lastPossibleTransferAt, setLastPossibleTransferAt] = useState(
    project!.burn_config.last_possible_transfer_at ?? ""
  );
  const [maxMemberships, setMaxMemberships] = useState(
    (project!.burn_config.max_memberships ?? 0).toString()
  );
  const [membershipPriceCurrency, setMembershipPriceCurrency] = useState(
    project!.burn_config.membership_price_currency ?? ""
  );
  const [membershipPricingType, setMembershipPricingType] = useState(
    project!.burn_config.membership_pricing_type
  );
  const [membershipPriceTier1, setMembershipPriceTier1] = useState(
    (project!.burn_config.membership_price_tier_1 ?? 0).toString()
  );
  const [membershipPriceTier2, setMembershipPriceTier2] = useState(
    (project!.burn_config.membership_price_tier_2 ?? 0).toString()
  );
  const [membershipPriceTier3, setMembershipPriceTier3] = useState(
    (project!.burn_config.membership_price_tier_3 ?? 0).toString()
  );
  const [shareMembershipsLottery, setShareMembershipsLottery] = useState(
    (project!.burn_config.share_memberships_lottery ?? 0).toString()
  );
  const [shareMembershipsLowIncome, setShareMembershipsLowIncome] = useState(
    (project!.burn_config.share_memberships_low_income ?? 0).toString()
  );
  const [stripeSecretApiKey, setStripeSecretApiKey] = useState(
    project!.burn_config.stripe_secret_api_key ?? ""
  );
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState(
    project!.burn_config.stripe_webhook_secret ?? ""
  );

  const isISODate = (date: string | null) => date && !isNaN(Date.parse(date));
  const isNumber = (value: string) => !isNaN(parseInt(value));
  const isAllValid =
    ["lottery-open", "lottery-closed", "open-sale"].includes(currentStage) &&
    isISODate(openSaleStartingAt) &&
    isNumber(openSaleReservationDuration) &&
    isNumber(transferReservationDuration) &&
    isNumber(maxMemberships) &&
    /^[A-Z]{3}$/.test(membershipPriceCurrency) &&
    ["tiered-3"].includes(membershipPricingType) &&
    isNumber(membershipPriceTier1) &&
    isNumber(membershipPriceTier2) &&
    isNumber(membershipPriceTier3) &&
    isNumber(shareMembershipsLottery) &&
    parseInt(shareMembershipsLottery) >= 0 &&
    parseInt(shareMembershipsLottery) <= 100 &&
    isNumber(shareMembershipsLowIncome) &&
    parseInt(shareMembershipsLowIncome) >= 0 &&
    parseInt(shareMembershipsLowIncome) <= 100;

  const handleSave = async () => {
    setIsLoading(true);
    const newConfig = {
      current_stage: currentStage,
      open_sale_starting_at: new Date(openSaleStartingAt).toISOString(),
      open_sale_reservation_duration: parseInt(openSaleReservationDuration),
      transfer_reservation_duration: parseInt(transferReservationDuration),
      last_possible_transfer_at: new Date(lastPossibleTransferAt).toISOString(),
      max_memberships: parseInt(maxMemberships),
      membership_price_currency: membershipPriceCurrency,
      membership_pricing_type: membershipPricingType,
      membership_price_tier_1: parseFloat(membershipPriceTier1),
      membership_price_tier_2: parseFloat(membershipPriceTier2),
      membership_price_tier_3: parseFloat(membershipPriceTier3),
      share_memberships_lottery: parseInt(shareMembershipsLottery),
      share_memberships_low_income: parseInt(shareMembershipsLowIncome),
      stripe_secret_api_key: stripeSecretApiKey,
      stripe_webhook_secret: stripeWebhookSecret,
    };
    try {
      await updateBurnConfig(newConfig);
      toast.success("Configuration saved!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Heading>Configuration</Heading>
      <div className="flex flex-col gap-4">
        <Input
          label="current_stage"
          value={currentStage}
          onValueChange={(x) => setCurrentStage(x as BurnStage)}
        />
        <Input
          label="open_sale_starting_at"
          value={openSaleStartingAt}
          onValueChange={setOpenSaleStartingAt}
        />
        <Input
          label="open_sale_reservation_duration"
          value={openSaleReservationDuration}
          onValueChange={setOpenSaleReservationDuration}
        />
        <Input
          label="transfer_reservation_duration"
          value={transferReservationDuration}
          onValueChange={setTransferReservationDuration}
        />
        <Input
          label="last_possible_transfer_at"
          value={lastPossibleTransferAt}
          onValueChange={setLastPossibleTransferAt}
        />
        <Input
          label="max_memberships"
          value={maxMemberships}
          onValueChange={setMaxMemberships}
        />
        <Input
          label="membership_price_currency"
          value={membershipPriceCurrency}
          onValueChange={setMembershipPriceCurrency}
        />
        <Input
          label="membership_pricing_type"
          value={membershipPricingType}
          onValueChange={(x) =>
            setMembershipPricingType(x as BurnMembershipPricing)
          }
        />
        <Input
          label="membership_price_tier_1"
          value={membershipPriceTier1}
          onValueChange={setMembershipPriceTier1}
        />
        <Input
          label="membership_price_tier_2"
          value={membershipPriceTier2}
          onValueChange={setMembershipPriceTier2}
        />
        <Input
          label="membership_price_tier_3"
          value={membershipPriceTier3}
          onValueChange={setMembershipPriceTier3}
        />
        <Input
          label="share_memberships_lottery"
          value={shareMembershipsLottery}
          onValueChange={setShareMembershipsLottery}
        />
        <Input
          label="share_memberships_low_income"
          value={shareMembershipsLowIncome}
          onValueChange={setShareMembershipsLowIncome}
        />
        <Input
          label="stripe_secret_api_key"
          value={stripeSecretApiKey}
          onValueChange={setStripeSecretApiKey}
        />
        <Input
          label="stripe_webhook_secret"
          value={stripeWebhookSecret}
          onValueChange={setStripeWebhookSecret}
        />
        <Button
          color={"primary"}
          isDisabled={!isAllValid}
          isLoading={isLoading}
          onPress={handleSave}
        >
          {isAllValid
            ? "Save configuration"
            : "Please fill in all fields correctly"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { useProject } from "@/app/_components/SessionContext";
import MemberDetailsWithHeading from "./MemberDetailsWithHeading";
import { BurnMembershipPricing } from "@/utils/types";
import { formatMoney } from "@/app/_components/utils";
import { apiPost, apiGet } from "@/app/_components/api";
import { useSearchParams, useRouter } from "next/navigation";
import InvitePlusOne from "./InvitePlusOne";

export default function MembershipAvailable() {
  const { project, reloadProfile } = useProject();
  const [isLoading, setIsLoading] = useState<boolean | number>(false);
  const [isPolling, setIsPolling] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setIsPolling(true);
      const checkMembership = async () => {
        try {
          const response = await apiGet(
            `/burn/${project?.slug}/has-membership`
          );
          if (response.hasMembership) {
            await reloadProfile();
            setIsPolling(false);
            const url = new URL(window.location.href);
            url.searchParams.delete("success");
            router.replace(url.pathname + url.search);
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error checking membership:", error);
          setIsPolling(false);
          return false;
        }
      };

      const pollInterval = setInterval(async () => {
        const hasMembership = await checkMembership();
        if (hasMembership) {
          clearInterval(pollInterval);
        }
      }, 2000);

      return () => {
        clearInterval(pollInterval);
        setIsPolling(false);
      };
    }
  }, [searchParams, project?.slug, reloadProfile, router]);

  const purchaseMembership = async (tier: number) => {
    setIsLoading(tier);
    try {
      const { url } = await apiPost(
        `/burn/${project?.slug}/purchase-membership`,
        { tier, originUrl: window.location.href }
      );
      window.location.href = url;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {isPolling ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Confirming your membership purchase...</span>
          </div>
        ) : (
          <>
            <p>There is a membership available for you to purchase!</p>
            <p>
              Your membership is reserved for you until{" "}
              <b>
                {new Date(
                  project?.membership_purchase_right?.expires_at!
                ).toLocaleString()}
              </b>
              . If you don't complete the purchase of your membership by then,
              it will be released to the public in the open sale.
            </p>
          </>
        )}

        {!isPolling &&
        project?.burn_config.membership_pricing_type ===
          BurnMembershipPricing.Tiered3 ? (
          <div className="flex flex-col gap-2">
            {project.membership_purchase_right?.is_low_income ? (
              <Button
                onPress={() => purchaseMembership(1)}
                isLoading={isLoading === 1}
              >
                Purchase low-income membership (
                {formatMoney(
                  project?.burn_config.membership_price_tier_1,
                  project?.burn_config.membership_price_currency
                )}
                )
              </Button>
            ) : null}
            <Button
              onPress={() => purchaseMembership(2)}
              isLoading={isLoading === 2}
            >
              Purchase regular-income membership (
              {formatMoney(
                project?.burn_config.membership_price_tier_2,
                project?.burn_config.membership_price_currency
              )}
              )
            </Button>
            <Button
              onPress={() => purchaseMembership(3)}
              isLoading={isLoading === 3}
            >
              Purchase high-income membership (
              {formatMoney(
                project?.burn_config.membership_price_tier_3,
                project?.burn_config.membership_price_currency
              )}
              )
            </Button>
          </div>
        ) : null}
      </div>
      <InvitePlusOne />
      <MemberDetailsWithHeading data={project?.membership_purchase_right!} />
    </>
  );
}

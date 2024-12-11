"use client";

import React, { useState } from "react";
import Heading from "@/app/_components/Heading";
import { Button, Input } from "@nextui-org/react";
import { calculateAge } from "@/app/_components/utils";
import { apiPost, apiDelete } from "@/app/_components/api";
import { useProject } from "@/app/_components/SessionContext";
import { LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { BurnStage } from "@/utils/types";

export default function MembershipPage() {
  const { project, updateProjectSimple } = useProject();
  const [firstName, setFirstName] = useState(
    project?.lottery_ticket?.first_name || ""
  );
  const [lastName, setLastName] = useState(
    project?.lottery_ticket?.last_name || ""
  );
  const [birthdate, setBirthdate] = useState(
    project?.lottery_ticket?.birthdate || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAgeWellFormatted = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(birthdate);
  const isAgeValid = isAgeWellFormatted && calculateAge(birthdate) >= 18;

  return (
    <div>
      <Heading>Membership lottery</Heading>
      {project?.lottery_ticket ||
      project?.burn_config.current_stage !== BurnStage.LotteryOpen ? null : (
        <p className="mb-4">
          To enter the membership lottery, input your name and birthdate,{" "}
          <b>exactly like on your official documents</b>.
        </p>
      )}
      <div className="flex flex-col gap-4">
        {project?.burn_config.current_stage === BurnStage.LotteryOpen ||
        project?.lottery_ticket ? (
          <>
            <Input
              label="First name"
              value={firstName}
              onValueChange={setFirstName}
              isDisabled={!!project?.lottery_ticket}
              startContent={project?.lottery_ticket ? <LockOutlined /> : null}
            />
            <Input
              label="Last name"
              value={lastName}
              onValueChange={setLastName}
              isDisabled={!!project?.lottery_ticket}
              startContent={project?.lottery_ticket ? <LockOutlined /> : null}
            />
            <Input
              label="Birthdate (YYYY-MM-DD)"
              value={birthdate}
              onValueChange={setBirthdate}
              isDisabled={!!project?.lottery_ticket}
              startContent={project?.lottery_ticket ? <LockOutlined /> : null}
            />
          </>
        ) : null}
        {project?.burn_config.current_stage !== BurnStage.LotteryOpen ? (
          <Button color="primary" isDisabled>
            {project?.lottery_ticket
              ? "Lottery is closed"
              : "You did not enter the lottery this year"}
          </Button>
        ) : project?.lottery_ticket ? (
          <Button
            color="success"
            isLoading={isLoading}
            onClick={async () => {
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
        ) : (
          <Button
            color="primary"
            isDisabled={!firstName || !lastName || !isAgeValid}
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                const ticket = await apiPost(`/burn/${project?.slug}/lottery`, {
                  first_name: firstName,
                  last_name: lastName,
                  birthdate: birthdate,
                });
                updateProjectSimple({
                  lottery_ticket: ticket,
                });
              } catch (e: any) {
                toast.error(e.message);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {isAgeWellFormatted && !isAgeValid
              ? "You must be at least 18 years old"
              : "Enter the membership lottery!"}
          </Button>
        )}
      </div>
    </div>
  );
}

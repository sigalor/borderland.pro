"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox } from "@nextui-org/react";
import { calculateAge } from "@/app/_components/utils";
import { apiPost } from "@/app/_components/api";
import { useProject } from "@/app/_components/SessionContext";
import toast from "react-hot-toast";
import { usePrompt } from "@/app/_components/PromptContext";

export default function LotteryOpenNotEntered() {
  const prompt = usePrompt();
  const { project, updateProjectSimple } = useProject();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isLowIncome, setIsLowIncome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAgeWellFormatted = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(birthdate);
  const isAgeValid = isAgeWellFormatted && calculateAge(birthdate) >= 18;

  return (
    <>
      <p className="mb-4">
        To enter the membership lottery, input your name and birthdate,{" "}
        <b>exactly like on your official documents</b>.
      </p>
      <div className="flex flex-col gap-4">
        <Input
          label="First name"
          value={firstName}
          onValueChange={setFirstName}
        />
        <Input label="Last name" value={lastName} onValueChange={setLastName} />
        <Input
          label="Birthdate (YYYY-MM-DD)"
          value={birthdate}
          onValueChange={setBirthdate}
        />
        <Checkbox
          isSelected={isLowIncome}
          onValueChange={async (newIsLowIncome) => {
            if (newIsLowIncome) {
              const resp = await prompt(
                "Please answer a few questions to determine your eligibility for low income membership."
              );
              if (resp) {
                setIsLowIncome(true);
              }
            } else {
              setIsLowIncome(false);
            }
          }}
        >
          Low income?
        </Checkbox>
        <Button
          color="primary"
          isDisabled={!firstName || !lastName || !isAgeValid}
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            try {
              const ticket = await apiPost(`/burn/${project?.slug}/lottery`, {
                first_name: firstName,
                last_name: lastName,
                birthdate: birthdate,
                is_low_income: isLowIncome,
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
      </div>
    </>
  );
}

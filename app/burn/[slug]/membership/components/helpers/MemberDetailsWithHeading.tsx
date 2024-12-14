"use client";

import React from "react";
import Heading from "@/app/_components/Heading";
import MemberDetails, { MemberDetailsData } from "./MemberDetails";

export default function MemberDetailsWithHeading({
  data,
}: {
  data: MemberDetailsData;
}) {
  return (
    <>
      <Heading className="mt-12">Your details</Heading>
      <div className="flex flex-col gap-4">
        <MemberDetails data={data} />
      </div>
    </>
  );
}

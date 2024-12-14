"use client";

import React, { useState } from "react";
import { Link } from "@nextui-org/link";
import Heading from "@/app/_components/Heading";

export default function InvitePlusOne() {
  const [email, setEmail] = useState("");

  return (
    <>
      <Heading className="mt-12">Support</Heading>
      <p>
        In case of any questions or issues, please contact{" "}
        <Link href="mailto:memberships@theborderland.se">
          memberships@theborderland.se
        </Link>
        .
      </p>
    </>
  );
}

"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import Auth from "./auth/Auth";
import { useSession } from "./SessionContext";
import Image from "next/image";

export default function Home() {
  const { session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/borderland.png"
        alt="borderland.pro"
        width={100}
        height={100}
      />
      <h1 className="text-4xl font-bold mt-4">borderland.pro</h1>
      <h2 className="text-2xl mt-2 mb-4">Membership platform</h2>
      <Button color="primary" onClick={() => setIsOpen(true)}>
        Click to login
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        classNames={{
          base: "m-0",
          wrapper: "items-center",
        }}
      >
        <ModalContent className="m-4">
          <ModalBody>
            <Auth />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

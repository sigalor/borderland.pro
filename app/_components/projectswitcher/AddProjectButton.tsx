import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Link,
} from "@nextui-org/react";
import { PlusOutlined } from "@ant-design/icons";
import { useDisclosure } from "@nextui-org/react";

export default function AddProjectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        radius="full"
        variant="light"
        className="bg-success/10 hover:bg-success/20 text-success"
        onPress={onOpen}
      >
        <PlusOutlined style={{ fontSize: "20px" }} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent className="p-8">
          <ModalHeader>
            Do you want to host a burn-like event through this platform, either
            on this server or self-hosted?
          </ModalHeader>
          <ModalBody>
            <p>
              Please{" "}
              <Link
                href="https://github.com/hermesloom/theglobalburn/issues"
                isExternal
              >
                open an issue on GitHub
              </Link>{" "}
              or write an email to{" "}
              <Link href="mailto:synergies@hermesloom.org">
                synergies@hermesloom.org
              </Link>{" "}
              to get in touch.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

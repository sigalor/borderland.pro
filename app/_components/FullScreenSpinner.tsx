import React from "react";
import { Spinner } from "@nextui-org/react";

export default function FullScreenSpinner() {
  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center">
      <Spinner size="lg" />
    </div>
  );
}

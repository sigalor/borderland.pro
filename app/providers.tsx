"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "./_components/SessionContext";
import { PromptProvider } from "./_components/PromptContext";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <SessionProvider>
        <PromptProvider>{children}</PromptProvider>
      </SessionProvider>
    </NextUIProvider>
  );

  // ThemeProvider seems to be buggy, because it always uses dark mode
  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider>{children}</ThemeProvider>
    </NextUIProvider>
  );
}

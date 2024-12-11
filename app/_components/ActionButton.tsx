"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { PromptResult } from "@/app/_components/Prompt";

export type ActionButtonOnClickHandler<T> = (
  data?: T,
  promptResult?: PromptResult
) => Promise<boolean | void>;

export type ActionButtonDef<T = undefined> = {
  key: string;
  label: string;
  condition?: (data?: T) => boolean;
  onClick:
    | ActionButtonOnClickHandler<T>
    | {
        prompt: (data?: T) => Promise<PromptResult | undefined>;
        handler: ActionButtonOnClickHandler<T>;
      };
};

export default function ActionButton<T>({
  action,
  data,
  successCallback,
}: {
  action: ActionButtonDef<T>;
  data?: T;
  successCallback?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const condition = action.condition ? action.condition(data) : true;
  if (!condition) {
    return null;
  }

  return (
    <Button
      key={action.label}
      isLoading={loading}
      onPress={async () => {
        try {
          const handler =
            typeof action.onClick === "function"
              ? action.onClick
              : action.onClick.handler;
          const promptHandler =
            typeof action.onClick !== "function"
              ? action.onClick.prompt
              : undefined;
          const promptResult = promptHandler
            ? await promptHandler(data)
            : undefined;

          if (!promptHandler || promptResult) {
            setLoading(true);
            const handlerResult = await handler(data, promptResult);
            if (handlerResult && successCallback) {
              successCallback();
            }
          }
        } finally {
          setLoading(false);
        }
      }}
    >
      {action.label}
    </Button>
  );
}

"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ActionButton from "@/app/_components/ActionButton";
import { apiPost } from "@/app/_components/api";
import { useSession } from "@/app/_components/SessionContext";

export default function Home() {
  const { profile, reloadProfile } = useSession();
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-8xl mb-4">❤️‍🔥</div>
      {profile?.projects.find((p) => p.slug === "the-borderland-2025") ? (
        <Button
          color="primary"
          onPress={() => router.push("/burn/the-borderland-2025/membership")}
        >
          Go to my membership
        </Button>
      ) : (
        <ActionButton
          action={{
            key: "join-bl",
            label: "Join The Borderland 2025",
            onClick: async () => {
              await apiPost("/burn/the-borderland-2025/join");
              await reloadProfile();
            },
          }}
        />
      )}
    </div>
  );
}

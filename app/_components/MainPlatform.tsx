"use client";

import React from "react";
import ProjectSwitcher from "./projectswitcher/ProjectSwitcher";
import FullScreenSpinner from "./FullScreenSpinner";
import NotLoggedInView from "./NotLoggedInView";
import { useSession } from "./SessionContext";

export default function MainPlatform({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <FullScreenSpinner />;
  } else if (!session) {
    return <NotLoggedInView />;
  }

  return (
    <div className="flex h-full">
      <ProjectSwitcher />
      <div className="flex-1">{children}</div>
    </div>
  );
}

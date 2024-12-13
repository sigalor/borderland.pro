"use client";

import React from "react";
import { Sidebar } from "@/app/_components/Sidebar";
import {
  HomeOutlined,
  IdcardOutlined,
  RocketOutlined,
  SettingOutlined,
  QrcodeOutlined,
  TeamOutlined,
  WalletOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useProject } from "@/app/_components/SessionContext";
import { redirect } from "next/navigation";
import { BurnRole } from "@/utils/types";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { project } = useProject();

  if (project?.type !== "burn") {
    redirect("/");
  }

  return (
    <div className="flex h-full">
      <Sidebar
        routes={[
          {
            label: "Overview",
            path: `/burn/${project?.slug}`,
            icon: <HomeOutlined />,
          },
          {
            label: "Timeline",
            path: `/burn/${project?.slug}/timeline`,
            icon: <RocketOutlined />,
          },
          {
            label:
              project.membership || project.membership_purchase_right
                ? "Your membership"
                : "Membership lottery",
            path: `/burn/${project?.slug}/membership`,
            icon: <IdcardOutlined />,
          },
          { separator: true },

          {
            label: "Membership scanner",
            path: `/burn/${project?.slug}/scanner`,
            icon: <QrcodeOutlined />,
          },
          ...(project.roles.includes(BurnRole.Admin)
            ? ([
                { separator: true },
                {
                  label: "Lottery tickets",
                  path: `/burn/${project?.slug}/admin/lottery-tickets`,
                  icon: <WalletOutlined />,
                },
                {
                  label: "Membership purchase rights",
                  path: `/burn/${project?.slug}/admin/membership-purchase-rights`,
                  icon: <FileDoneOutlined />,
                },
                {
                  label: "Memberships",
                  path: `/burn/${project?.slug}/admin/memberships`,
                  icon: <TeamOutlined />,
                },
                {
                  label: "Configuration",
                  path: `/burn/${project?.slug}/admin/config`,
                  icon: <SettingOutlined />,
                },
              ] as any)
            : []),
          ,
        ]}
      />
      <div className="flex-1 p-16 pl-96 h-full">{children}</div>
    </div>
  );
}

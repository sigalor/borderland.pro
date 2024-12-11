"use client";

import { Sidebar } from "@/app/_components/Sidebar";
import {
  UserOutlined,
  FireOutlined,
  ContactsOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Sidebar
        routes={[
          {
            label: "Users",
            path: "/admin/users",
            icon: <UserOutlined />,
          },
          {
            label: "Projects",
            path: "/admin/projects",
            icon: <FireOutlined />,
          },
          {
            label: "Roles",
            path: "/admin/roles",
            icon: <ContactsOutlined />,
          },
          {
            label: "Role assignments",
            path: "/admin/role-assignments",
            icon: <UserSwitchOutlined />,
          },
        ]}
      />
      <div className="flex-1 p-16 pl-96">{children}</div>
    </div>
  );
}

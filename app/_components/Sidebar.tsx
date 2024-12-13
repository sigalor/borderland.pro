"use client";

import { Button } from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarRoute {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  routes: (SidebarRoute | { separator: true })[];
}

export function Sidebar({ routes }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="fixed h-full left-[72px] w-64 border-r border-divider p-4 z-2 rounded-r-xl"
      style={{
        backgroundColor: "#FCFCFC",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex flex-col gap-2">
        {routes.map((route: any, i) =>
          route.separator ? (
            <div
              key={i}
              className="h-[1px] w-full my-2"
              style={{ backgroundColor: "#E0E0E0" }}
            />
          ) : (
            <Button
              key={route.path}
              variant="light"
              className={`justify-start ${
                pathname === route.path ? "bg-content3 font-bold" : ""
              }`}
              onPress={() => router.push(route.path)}
              startContent={route.icon}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {route.label}
              </span>
            </Button>
          )
        )}
      </div>
    </div>
  );
}

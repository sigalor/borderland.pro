"use client";

import React from "react";
import DataTable from "@/app/_components/admin/DataTable";
import { useSession } from "@/app/_components/SessionContext";
import { usePrompt } from "@/app/_components/PromptContext";
import { apiPost } from "@/app/_components/api";

export default function ProjectsPage() {
  const prompt = usePrompt();
  const { reloadProfile } = useSession();

  return (
    <DataTable
      endpoint="/admin/projects"
      columns={[
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "slug", label: "Slug" },
      ]}
      title="Projects"
      globalActions={[
        {
          key: "add-project",
          label: "Add project",
          onClick: {
            prompt: () =>
              prompt("Enter details about the new project.", [
                {
                  key: "name",
                  label: "Name",
                  propagateChanges: (name) => ({
                    slug: name
                      .toLowerCase()
                      .replace(/ß/g, "ss")
                      .normalize("NFD")
                      .replace(/ +/g, "-")
                      .replace(/[^a-z0-9-]+/g, ""),
                  }),
                },
                {
                  key: "type",
                  label: "Type",
                },
                {
                  key: "slug",
                  label: "Slug (only a-z, 0-9 and hyphens)",
                  validate: (x: string) => /^[a-z0-9-]+$/.test(x),
                },
              ]),
            handler: async (_, promptResult) => {
              await apiPost("/admin/projects", promptResult);
              await reloadProfile();
              return true;
            },
          },
        },
      ]}
    />
  );
}

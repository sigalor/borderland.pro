"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { apiGet } from "@/app/_components/api";
import BasicTable from "@/app/_components/BasicTable";
import Heading from "@/app/_components/Heading";
import ActionButton, { ActionButtonDef } from "../ActionButton";

export type DataItem = {
  id: string;
  [key: string]: any;
};

export type FullData = {
  data: DataItem[];
  [key: string]: any;
};

interface DataTableProps {
  endpoint: string;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, item: any, additionalData: any) => React.ReactNode;
  }>;
  title: string;
  globalActions?: ActionButtonDef<FullData>[];
}

export default function DataTable({
  endpoint,
  columns,
  title,
  globalActions,
}: DataTableProps) {
  const initialLoadDone = useRef(false);
  const [fullData, setFullData] = useState<FullData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiGet(endpoint);
      setFullData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadData();
    }
  }, [endpoint]);

  return (
    <div>
      <Heading>{title}</Heading>
      <div className="flex gap-2 mb-3">
        <Button
          color="primary"
          aria-label={`Reload ${endpoint}`}
          onPress={loadData}
          isLoading={loading}
        >
          {!loading && "Reload"}
        </Button>
        {globalActions && !loading ? (
          <>
            {globalActions.map((action) => (
              <ActionButton
                key={action.key}
                action={action}
                data={fullData!}
                successCallback={loadData}
              />
            ))}
          </>
        ) : null}
      </div>
      {fullData && !loading ? (
        <BasicTable
          data={fullData.data}
          additionalData={fullData}
          columns={columns}
          rowsPerPage={10}
          ariaLabel={`${title} table`}
        />
      ) : null}
    </div>
  );
}

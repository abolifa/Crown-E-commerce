"use client";

import { DataTable } from "@/components/data-table";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "@/components/Loader";

const page = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const sizes = await axios.get("/api/sizes");
      return sizes.data;
    },
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <Heading
        title="Sizes"
        description="Manage all sizes inside your store"
        action="sizes"
        count={0}
      />
      <Separator />
      {isPending ? <Loader /> : <DataTable data={data} columns={columns} />}
    </div>
  );
};

export default page;

"use client";

import { Button } from "@/components/ui/button";
import { Brand } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { queryClient } from "../layout";

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => (
      <>
        {row.original.image_url ? (
          <img
            src={row.original.image_url}
            alt={row.original.label}
            width={50}
            height={50}
            className="rounded-full"
          />
        ) : null}
      </>
    ),
  },
  {
    accessorKey: "public_id",
    header: "Public ID",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationFn: async () => {
          await axios.delete(`/api/brands/${row.original.id}`);
        },
        mutationKey: ["brands"],
        onSuccess: () => {
          toast.success("Record deleted successfully.");
          router.push(`/brands`);
        },
        onMutate: () => {
          return <Loader />;
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to delete record.");
        },
        onSettled: () => {
          queryClient.invalidateQueries();
        },
      });

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            size={"sm"}
            onClick={() => router.push(`/brands/${row.original.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} size={"sm"}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => mutation.mutate()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

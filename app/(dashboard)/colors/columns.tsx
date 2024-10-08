"use client";

import { Button } from "@/components/ui/button";
import { Color } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
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

export const columns: ColumnDef<Color>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "hex",
    header: "Hex",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: row.original.hex }}
        />
        {row.original.hex}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationFn: async () => {
          await axios.delete(`/api/colors/${row.original.id}`);
        },
        mutationKey: ["colors"],
        onSuccess: () => {
          toast.success("Record deleted successfully.");
          router.push(`/colors`);
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
            onClick={() => router.push(`/colors/${row.original.id}`)}
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

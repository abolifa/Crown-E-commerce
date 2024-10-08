"use client";

import { Button } from "@/components/ui/button";
import { Category, SubCategory } from "@prisma/client";
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
import { Badge } from "@/components/ui/badge";

type SubWithCategory = SubCategory & {
  category: Category;
};

export const columns: ColumnDef<SubWithCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => (
      <Badge>
        {row.original.category ? row.original.category.label : "Uncategorized"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationFn: async () => {
          await axios.delete(`/api/subcategories/${row.original.id}`);
        },
        mutationKey: ["subcategories"],
        onSuccess: () => {
          toast.success("Record deleted successfully.");
          router.push(`/subcategories`);
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
            onClick={() => router.push(`/subcategories/${row.original.id}`)}
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

import React from "react";
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
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/(dashboard)/layout";
import Loader from "./Loader";

interface FormHeadingProps {
  title: string;
  description: string;
  action: string;
  id?: string | null;
}

const FormHeading: React.FC<FormHeadingProps> = ({
  title,
  description,
  action,
  id,
}) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${action}/${id}`);
    },
    mutationKey: ["brands"],
    onSuccess: () => {
      toast.success("Record deleted successfully.");
      router.push(`/${action}`);
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
    <div className="w-full flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {id && (
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
      )}
    </div>
  );
};

export default FormHeading;

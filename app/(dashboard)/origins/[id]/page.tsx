"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormHeading from "@/components/FormHeading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Origin } from "@prisma/client";
import toast from "react-hot-toast";

const formSchema = z.object({
  label: z.string().min(2).max(50),
});

const Page = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<Origin | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const title = record ? "Edit Origin" : "Create Origin";
  const description = record
    ? "Edit existing Origin on the store"
    : "Add new Origin to the store";
  const buttonAction = record ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
    },
  });

  useEffect(() => {
    // Fetch the Origin record if editing
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/origins/${id}`);
          if (response.status === 200) {
            setRecord(response.data);
            form.reset(response.data);
          }
        } catch (error) {
          console.error("Error fetching Origin:", error);
          toast.error("Failed to fetch Origin data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id, form]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!record) {
        await axios.post("/api/origins", values);
        toast.success("Origin created successfully");
        router.push("/origins");
      } else {
        await axios.put(`/api/origins/${id}`, values);
        toast.success("Origin updated successfully");
        router.push("/origins");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title={title}
        description={description}
        action={"origins"}
        id={record ? (record.id as string) : null}
      />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 max-w-2xl">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {buttonAction}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;

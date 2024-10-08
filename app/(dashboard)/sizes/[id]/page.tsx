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
import { Size } from "@prisma/client";
import toast from "react-hot-toast";

const formSchema = z.object({
  label: z.string().min(2).max(50),
  value: z.string().min(1).max(50),
});

const Page = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<Size | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const title = record ? "Edit Size" : "Create Size";
  const description = record
    ? "Edit existing Size on the store"
    : "Add new Size to the store";
  const buttonAction = record ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      value: "",
    },
  });

  useEffect(() => {
    // Fetch the Size record if editing
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/sizes/${id}`);
          if (response.status === 200) {
            setRecord(response.data);
            form.reset(response.data);
          }
        } catch (error) {
          console.error("Error fetching Size:", error);
          toast.error("Failed to fetch Size data");
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
        await axios.post("/api/sizes", values);
        toast.success("Size created successfully");
        router.push("/sizes");
      } else {
        await axios.put(`/api/sizes/${id}`, values);
        toast.success("Size updated successfully");
        router.push("/sizes");
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
        action={"sizes"}
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
                  <FormLabel>Size Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Value</FormLabel>
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

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
import { Brand } from "@prisma/client";
import ImageUpload from "@/components/ImageUpload";
import toast from "react-hot-toast";

const formSchema = z.object({
  label: z.string().min(2).max(50),
  image_url: z.string().url().min(2),
  public_id: z.string().min(1),
});

const Page = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const title = record ? "Edit Brand" : "Create Brand";
  const description = record
    ? "Edit existing brand on the store"
    : "Add new brand to the store";
  const buttonAction = record ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      image_url: "",
      public_id: "",
    },
  });

  useEffect(() => {
    // Fetch the brand record if editing
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/brands/${id}`);
          if (response.status === 200) {
            setRecord(response.data);
            form.reset(response.data);
          }
        } catch (error) {
          console.error("Error fetching brand:", error);
          toast.error("Failed to fetch brand data");
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
        await axios.post("/api/brands", values);
        toast.success("Brand created successfully");
        router.push("/brands");
      } else {
        await axios.put(`/api/brands/${id}`, values);
        toast.success("Brand updated successfully");
        router.push("/brands");
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
        action={"brands"}
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
                  <FormLabel>Brand Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={
                        field.value
                          ? [
                              {
                                image_url: field.value,
                                public_id: form.getValues("public_id"),
                              },
                            ]
                          : []
                      }
                      disabled={loading}
                      onChange={({ image_url, public_id }) => {
                        field.onChange(image_url);
                        form.setValue("public_id", public_id);
                      }}
                      onRemove={() => {
                        field.onChange("");
                        form.setValue("public_id", "");
                      }}
                    />
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

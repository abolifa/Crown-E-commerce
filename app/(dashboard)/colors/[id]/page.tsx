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
import { Color } from "@prisma/client";
import toast from "react-hot-toast";
import { HexColorPicker } from "react-colorful";

const formSchema = z.object({
  label: z.string().min(2).max(50),
  hex: z.string().min(7).max(7),
});

const Page = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<Color | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const title = record ? "Edit Color" : "Create Color";
  const description = record
    ? "Edit existing Color on the store"
    : "Add new Color to the store";
  const buttonAction = record ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      hex: "#000000",
    },
  });

  useEffect(() => {
    // Fetch the Color record if editing
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/colors/${id}`);
          if (response.status === 200) {
            setRecord(response.data);
            form.reset(response.data);
          }
        } catch (error) {
          console.error("Error fetching Color:", error);
          toast.error("Failed to fetch Color data");
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
        await axios.post("/api/colors", values);
        toast.success("Color created successfully");
        router.push("/colors");
      } else {
        await axios.put(`/api/colors/${id}`, values);
        toast.success("Color updated successfully");
        router.push("/colors");
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
        action={"colors"}
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
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hex Code</FormLabel>
                  <FormControl>
                    <HexColorPicker
                      color={field.value}
                      onChange={field.onChange}
                      hidden={loading}
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

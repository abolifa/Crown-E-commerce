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
import { Category, SubCategory } from "@prisma/client";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  label: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
  categoryId: z.string().min(2).max(50),
});

const Page = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<SubCategory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const title = record ? "Edit SubCategory" : "Create SubCategory";
  const description = record
    ? "Edit existing SubCategory on the store"
    : "Add new SubCategory to the store";
  const buttonAction = record ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      slug: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    // Fetch the SubCategory record if editing
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/subcategories/${id}`);
          const categories = await axios.get("/api/categories");
          if (response.status === 200) {
            setRecord(response.data);
            setCategories(categories.data);
            form.reset(response.data);
          }
        } catch (error) {
          console.error("Error fetching SubCategory:", error);
          toast.error("Failed to fetch SubCategory data");
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
        await axios.post("/api/subcategories", values);
        toast.success("SubCategory created successfully");
        router.push("/subcategories");
      } else {
        await axios.put(`/api/subcategories/${id}`, values);
        toast.success("SubCategory updated successfully");
        router.push("/subcategories");
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
        action={"subcategories"}
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

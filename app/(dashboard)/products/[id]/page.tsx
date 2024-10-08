"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useEffect, useState } from "react";
import { Media, Product } from "@prisma/client";
import FormHeading from "@/components/FormHeading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import Multi from "@/components/Multi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  media: z
    .array(
      z.object({
        imageUrl: z.string(),
        publicId: z.string(),
      })
    )
    .optional(),
});

const page = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      media: [],
    },
  });

  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      axios.get(`/api/products/${id}`).then((response) => {
        setRecord(response.data);
        form.setValue("name", response.data.name);
        setMedia(response.data?.media);
        setLoading(false);
      });
    } else return;
  }, [form, id]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const combinedValues = { ...values, media };
      if (record) {
        axios.put(`/api/products/${record.id}`, combinedValues);
        toast.success("Product updated successfully");
        router.push("/products");
      } else {
        axios.post("/api/products", combinedValues);
        toast.success("Product created successfully");
        router.push("/products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  // Handle adding new images
  const handleMediaChange = (newImages: Media[]) => {
    // Combine new images with the existing media state
    setMedia((prevMedia) => [...prevMedia, ...newImages]);
  };

  const handleRemove = async (publicId: string) => {
    try {
      await axios.delete(`/api/destroy/${publicId}`);
      await axios.delete(`/api/media/${publicId}`);
      toast.success("Image removed successfully");

      // Update the media state
      setMedia((prev) => {
        const updatedMedia = prev.filter((img) => img.publicId !== publicId);
        console.log(updatedMedia); // Log the updated media state
        return updatedMedia; // Return the updated state
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove image");
    }
  };

  const onError = (errors: any) => {
    console.error("Form Errors:", errors);
  };

  return (
    <div className="space-y-4">
      <FormHeading
        title="Product Form"
        description="Manage products"
        action="products"
        id={record ? record.id : null}
      />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <Card>
            <CardContent>
              <CardHeader>
                <CardTitle>Basic informations</CardTitle>
                <CardDescription>
                  basic information of your product
                </CardDescription>
              </CardHeader>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="media"
            render={() => (
              <FormItem>
                <FormLabel>Media</FormLabel>
                <FormControl>
                  <Multi
                    value={media}
                    onChange={handleMediaChange}
                    onRemove={handleRemove}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default page;

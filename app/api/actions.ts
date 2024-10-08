import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function handleDeleImage(public_id: string) {
  await cloudinary.api
    .delete_resources(public_id as any, {
      type: "upload",
      resource_type: "image",
    })
    .then((result) => {
      console.log("Image deleted successfully", result);
    })
    .catch((error) => {
      console.error("Error deleting image", error);
    });
}

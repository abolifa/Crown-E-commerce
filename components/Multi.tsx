"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ImagePlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Media } from "@prisma/client";

interface MultiProps {
  disabled?: boolean;
  onChange: (value: Media[]) => void; // Callback to update the images
  onRemove: (public_id: string) => void; // Callback to remove an image by public ID
  value: Media[]; // Current array of images
}

const Multi: React.FC<MultiProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle successful uploads
  const onUpload = (result: any) => {
    // Check if the info object is defined
    if (result.info) {
      const uploadedImage: any = {
        imageUrl: result.info.secure_url,
        publicId: result.info.public_id,
      };

      console.log(uploadedImage);

      // Update the state with the newly added image
      onChange([...value, uploadedImage]);
    }
  };

  // Ensure component doesn't render before mount
  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((image) => (
          <div
            key={image.publicId} // Use public_id as the key
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(image.publicId)} // Call onRemove with the public ID
                variant="destructive"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Image
              height={200}
              width={200}
              className="object-cover"
              alt="Uploaded image"
              src={image.imageUrl} // Display the uploaded image
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="rrxr1pi0">
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled} // Disable button if prop is set
            variant="outline"
            onClick={() => open()} // Open Cloudinary upload widget
          >
            <ImagePlusIcon className="w-4 h-4 mr-2" />
            Add images
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default Multi;

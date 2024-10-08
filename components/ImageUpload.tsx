"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ImagePlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface Image {
  image_url: string;
  public_id: string;
}

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: Image) => void;
  onRemove: (value: string) => void;
  value: Image[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    const uploadedImage = {
      image_url: result.info.secure_url,
      public_id: result.info.public_id,
    };

    onChange(uploadedImage);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((image) => (
          <div
            key={image.image_url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(image.image_url)}
                variant={"destructive"}
                size={"icon"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Image
              height={200}
              width={200}
              className="object-cover"
              alt="image"
              src={image.image_url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="rrxr1pi0">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant={"outline"}
              onClick={onClick}
            >
              <ImagePlusIcon className="w-4 h-4 mr-2" />
              Add image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

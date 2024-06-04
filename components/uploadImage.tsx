"use client";

import { type Editor } from "@tiptap/react";
import { UploadButton } from "@/lib/uploadthing";
import { FaImage } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { ourFileRouter } from "@/app/api/uploadthing/core";

type UploadImageProps = {
  onChange: (url?: string, name?: string) => void;
  onRemove: (url?: string) => void;
  initialData?: {
    imageUrl: string | undefined;
  };
};

export const UploadImage = ({
  onChange,
  onRemove,
  initialData,
}: UploadImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialData?.imageUrl
  );

  return (
    <UploadButton
      className="ut-button:w-56 ut-allowed-content:hidden pb-2"
      endpoint="imageUploader"
      content={{
        button({ ready }) {
          if (ready) {
            return (
              <div className="flex items-center gap-x-1">
                <FaImage className="text-lg" />
                <p className="text-sm">Insira uma imagem</p>
              </div>
            );
          }
        },
      }}
      onClientUploadComplete={(res) => {
        const url = res?.[0].url;
        setImageUrl(url);
        onChange(url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};

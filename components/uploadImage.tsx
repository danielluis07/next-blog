"use client";

import { type Editor } from "@tiptap/react";
import { UploadButton } from "@/lib/uploadthing";
import { FaImage } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useSummary } from "@/hooks/use-summary";
import { cn } from "@/lib/utils";

type UploadImageProps = {
  onChange: (url?: string, name?: string) => void;
  onRemove: (url?: string) => void;
  image: string | null | undefined;
};

export const UploadImage = ({
  onChange,
  onRemove,
  image,
}: UploadImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(image);
  const { onOpen } = useSummary();

  return (
    <div>
      <UploadButton
        className={cn(
          image !== "" && "pointer-events-none opacity-30",
          "ut-button:w-56 ut-allowed-content:hidden pb-2"
        )}
        endpoint="imageUploader"
        content={{
          button({ ready }) {
            if (ready) {
              return (
                <div className="flex items-center gap-x-1">
                  <FaImage className="text-lg" />
                  <p className="text-sm">
                    {image !== "" ? "Imagem selecionada" : "Insira uma imagem"}
                  </p>
                </div>
              );
            }
          },
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0].url;
          setImageUrl(url);
          onChange(url);
          onOpen();
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
      <p className="text-[10px] text-gray-400">
        Essa será a imagem tema do post
      </p>
    </div>
  );
};

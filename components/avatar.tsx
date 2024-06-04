import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type ImageProps = {
  imageUrl: string | StaticImport;
};

export const Avatar = ({ imageUrl }: ImageProps) => {
  return (
    <div className="relative size-10 rounded-full overflow-hidden">
      <Image
        src={imageUrl}
        alt="avatar"
        fill
        sizes="(min-width: 640px) 33vw"
        priority
      />
    </div>
  );
};

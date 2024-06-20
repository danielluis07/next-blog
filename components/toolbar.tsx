"use client";

import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { FaBold, FaImage, FaItalic, FaUnderline } from "react-icons/fa6";
import {
  CiTextAlignCenter,
  CiTextAlignJustify,
  CiTextAlignLeft,
  CiTextAlignRight,
} from "react-icons/ci";
import { BsListUl, BsListOl } from "react-icons/bs";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { RiDoubleQuotesL, RiFontFamily } from "react-icons/ri";
import { GoHorizontalRule } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { CiUndo } from "react-icons/ci";
import { CiRedo } from "react-icons/ci";
import { GoStrikethrough } from "react-icons/go";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";
import { cn } from "@/lib/utils";

type ToolbarProps = {
  editor: Editor | null;
};

const colors = [
  {
    name: "black",
    value: "#000000",
  },
  {
    name: "red",
    value: "#FF5733",
  },
  {
    name: "green",
    value: "#33FF57",
  },
  {
    name: "blue",
    value: "#3357FF",
  },
  {
    name: "pink",
    value: "#FF33A1",
  },
  {
    name: "cyan",
    value: "#33FFF5",
  },
  {
    name: "yellow",
    value: "#F5FF33",
  },
  {
    name: "orange",
    value: "#FF8C33",
  },
  {
    name: "purple",
    value: "#8C33FF",
  },
];

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const colorDivRef = useRef<HTMLDivElement>(null);

  if (!editor) {
    return null;
  }

  const handleClick = (colorValue: string) => {
    setValue(colorValue);
    setOpen(false);
    editor.chain().focus().setColor(colorValue).run();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorDivRef.current &&
        !colorDivRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorDivRef]);

  return (
    <div className="flex items-center lg:space-x-5 pb-2">
      <div className="space-x-1">
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().toggleBold().run()}>
          <FaBold className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().toggleItalic().run()}>
          <FaItalic className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().toggleUnderline().run()}>
          <FaUnderline className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <GoStrikethrough className="text-lg" />
        </Toggle>
      </div>

      <div className="space-x-1">
        <div
          className="inline-flex items-center justify-center border border-gray-200 p-[7px] cursor-pointer rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
          onClick={() => editor.chain().focus().unsetTextAlign().run()}>
          <CiTextAlignLeft className="text-lg" />
        </div>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }>
          <CiTextAlignRight className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }>
          <CiTextAlignCenter className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }>
          <CiTextAlignJustify className="text-lg" />
        </Toggle>
      </div>

      <div
        ref={colorDivRef}
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center border border-gray-200 py-[5px] px-[7px] cursor-pointer rounded-md text-sm font-medium transition-colors hover:bg-muted">
        <div className="flex flex-col justify-center">
          <RiFontFamily className="text-lg" />
          <div
            className="w-full h-[3px]"
            style={{
              backgroundColor: value
                ? colors.find((color) => color.value === value)?.value
                : "#000000",
            }}></div>
        </div>
        {open && (
          <div className="grid grid-cols-5 gap-2 p-2 border border-gray-200 absolute left-0 top-[30px] w-48 z-10 bg-white shadow-md">
            {colors.map((color) => (
              <div
                className="flex justify-center p-1 hover:bg-muted"
                key={color.value}
                onClick={() => handleClick(color.value)}>
                <div
                  className="size-3"
                  style={{ backgroundColor: color.value }}></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-x-1">
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }>
          <LuHeading1 className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }>
          <LuHeading2 className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }>
          <LuHeading3 className="text-lg" />
        </Toggle>
      </div>

      <div className="space-x-1">
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }>
          <BsListUl className="text-lg" />
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }>
          <BsListOl className="text-lg" />
        </Toggle>
      </div>

      <div className="space-x-1">
        <Toggle
          variant="outline"
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }>
          <RiDoubleQuotesL className="text-lg" />
        </Toggle>
        <div
          className="inline-flex items-center justify-center border border-gray-200 p-[7px] cursor-pointer rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <GoHorizontalRule className="text-lg" />
        </div>
      </div>

      <div>
        <UploadButton
          className="ut-button:w-[42px] ut-button:h-[33px] ut-button:ring-0 ut-button:focus-within:ring-0 ut-button:focus-within:ring-offset-0 ut-button:border ut-button:border-gray-200 ut-button:bg-transparent ut-button:hover:bg-muted ut-button:after:bg-transparent ut-button:after:transition-none ut-allowed-content:hidden"
          endpoint="imageUploader"
          content={{
            button({ ready, isUploading }) {
              if (isUploading) {
                return <MoonLoader size={12} />;
              }
              if (ready) {
                return <FaImage className="text-md text-black" />;
              }
            },
          }}
          onClientUploadComplete={(res) => {
            res.forEach((image) => {
              const url = image.url;
              if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
              }
            });
          }}
          onUploadError={(error: Error) => {
            toast.error(`${error?.message}`);
          }}
        />
      </div>

      <div className="space-x-1">
        <div
          className={cn(
            !editor.can().undo() && "bg-gray-100 pointer-events-none",
            "inline-flex items-center justify-center border border-gray-200 p-[7px] cursor-pointer rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
          )}
          onClick={() => editor.chain().focus().undo().run()}>
          <CiUndo className="text-lg" />
        </div>
        <div
          className={cn(
            !editor.can().redo() && "bg-gray-100 pointer-events-none",
            "inline-flex items-center justify-center border border-gray-200 p-[7px] cursor-pointer rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
          )}
          onClick={() => editor.chain().focus().redo().run()}>
          <CiRedo className="text-lg" />
        </div>
      </div>
    </div>
  );
};

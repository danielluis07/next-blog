"use client";

import { forwardRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "@/components/toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Focus from "@tiptap/extension-focus";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import { Skeleton } from "@/components/ui/skeleton";

type TextEditorProps = {
  content: string;
  onChange: (richText: string) => void;
};

export const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ content, onChange }, ref) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Image,
        Focus.configure({
          className: "has-focus",
          mode: "all",
        }),
        Color.configure({
          types: ["textStyle"],
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        CharacterCount,
      ],
      content: content,
      editorProps: {
        attributes: {
          class: "editor-content",
          spellcheck: "false",
        },
      },
      onUpdate({ editor }) {
        onChange(editor.getHTML());
      },
      onCreate() {
        setIsLoading(false);
      },
    });

    if (isLoading) {
      return (
        <div className="w-full">
          <Skeleton className="w-full h-[200px]" />
        </div>
      );
    }

    return (
      <div ref={ref} className="border border-input rounded-lg py-2 px-1">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
        <div className="flex items-center space-x-1 py-1">
          <p className="text-[12px] text-gray-400">
            {editor?.storage.characterCount.characters()} letras
          </p>
          <span className="text-[12px] text-gray-400">/</span>
          <p className="text-[12px] text-gray-400">
            {editor?.storage.characterCount.words()} palavras
          </p>
        </div>
      </div>
    );
  }
);

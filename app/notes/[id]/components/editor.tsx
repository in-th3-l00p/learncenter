"use client";

import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Button } from "@nextui-org/button";
import clsx from "clsx";
import { Color } from "@tiptap/extension-color";
import { TextStyle, TextStyleOptions } from "@tiptap/extension-text-style";
import { ListItem } from "@tiptap/extension-list-item";
import "../styles/editor.scss";
import { useContext } from "react";
import NoteContext from "@/app/notes/[id]/context/NoteContext";
import { Placeholder } from "@tiptap/extension-placeholder";

export default function Editor() {
  const {note, setNote} = useContext(NoteContext);

  const editor = useEditor({
    autofocus: true,
    content: note.content,
    onUpdate({ editor }) {
      setNote({
        ...note,
        content: editor.getHTML(),
      });
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({
        types: [ListItem.name],
      } as Partial<TextStyleOptions>),
      StarterKit,
      Placeholder
    ],
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: "focus:outline-0",
      },
    },
  });

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
          <div
            className={"flex gap-2 bg-content2 border-content1 rounded-lg p-1"}
          >
            <Button
              isIconOnly
              className={clsx("font-bold")}
              size={"sm"}
              variant={editor.isActive("bold") ? "flat" : "solid"}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </Button>
            <Button isIconOnly className={"font-italic"} size={"sm"}>
              I
            </Button>
            <Button isIconOnly className={"underline"} size={"sm"}>
              U
            </Button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent className={"tiptap focus:border-0"} editor={editor} />
    </>
  );
}

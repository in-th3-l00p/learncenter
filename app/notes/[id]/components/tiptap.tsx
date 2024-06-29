import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
  });

  return <EditorContent editor={editor} />;
}

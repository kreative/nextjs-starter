import _ from "lodash";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import TiptapSkeleton from "./TiptapSkeleton";

interface TiptapProps {
  maxHeight?: string;
  additionalStyles?: any;
  className?: string;
  hideSkeleton?: boolean;
  content: string | undefined | null;
  onChange: any;
}

const Tiptap = (props: TiptapProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose max-w-none font-medium text-black w-full h-full min-h-64 py-2 text-md bg-transparent focus:ring-0 focus:outline-none",
      },
    },
    extensions: [Document, Paragraph, Text, History],
    content: props.content,
    onUpdate: ({ editor }) => {
      props.onChange(editor.getJSON());
    },
    autofocus: true,
  });

  if (!editor) {
    if (props.hideSkeleton) return null;
    return <TiptapSkeleton />;
  }

  return (
    <div>
      <EditorContent
        style={{
          ...props.additionalStyles,
          whiteSpace: "pre-line",
        }}
        editor={editor}
        className={cn("bg-transparent", props.className)}
      />
    </div>
  );
};

export default Tiptap;

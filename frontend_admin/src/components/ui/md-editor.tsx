"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MDEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  height?: number;
}

export function MarkdownEditor({ value, onChange, height = 400 }: MDEditorProps) {
  const { resolvedTheme } = useTheme();
  
  return (
    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit"
      />
    </div>
  );
}

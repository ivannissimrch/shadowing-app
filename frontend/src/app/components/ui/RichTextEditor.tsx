"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FiBold } from "react-icons/fi";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Color, TextStyle],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-editor-content",
      },
    },
  });

  const isBlue = editor?.isActive("textStyle", { color: "#0066FF" }) ?? false;
  const isRed = editor?.isActive("textStyle", { color: "#FF0000" }) ?? false;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 1,
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
        },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "grey.200",
          p: 1,
          bgcolor: "grey.50",
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          type="button"
          size="small"
          variant={editor?.isActive("bold") ? "contained" : "outlined"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
          sx={{ minWidth: 40 }}
        >
          <FiBold />
        </Button>
        <Button
          type="button"
          size="small"
          variant={isBlue ? "contained" : "outlined"}
          onClick={() => {
            if (isBlue) {
              editor?.chain().focus().unsetColor().run();
            } else {
              editor?.chain().focus().setColor("#0066FF").run();
            }
          }}
          disabled={!editor}
          sx={{
            minWidth: 40,
            color: isBlue ? "white" : "#0066FF",
            borderColor: "#0066FF",
            bgcolor: isBlue ? "#0066FF" : "transparent",
            "&:hover": {
              bgcolor: isBlue ? "#0052CC" : "rgba(0, 102, 255, 0.08)",
              borderColor: "#0066FF",
            },
          }}
        >
          A
        </Button>
        <Button
          type="button"
          size="small"
          variant={isRed ? "contained" : "outlined"}
          onClick={() => {
            if (isRed) {
              editor?.chain().focus().unsetColor().run();
            } else {
              editor?.chain().focus().setColor("#FF0000").run();
            }
          }}
          disabled={!editor}
          sx={{
            minWidth: 40,
            color: isRed ? "white" : "#FF0000",
            borderColor: "#FF0000",
            bgcolor: isRed ? "#FF0000" : "transparent",
            "&:hover": {
              bgcolor: isRed ? "#CC0000" : "rgba(255, 0, 0, 0.08)",
              borderColor: "#FF0000",
            },
          }}
        >
          A
        </Button>
      </Box>

      {/* Editor content area */}
      <Box
        sx={{
          p: 2,
          minHeight: 200,
          "& .ProseMirror": {
            outline: "none",
            minHeight: 180,
            color: "#000",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          },
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            content: `"${placeholder || "Paste or type your lesson script here..."}"`,
            color: "grey.400",
            float: "left",
            pointerEvents: "none",
          },
          "& .ProseMirror p": {
            margin: 0,
            marginBottom: 1,
          },
          "& .ProseMirror ul, & .ProseMirror ol": {
            paddingLeft: 3,
          },
        }}
      >
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <Box sx={{ color: "grey.400", minHeight: 180 }}>Loading editor...</Box>
        )}
      </Box>
    </Box>
  );
}

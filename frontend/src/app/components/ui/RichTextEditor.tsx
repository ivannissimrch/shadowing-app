"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@/app/extensions/FontSize";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, MouseEvent } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
} from "react-icons/fi";
import { ImStrikethrough } from "react-icons/im";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  compact?: boolean;
}

const FONT_FAMILIES = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Century Gothic", value: "'Century Gothic', sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

const TEXT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#FF0000" },
  { label: "Blue", value: "#0066FF" },
  { label: "Green", value: "#008000" },
  { label: "Orange", value: "#FF8C00" },
  { label: "Purple", value: "#800080" },
  { label: "Brown", value: "#8B4513" },
  { label: "Gray", value: "#666666" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#FFFF00" },
  { label: "Lime", value: "#00FF00" },
  { label: "Cyan", value: "#00FFFF" },
  { label: "Pink", value: "#FF69B4" },
  { label: "Orange", value: "#FFA500" },
  { label: "Lavender", value: "#E6E6FA" },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  compact = false,
}: RichTextEditorProps) {
  const [fontFamilyAnchor, setFontFamilyAnchor] = useState<null | HTMLElement>(null);
  const [fontSizeAnchor, setFontSizeAnchor] = useState<null | HTMLElement>(null);
  const [textColorAnchor, setTextColorAnchor] = useState<null | HTMLElement>(null);
  const [highlightAnchor, setHighlightAnchor] = useState<null | HTMLElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      Underline,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
    ],
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

  const handleFontFamilyClick = (e: MouseEvent<HTMLButtonElement>) => {
    setFontFamilyAnchor(e.currentTarget);
  };

  const handleFontSizeClick = (e: MouseEvent<HTMLButtonElement>) => {
    setFontSizeAnchor(e.currentTarget);
  };

  const handleTextColorClick = (e: MouseEvent<HTMLButtonElement>) => {
    setTextColorAnchor(e.currentTarget);
  };

  const handleHighlightClick = (e: MouseEvent<HTMLButtonElement>) => {
    setHighlightAnchor(e.currentTarget);
  };

  const handleFontFamilySelect = (fontFamily: string) => {
    editor?.chain().focus().setFontFamily(fontFamily).run();
    setFontFamilyAnchor(null);
  };

  const handleFontSizeSelect = (fontSize: string) => {
    editor?.chain().focus().setFontSize(fontSize).run();
    setFontSizeAnchor(null);
  };

  const handleTextColorSelect = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setTextColorAnchor(null);
  };

  const handleHighlightSelect = (color: string | null) => {
    if (color) {
      editor?.chain().focus().setHighlight({ color }).run();
    } else {
      editor?.chain().focus().unsetHighlight().run();
    }
    setHighlightAnchor(null);
  };

  const getCurrentFontFamily = () => {
    const attrs = editor?.getAttributes("textStyle");
    if (attrs?.fontFamily) {
      const found = FONT_FAMILIES.find((f) => f.value === attrs.fontFamily);
      return found?.label || "Verdana";
    }
    return "Verdana";
  };

  const getCurrentFontSize = () => {
    const attrs = editor?.getAttributes("textStyle");
    return attrs?.fontSize || "Size";
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "#bdbdbd",
        borderRadius: 1,
        bgcolor: "#ffffff",
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
          borderColor: "#e0e0e0",
          p: 1,
          bgcolor: "#fafafa",
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          alignItems: "center",
        }}
      >
        {/* Font Family Dropdown */}
        <Button
          type="button"
          size="small"
          variant="outlined"
          onClick={handleFontFamilyClick}
          disabled={!editor}
          sx={{ minWidth: 80, fontSize: "0.75rem", textTransform: "none" }}
        >
          {getCurrentFontFamily()}
        </Button>
        <Menu
          anchorEl={fontFamilyAnchor}
          open={Boolean(fontFamilyAnchor)}
          onClose={() => setFontFamilyAnchor(null)}
        >
          {FONT_FAMILIES.map((font) => (
            <MenuItem
              key={font.value}
              onClick={() => handleFontFamilySelect(font.value)}
              sx={{ fontFamily: font.value }}
            >
              {font.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Font Size Dropdown */}
        <Button
          type="button"
          size="small"
          variant="outlined"
          onClick={handleFontSizeClick}
          disabled={!editor}
          sx={{ minWidth: 60, fontSize: "0.75rem", textTransform: "none" }}
        >
          {getCurrentFontSize()}
        </Button>
        <Menu
          anchorEl={fontSizeAnchor}
          open={Boolean(fontSizeAnchor)}
          onClose={() => setFontSizeAnchor(null)}
        >
          {FONT_SIZES.map((size) => (
            <MenuItem key={size} onClick={() => handleFontSizeSelect(size)}>
              {size}
            </MenuItem>
          ))}
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Bold */}
        <Button
          type="button"
          size="small"
          variant={editor?.isActive("bold") ? "contained" : "outlined"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
          sx={{ minWidth: 36, px: 1 }}
        >
          <FiBold />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          size="small"
          variant={editor?.isActive("italic") ? "contained" : "outlined"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
          sx={{ minWidth: 36, px: 1 }}
        >
          <FiItalic />
        </Button>

        {/* Underline */}
        <Button
          type="button"
          size="small"
          variant={editor?.isActive("underline") ? "contained" : "outlined"}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={!editor}
          sx={{ minWidth: 36, px: 1 }}
        >
          <FiUnderline />
        </Button>

        {/* Strikethrough */}
        <Button
          type="button"
          size="small"
          variant={editor?.isActive("strike") ? "contained" : "outlined"}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor}
          sx={{ minWidth: 36, px: 1 }}
        >
          <ImStrikethrough />
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text Color */}
        <Button
          type="button"
          size="small"
          variant="outlined"
          onClick={handleTextColorClick}
          disabled={!editor}
          sx={{ minWidth: 36, px: 1, fontWeight: "bold" }}
        >
          A
          <Box
            component="span"
            sx={{
              display: "block",
              width: 14,
              height: 3,
              bgcolor: editor?.getAttributes("textStyle").color || "#000000",
              position: "absolute",
              bottom: 4,
            }}
          />
        </Button>
        <Menu
          anchorEl={textColorAnchor}
          open={Boolean(textColorAnchor)}
          onClose={() => setTextColorAnchor(null)}
        >
          {TEXT_COLORS.map((color) => (
            <MenuItem
              key={color.value}
              onClick={() => handleTextColorSelect(color.value)}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: color.value,
                  borderRadius: 0.5,
                  border: "1px solid #ccc",
                }}
              />
              {color.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Highlight Color */}
        <Button
          type="button"
          size="small"
          variant={editor?.isActive("highlight") ? "contained" : "outlined"}
          onClick={handleHighlightClick}
          disabled={!editor}
          sx={{ minWidth: 36, px: 1, fontSize: "0.85rem" }}
        >
          H
        </Button>
        <Menu
          anchorEl={highlightAnchor}
          open={Boolean(highlightAnchor)}
          onClose={() => setHighlightAnchor(null)}
        >
          <MenuItem
            onClick={() => handleHighlightSelect(null)}
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            No highlight
          </MenuItem>
          {HIGHLIGHT_COLORS.map((color) => (
            <MenuItem
              key={color.value}
              onClick={() => handleHighlightSelect(color.value)}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: color.value,
                  borderRadius: 0.5,
                  border: "1px solid #ccc",
                }}
              />
              {color.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Editor content area */}
      <Box
        sx={{
          p: compact ? 1.5 : 2,
          minHeight: compact ? 80 : 200,
          bgcolor: "#ffffff",
          "& .ProseMirror": {
            outline: "none",
            minHeight: compact ? 60 : 180,
            color: "#000",
            fontFamily: "Verdana, sans-serif",
            fontSize: compact ? "0.9rem" : "1.1rem",
            lineHeight: 1.6,
          },
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            content: `"${placeholder || "Paste or type your lesson script here..."}"`,
            color: "#9e9e9e",
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
          "& .ProseMirror mark": {
            borderRadius: "2px",
            padding: "0 2px",
          },
        }}
      >
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <Box sx={{ minHeight: compact ? 60 : 180, display: "grid", placeItems: "center" }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

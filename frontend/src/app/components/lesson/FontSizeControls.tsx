import useFontSize from "@/app/hooks/useFontSize";
import usePdfDownload from "@/app/hooks/usePdfDownload";
import { Box, IconButton } from "@mui/material";
import { MdDownload } from "react-icons/md";

interface FontSizeControlsProps {
  lessonTitle?: string;
}

export default function FontSizeControls({ lessonTitle }: FontSizeControlsProps) {
  const { increaseFontSize, decreaseFontSize } = useFontSize();
  const { downloadAsPdf } = usePdfDownload();

  const handleDownload = () => {
    const fileName = lessonTitle
      ? `${lessonTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-script`
      : "lesson-script";
    downloadAsPdf("script-content", fileName);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 0.5,
        px: 2,
        py: 0.5,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <IconButton
        size="small"
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "1px solid",
          borderColor: "#e0e0e0",
          color: "#1a1a1a",
          borderRadius: 1,
          px: 1,
          minWidth: 32,
        }}
        onClick={decreaseFontSize}
      >
        A-
      </IconButton>
      <IconButton
        size="small"
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "1px solid",
          borderColor: "#e0e0e0",
          color: "#1a1a1a",
          borderRadius: 1,
          px: 1,
          minWidth: 32,
        }}
        onClick={increaseFontSize}
      >
        A+
      </IconButton>
      <IconButton
        size="small"
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "1px solid",
          borderColor: "#e0e0e0",
          color: "#1a1a1a",
          borderRadius: 1,
          px: 1,
          minWidth: 32,
          ml: 1,
        }}
        onClick={handleDownload}
        title="Download as PDF"
      >
        <MdDownload />
      </IconButton>
    </Box>
  );
}

import useFontSize from "@/app/hooks/useFontSize";
import { Box, IconButton } from "@mui/material";

export default function FontSizeControls() {
  const { increaseFontSize, decreaseFontSize } = useFontSize();

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
    </Box>
  );
}

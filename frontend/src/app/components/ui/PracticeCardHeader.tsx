import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FiX } from "react-icons/fi";

interface PracticeCardHeaderProps {
  text: string;
  onDelete?: () => void;
  tPracticeWords: (key: string) => string;
}

export default function PracticeCardHeader({
  text,
  onDelete,
  tPracticeWords,
}: PracticeCardHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "text.primary", flex: 1 }}
      >
        {text}
      </Typography>
      {onDelete && (
        <Tooltip title={tPracticeWords("deleteWord")}>
          <IconButton onClick={onDelete} size="small" color="error">
            <FiX size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

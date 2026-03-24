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
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          pr: 1,
          width: "calc(100vw - 120px)",
          maxWidth: "calc(100vw - 120px)"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            lineHeight: 1.4,
            fontSize: { xs: "0.95rem", sm: "1.25rem" }
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Box>
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

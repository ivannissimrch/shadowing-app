import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiPlus } from "react-icons/fi";

interface TeacherPageHeaderProps {
  title: string;
  buttonText: string;
  onClick: () => void;
}

export default function TeacherPageHeader({
  title,
  buttonText,
  onClick,
}: TeacherPageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 600, color: "text.primary" }}
      >
        {title}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        startIcon={<FiPlus size={18} />}
        sx={{ textTransform: "none", fontWeight: 500 }}
      >
        {buttonText}
      </Button>
    </Box>
  );
}

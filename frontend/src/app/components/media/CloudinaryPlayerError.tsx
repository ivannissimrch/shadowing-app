import { Box, Typography } from "@mui/material";
import { FiAlertCircle } from "react-icons/fi";

export default function CloudinaryPlayerError() {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        bgcolor: "grey.100",
        borderRadius: 2,
      }}
      role="region"
      aria-label="Video unavailable message"
    >
      <FiAlertCircle size={48} color="#697586" style={{ marginBottom: 16 }} />
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
      >
        Video Unavailable
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This video cannot be loaded. Please try again later.
      </Typography>
    </Box>
  );
}

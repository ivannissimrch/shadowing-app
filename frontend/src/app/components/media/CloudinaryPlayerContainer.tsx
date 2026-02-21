import { Box } from "@mui/material";

export default function CloudinaryPlayerContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      component="section"
      role="region"
      aria-label="Video player for pronunciation practice"
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {children}
    </Box>
  );
}

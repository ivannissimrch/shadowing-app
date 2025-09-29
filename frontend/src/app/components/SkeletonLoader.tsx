import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonLoader() {
  return (
    <Box sx={{ width: "80%", height: "80%" }}>
      <Skeleton animation="wave" height={100} />
      <Skeleton animation="wave" height={100} />
      <Skeleton animation={"wave"} height={100} />
    </Box>
  );
}
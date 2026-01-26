import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function PracticePageSkeleton() {
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 2,
        }}
      >
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 2,
          }}
        />

        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: "100%",
            aspectRatio: "16 / 10",
            borderRadius: 2,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={120}
          height={36}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={120}
          height={36}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      <Skeleton
        animation="wave"
        variant="rectangular"
        height={200}
        sx={{
          width: "100%",
          borderRadius: 2,
        }}
      />
    </Box>
  );
}

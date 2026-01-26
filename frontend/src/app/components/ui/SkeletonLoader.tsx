import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function SkeletonLoader() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((skeletonCard) => (
        <Card key={skeletonCard}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={80}
          />
          <CardContent>
            <Skeleton animation="wave" width="80%" height={24} sx={{ mb: 1 }} />
            <Skeleton animation="wave" width="40%" height={20} />
          </CardContent>
          <Box sx={{ p: 2, pt: 0 }}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              height={40}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
}

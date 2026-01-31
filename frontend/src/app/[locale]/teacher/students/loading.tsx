import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

export default function StudentsLoading() {
  return (
    <Box>
      <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />

      <Box
        sx={{
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 2,
          p: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Skeleton variant="text" width={120} height={30} />
          <Skeleton
            variant="rectangular"
            width={100}
            height={32}
            sx={{ borderRadius: 1 }}
          />
        </Box>

        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

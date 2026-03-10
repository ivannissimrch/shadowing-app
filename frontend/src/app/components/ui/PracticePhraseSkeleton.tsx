import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function PracticePhraseSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1, 2].map((i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Skeleton variant="rounded" width={80} height={36} />
              <Skeleton variant="rounded" width={80} height={36} />
            </Box>
            <Skeleton
              variant="rounded"
              width="100%"
              height={12}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

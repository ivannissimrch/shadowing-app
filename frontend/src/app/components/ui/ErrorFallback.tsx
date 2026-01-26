import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <CardContent sx={{ p: 4 }}>
          <FiAlertTriangle size={48} color="#f44336" style={{ marginBottom: 16 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {error.message}
          </Typography>
          <Button
            variant="contained"
            onClick={resetErrorBoundary}
            startIcon={<FiRefreshCw size={16} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

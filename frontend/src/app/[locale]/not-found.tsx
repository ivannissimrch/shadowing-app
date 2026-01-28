import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiAlertCircle, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <CardContent sx={{ p: 4 }}>
          <FiAlertCircle size={48} color="#ff9800" style={{ marginBottom: 16 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            The page you are looking for does not exist.
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            startIcon={<FiHome size={16} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Go Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

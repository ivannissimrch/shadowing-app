"use client";
import { useTranslations } from "next-intl";
import StudentLessons from "../../../components/student/StudentLessons";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../components/ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "../../../constants/apiKeys";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Lessons() {
  const t = useTranslations("student");

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("myLessons")}
      </Typography>
      <ErrorBoundary
        fallbackRender={(props) => (
          <ErrorFallback {...props} title="Error Loading Lessons" />
        )}
        onReset={() => {
          mutate(API_PATHS.LESSONS, undefined, { revalidate: true });
        }}
      >
        <StudentLessons />
      </ErrorBoundary>
    </Box>
  );
}

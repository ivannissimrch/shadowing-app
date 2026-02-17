import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface GreetingCardProps {
  username?: string;
  role: "teacher" | "student";
  pendingCount?: number;
}

export default function GreetingCard({
  username,
  role,
  pendingCount,
}: GreetingCardProps) {
  const t = useTranslations("greeting");

  const hour = new Date().getHours();
  let greeting = "";
  if (hour < 12) greeting = "goodMorning";
  else if (hour < 18) greeting = "goodAfternoon";
  else greeting = "goodEvening";

  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
        {t(greeting)}, {username}
      </Typography>
      {role === "teacher" && pendingCount !== undefined && (
        <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
          {t("pendingLessons", { count: pendingCount })}
        </Typography>
      )}
    </Box>
  );
}

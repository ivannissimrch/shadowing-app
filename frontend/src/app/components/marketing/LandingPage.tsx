"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  FiMic,
  FiVideo,
  FiMessageCircle,
  FiActivity,
  FiChevronDown,
  FiCheck,
  FiStar,
  FiClock,
} from "react-icons/fi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import DarkModeToggle from "../ui/DarkModeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import MainCard from "../ui/MainCard";
import { palette } from "@/themes/palette";

const CONTACT_EMAIL = "analisse84.ar@gmail.com";
const YOUTUBE_URL = "https://www.youtube.com/@FluencyAccentCoach";
const FACEBOOK_PAGE_URL = "https://www.facebook.com/Analisse84/";
const FACEBOOK_GROUP_URL = "https://www.facebook.com/share/g/18wdNiusvm/";
const ACCENT = palette.orange.dark;

function dotPatternSx(theme: import("@mui/material/styles").Theme) {
  const dotColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.06)";
  return {
    backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
    backgroundSize: "18px 18px",
  };
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: "block",
        textAlign: "center",
        color: ACCENT,
        fontWeight: 700,
        letterSpacing: 1.5,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

export default function LandingPage() {
  const t = useTranslations("landing");

  const features = [
    {
      key: "pronunciation",
      icon: <FiActivity size={24} />,
      color: "primary" as const,
    },
    {
      key: "shadowing",
      icon: <FiMic size={24} />,
      color: "secondary" as const,
    },
    {
      key: "recording",
      icon: <FiVideo size={24} />,
      color: "primary" as const,
    },
    {
      key: "feedback",
      icon: <FiMessageCircle size={24} />,
      color: "secondary" as const,
    },
  ];

  const courses = [
    "membership",
    "accent",
    "phrasalVerbs",
    "ipa",
    "shadowing",
  ] as const;

  const coachingTiers = ["starter", "intermediate", "advanced"] as const;

  const miniCourses = [
    "vowelsConsonants",
    "ipaSymbols",
    "diphthongsTriphthongs",
  ] as const;

  const faqItems = [
    "whatIsIt",
    "coursesAvailable",
    "existingStudent",
    "paymentOptions",
    "refundPolicy",
  ] as const;

  return (
    <Box>
      {/* Header */}
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 4 },
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ position: "relative", width: 32, height: 32 }}>
            <Image
              src="/favicon.png"
              alt=""
              fill
              sizes="32px"
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="h6" fontWeight={700}>
              {t("brand")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("brandTagline")}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <DarkModeToggle />
          <LanguageSwitcher />
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            size="small"
          >
            {t("signIn")}
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 130%)`,
          color: "#fff",
        })}
      >
        <Container
          maxWidth="md"
          sx={{ textAlign: "center", py: { xs: 8, sm: 12 } }}
        >
          <Chip
            label={t("hero.eyebrow")}
            size="small"
            sx={{
              mb: 3,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          />
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            {t("hero.title")}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
          >
            {t("hero.subtitle")}
          </Typography>
          <Button
            href={`mailto:${CONTACT_EMAIL}`}
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: "#fff",
              color: "primary.main",
              fontWeight: 700,
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            {t("hero.cta")}
          </Button>
        </Container>
      </Box>

      {/* About Lyn */}
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "common.white",
          py: { xs: 6, sm: 8 },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "auto 1fr" },
              gap: { xs: 3, sm: 6 },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                mx: { xs: "auto", sm: 0 },
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid",
                borderColor: "grey.700",
                boxShadow: 3,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/lyn.avif"
                alt={t("about.title")}
                fill
                sizes="140px"
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                variant="overline"
                sx={{ color: ACCENT, fontWeight: 700, letterSpacing: 1.5 }}
              >
                {t("about.eyebrow")}
              </Typography>
              <Typography variant="h4" component="h2" gutterBottom>
                {t("about.title")}
              </Typography>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  mb: 3,
                  display: "inline-block",
                  maxWidth: "62ch",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {t("about.pullQuote")}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "grey.300",
                  whiteSpace: "pre-line",
                  maxWidth: "62ch",
                  lineHeight: 1.8,
                  mx: { xs: "auto", sm: 0 },
                }}
              >
                {t("about.body")}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Courses */}
      <Box
        sx={(theme) => ({
          bgcolor: "background.default",
          py: { xs: 6, sm: 8 },
          ...dotPatternSx(theme),
        })}
      >
        <Container maxWidth="lg">
          <SectionEyebrow>{t("courses.eyebrow")}</SectionEyebrow>
          <Typography variant="h3" component="h2" textAlign="center">
            {t("courses.title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 5 }}
          >
            {t("courses.subtitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {courses.map((key) => {
              const isFeatured = key === "membership";
              return (
                <MainCard
                  key={key}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "visible",
                    ...(isFeatured && {
                      borderColor: "secondary.main",
                      borderWidth: 2,
                      borderStyle: "solid",
                    }),
                  }}
                >
                  {isFeatured && (
                    <Chip
                      icon={<FiStar size={14} />}
                      label={t("courses.featuredBadge")}
                      color="secondary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -14,
                        left: 16,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {t(`courses.${key}.title`)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {t(`courses.${key}.description`)}
                    </Typography>
                    <List dense disablePadding sx={{ mb: 2 }}>
                      {(["benefit1", "benefit2", "benefit3"] as const).map(
                        (benefitKey) => (
                          <ListItem
                            key={benefitKey}
                            disableGutters
                            sx={{ py: 0.25 }}
                          >
                            <ListItemIcon
                              sx={{ minWidth: 28, color: "primary.main" }}
                            >
                              <FiCheck size={18} />
                            </ListItemIcon>
                            <ListItemText
                              primaryTypographyProps={{
                                variant: "body2",
                                color: "text.secondary",
                              }}
                            >
                              {t(`courses.${key}.${benefitKey}`)}
                            </ListItemText>
                          </ListItem>
                        )
                      )}
                    </List>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="secondary.main"
                    >
                      {t(`courses.${key}.price`)}
                    </Typography>
                  </Box>
                  <Button
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(`courses.${key}.title`))}`}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {t("courses.signUpCta")}
                  </Button>
                </MainCard>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Coaching Packages */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        <SectionEyebrow>{t("coachingPackages.eyebrow")}</SectionEyebrow>
        <Typography variant="h3" component="h2" textAlign="center">
          {t("coachingPackages.title")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 5 }}
        >
          {t("coachingPackages.subtitle")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          {coachingTiers.map((key) => (
            <MainCard
              key={key}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {t(`coachingPackages.${key}.title`)}
              </Typography>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {t(`coachingPackages.${key}.price`)}
              </Typography>
              <Chip
                label={t(`coachingPackages.${key}.sessions`)}
                size="small"
                sx={{
                  mt: 1,
                  mb: 2,
                  mx: "auto",
                  bgcolor: "primary.light",
                  color: "primary.main",
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, flexGrow: 1 }}
              >
                {t(`coachingPackages.${key}.description`)}
              </Typography>
              <Button
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(`coachingPackages.${key}.title`))}`}
                variant="outlined"
                color="primary"
                fullWidth
              >
                {t("coachingPackages.signUpCta")}
              </Button>
            </MainCard>
          ))}
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
        >
          {t("coachingPackages.cancellationNote")}
        </Typography>
      </Container>

      {/* Mini Courses (Coming Soon) */}
      <Box
        sx={(theme) => ({
          bgcolor: "background.default",
          py: { xs: 6, sm: 8 },
          ...dotPatternSx(theme),
        })}
      >
        <Container maxWidth="lg">
          <SectionEyebrow>{t("miniCourses.comingSoon")}</SectionEyebrow>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            {t("miniCourses.title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 5 }}
          >
            {t("miniCourses.subtitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {miniCourses.map((key) => (
              <MainCard
                key={key}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <Chip
                  icon={<FiClock size={14} />}
                  label={t("miniCourses.comingSoon")}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -14,
                    left: 16,
                    fontWeight: 600,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 1.5 }} gutterBottom>
                  {t(`miniCourses.${key}.title`)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, flexGrow: 1 }}
                >
                  {t(`miniCourses.${key}.description`)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color="secondary.main"
                >
                  {t(`miniCourses.${key}.price`)}
                </Typography>
              </MainCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          sx={{ mb: 5 }}
        >
          {t("features.title")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {features.map(({ key, icon, color }) => (
            <MainCard key={key}>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: `${color}.light`,
                  color: `${color}.main`,
                  width: 52,
                  height: 52,
                  mb: 2,
                }}
              >
                {icon}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {t(`features.${key}.title`)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`features.${key}.description`)}
              </Typography>
            </MainCard>
          ))}
        </Box>
      </Container>

      {/* Community */}
      <Box
        sx={(theme) => ({
          bgcolor: "background.default",
          py: { xs: 6, sm: 8 },
          ...dotPatternSx(theme),
        })}
      >
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <SectionEyebrow>{t("community.eyebrow")}</SectionEyebrow>
          <Typography variant="h4" component="h2" gutterBottom>
            {t("community.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t("community.subtitle")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<FaYoutube />}
              sx={{
                color: "#FF0000",
                borderColor: "#FF0000",
                "&:hover": {
                  borderColor: "#FF0000",
                  bgcolor: "rgba(255,0,0,0.06)",
                },
              }}
            >
              {t("community.youtube")}
            </Button>
            <Button
              href={FACEBOOK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<FaFacebook />}
              sx={{
                color: "#1877F2",
                borderColor: "#1877F2",
                "&:hover": {
                  borderColor: "#1877F2",
                  bgcolor: "rgba(24,119,242,0.06)",
                },
              }}
            >
              {t("community.facebookGroup")}
            </Button>
            <Button
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<FaFacebook />}
              sx={{
                color: "#1877F2",
                borderColor: "#1877F2",
                "&:hover": {
                  borderColor: "#1877F2",
                  bgcolor: "rgba(24,119,242,0.06)",
                },
              }}
            >
              {t("community.facebookPage")}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxWidth="sm" sx={{ py: { xs: 6, sm: 8 } }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          {t("faq.title")}
        </Typography>
        {faqItems.map((key) => (
          <Accordion
            key={key}
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "grey.200",
              "&:before": { display: "none" },
              mb: 1,
              borderRadius: 2,
            }}
          >
            <AccordionSummary expandIcon={<FiChevronDown />}>
              <Typography fontWeight={600}>
                {t(`faq.${key}.question`)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {t(`faq.${key}.answer`)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* Footer CTA */}
      <Box sx={{ borderTop: 1, borderColor: "divider", py: { xs: 5, sm: 6 } }}>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {t("footer.cta")}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              href={`mailto:${CONTACT_EMAIL}`}
              variant="contained"
              color="primary"
              size="large"
            >
              {t("hero.cta")}
            </Button>
            <Button component={Link} href="/login" variant="text">
              {t("footer.signIn")}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

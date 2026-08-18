"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {
  FiMic,
  FiVideo,
  FiMessageCircle,
  FiActivity,
  FiCheck,
  FiStar,
  FiClock,
  FiUsers,
  FiGlobe,
  FiAward,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiBookOpen,
  FiHeadphones,
  FiLayers,
  FiTarget,
  FiLock,
  FiRadio,
  FiChevronRight,
} from "react-icons/fi";
import { FaFacebook, FaFacebookF, FaYoutube } from "react-icons/fa";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const CONTACT_EMAIL = "analisse84.ar@gmail.com";
const YOUTUBE_URL = "https://www.youtube.com/@FluencyAccentCoach";
const FACEBOOK_PAGE_URL = "https://www.facebook.com/Analisse84/";
const FACEBOOK_GROUP_URL = "https://www.facebook.com/share/g/18wdNiusvm/";

const GREEN = {
  dark: "#1B3B2F",
  main: "#16302A",
  light: "#245044",
};
const CREAM = {
  main: "#FAF6EE",
  warm: "#F3EFE8",
  alt: "#EDE8DF",
};
const GOLD = {
  main: "#C9A227",
  light: "#DBB84A",
  dark: "#A8841A",
};
const ACCENT = {
  terracotta: "#C4694A",
  teal: "#4A8C82",
  rose: "#B87A85",
};

const serif = '"Playfair Display", "Georgia", "Times New Roman", serif';
const script = '"Segoe Script", "Brush Script MT", cursive';

const landingContainerSx = {
  px: "40px",
  width: "100%",
  maxWidth: "100%",
};

const cardHoverSx = {
  transition: "transform 0.28s ease, box-shadow 0.28s ease",
  "@media (prefers-reduced-motion: no-preference)": {
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  "&:focus-within": {
    outline: `2px solid ${GOLD.main}`,
    outlineOffset: 3,
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const slideIn = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
});

type AccentTone = "gold" | "terracotta" | "teal" | "rose" | "green";

const accentStyles: Record<
  AccentTone,
  { color: string; bg: string; border: string }
> = {
  gold: {
    color: GOLD.main,
    bg: "rgba(201,162,39,0.12)",
    border: "rgba(201,162,39,0.28)",
  },
  terracotta: {
    color: ACCENT.terracotta,
    bg: "rgba(196,105,74,0.12)",
    border: "rgba(196,105,74,0.25)",
  },
  teal: {
    color: ACCENT.teal,
    bg: "rgba(74,140,130,0.12)",
    border: "rgba(74,140,130,0.25)",
  },
  rose: {
    color: ACCENT.rose,
    bg: "rgba(184,122,133,0.12)",
    border: "rgba(184,122,133,0.25)",
  },
  green: {
    color: GREEN.dark,
    bg: "rgba(27,59,47,0.08)",
    border: "rgba(27,59,47,0.15)",
  },
};

function AccentIcon({
  icon,
  tone,
  size = 52,
  rounded = "rounded",
}: {
  icon: React.ReactNode;
  tone: AccentTone;
  size?: number;
  rounded?: "rounded" | "circle";
}) {
  const style = accentStyles[tone];
  return (
    <Box
      className="accent-icon"
      sx={{
        width: size,
        height: size,
        borderRadius: rounded === "circle" ? "50%" : 2.5,
        bgcolor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "transform 0.25s ease",
        ".card-hover-target:hover &": {
          transform: "scale(1.06)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          ".card-hover-target:hover &": { transform: "none" },
        },
      }}
    >
      {icon}
    </Box>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 6 } }}>
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: light ? GOLD.main : GOLD.dark,
          mb: 1.5,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        sx={{
          fontFamily: serif,
          fontWeight: 700,
          fontSize: { xs: "2.25rem", md: "3rem" },
          color: light ? "#fff" : GREEN.dark,
          lineHeight: 1.08,
          mb: subtitle ? 1.75 : 0,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            color: light ? "rgba(255,255,255,0.75)" : "#5a6a65",
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            lineHeight: 1.75,
            maxWidth: align === "center" ? 560 : 640,
            mx: align === "center" ? "auto" : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function CredibilityStripItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        flexShrink: 0,
        px: { xs: 2.5, md: 3.5 },
        py: 0.5,
        borderRight: `1px solid rgba(201,162,39,0.28)`,
        minWidth: { xs: 240, md: 280 },
      }}
    >
      <Box
        sx={{
          color: GOLD.main,
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1px solid rgba(201,162,39,0.4)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "0.78rem", md: "0.84rem" },
            lineHeight: 1.25,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.65rem", md: "0.7rem" },
            opacity: 0.82,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

function TestimonialCard({
  quote,
  author,
  variant = "medium",
}: {
  quote: string;
  author: string;
  variant?: "small" | "medium" | "large";
}) {
  const sizes = {
    small: { width: { xs: 280, md: 300 }, minH: 200, quoteSize: "0.85rem" },
    medium: { width: { xs: 300, md: 360 }, minH: 230, quoteSize: "0.92rem" },
    large: { width: { xs: 320, md: 400 }, minH: 260, quoteSize: "0.98rem" },
  };
  const s = sizes[variant];

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: s.width,
        mx: { xs: 1, md: 1.25 },
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(201,162,39,0.22)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        minHeight: s.minH,
      }}
    >
      <Typography
        sx={{
          fontFamily: serif,
          fontSize: variant === "large" ? "3rem" : "2.25rem",
          color: GOLD.main,
          lineHeight: 0.75,
          mb: 1.5,
          opacity: 0.85,
        }}
      >
        &ldquo;
      </Typography>
      <Typography
        sx={{
          color: "#fff",
          fontSize: s.quoteSize,
          lineHeight: 1.75,
          fontStyle: "italic",
          mb: 2,
          flexGrow: 1,
        }}
      >
        {quote}
      </Typography>
      <Stack direction="row" spacing={0.4} sx={{ mb: 1.5 }}>
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} size={14} color={GOLD.main} fill={GOLD.main} />
        ))}
      </Stack>
      <Typography
        sx={{
          color: GOLD.main,
          fontWeight: 700,
          fontSize: "0.88rem",
          letterSpacing: 0.4,
        }}
      >
        — {author}
      </Typography>
    </Box>
  );
}

function GoldOutlineButton({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      href={href}
      onClick={onClick}
      variant="outlined"
      endIcon={<FiArrowRight size={14} />}
      sx={{
        borderColor: GOLD.main,
        color: GOLD.dark,
        borderRadius: 999,
        px: 3,
        py: 1.1,
        fontWeight: 700,
        fontSize: "0.72rem",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        "&:hover": {
          borderColor: GOLD.dark,
          bgcolor: "rgba(201,162,39,0.08)",
        },
      }}
    >
      {children}
    </Button>
  );
}

function GreenPillButton({
  children,
  href,
  startIcon,
  sx,
}: {
  children: React.ReactNode;
  href?: string;
  startIcon?: React.ReactNode;
  sx?: object;
}) {
  return (
    <Button
      href={href}
      variant="contained"
      startIcon={startIcon}
      disableElevation
      sx={{
        bgcolor: GREEN.dark,
        color: "#fff",
        borderRadius: 999,
        px: 3,
        py: 1.2,
        fontWeight: 700,
        fontSize: "0.72rem",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        "&:hover": { bgcolor: GREEN.main },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

function PremiumCourseCard({
  icon,
  iconTone = "gold",
  title,
  description,
  price,
  href,
  cta,
  featured,
  featuredBadge,
  benefits,
  compact,
  sx,
}: {
  icon: React.ReactNode;
  iconTone?: AccentTone;
  title: string;
  description: string;
  price?: string;
  href: string;
  cta: string;
  featured?: boolean;
  featuredBadge?: string;
  benefits?: string[];
  compact?: boolean;
  sx?: object;
}) {
  return (
    <Box
      className="card-hover-target"
      component={motion.div}
      sx={{
        bgcolor: featured ? GREEN.dark : "#fff",
        backgroundImage: featured
          ? `linear-gradient(145deg, ${GREEN.dark} 0%, ${GREEN.main} 55%, #1a4538 100%)`
          : "none",
        color: featured ? "#fff" : GREEN.dark,
        border: featured ? "none" : "1px solid rgba(27,59,47,0.08)",
        borderRadius: 3,
        p: compact ? { xs: 2, md: 2.5 } : { xs: 2.5, md: 3 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: featured
          ? "0 24px 60px rgba(22,48,42,0.28)"
          : "0 4px 24px rgba(27,59,47,0.06)",
        position: "relative",
        overflow: "hidden",
        ...cardHoverSx,
        "&:hover": {
          boxShadow: featured
            ? "0 32px 70px rgba(22,48,42,0.35)"
            : "0 20px 48px rgba(27,59,47,0.12)",
        },
        ...sx,
      }}
    >
      {featured && (
        <>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              pointerEvents: "none",
            }}
          />
          {featuredBadge && (
            <Chip
              icon={<FiStar size={12} />}
              label={featuredBadge}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: GOLD.main,
                color: GREEN.dark,
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 26,
                zIndex: 1,
              }}
            />
          )}
        </>
      )}
      <AccentIcon
        icon={icon}
        tone={featured ? "gold" : iconTone}
        size={compact ? 44 : 52}
      />
      <Typography
        sx={{
          fontFamily: serif,
          fontWeight: 700,
          fontSize: featured ? "1.35rem" : compact ? "0.98rem" : "1.08rem",
          mb: 1,
          mt: 2,
          lineHeight: 1.3,
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: featured ? "rgba(255,255,255,0.82)" : "#5a6a65",
          lineHeight: 1.75,
          mb: 2,
          fontSize: compact ? "0.82rem" : "0.88rem",
          position: "relative",
          zIndex: 1,
          flexGrow: benefits ? 0 : 1,
        }}
      >
        {description}
      </Typography>
      {benefits && (
        <Stack
          spacing={0.75}
          sx={{ mb: 2, flexGrow: 1, position: "relative", zIndex: 1 }}
        >
          {benefits.map((benefit) => (
            <Stack
              key={benefit}
              direction="row"
              spacing={1}
              alignItems="flex-start"
            >
              <FiCheck
                size={14}
                color={GOLD.main}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {benefit}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
      {price && (
        <Typography
          sx={{
            fontWeight: 700,
            color: featured ? GOLD.main : GOLD.dark,
            fontSize: compact ? "0.82rem" : "0.9rem",
            mb: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          {price}
        </Typography>
      )}
      <Button
        href={href}
        variant={featured ? "contained" : "text"}
        sx={{
          alignSelf: "flex-start",
          color: featured ? GREEN.dark : GOLD.dark,
          bgcolor: featured ? GOLD.main : "transparent",
          fontWeight: 700,
          fontSize: "0.68rem",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          px: featured ? 2.5 : 0,
          borderRadius: 999,
          position: "relative",
          zIndex: 1,
          "&:hover": {
            bgcolor: featured ? GOLD.light : "rgba(201,162,39,0.08)",
          },
          "&:focus-visible": {
            outline: `2px solid ${GOLD.main}`,
            outlineOffset: 2,
          },
        }}
      >
        {cta}
      </Button>
    </Box>
  );
}

function ComingSoonCard({
  title,
  description,
  price,
  index,
  comingSoonLabel,
  icon,
  iconTone,
}: {
  title: string;
  description: string;
  price: string;
  index: number;
  comingSoonLabel: string;
  icon: React.ReactNode;
  iconTone: AccentTone;
}) {
  const offsets = [0, 24, 12];
  const offset = offsets[index % 3];

  return (
    <Box
      className="card-hover-target"
      component={motion.div}
      variants={slideIn(index % 2 === 0)}
      sx={{
        flex: { xs: "0 0 88%", sm: "0 0 300px", md: "1 1 0" },
        minWidth: { md: 0 },
        mt: { xs: 0, md: `${offset}px` },
        p: 3,
        borderRadius: 3,
        border: "1px solid rgba(201,162,39,0.2)",
        bgcolor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        ...cardHoverSx,
        "&:hover": {
          borderColor: "rgba(201,162,39,0.45)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          opacity: 0.35,
          filter: "blur(1px)",
        }}
      >
        <FiLock size={48} color={GOLD.main} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(110deg, transparent 40%, rgba(201,162,39,0.06) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 4s ease-in-out infinite",
          "@keyframes shimmer": {
            "0%": { backgroundPosition: "200% 0" },
            "100%": { backgroundPosition: "-200% 0" },
          },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />
      <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AccentIcon icon={icon} tone={iconTone} size={40} />
          <Chip
            icon={<FiClock size={12} />}
            label={comingSoonLabel}
            size="small"
            sx={{
              bgcolor: "rgba(201,162,39,0.15)",
              color: GOLD.main,
              border: `1px solid rgba(201,162,39,0.35)`,
              fontWeight: 700,
              fontSize: "0.62rem",
              letterSpacing: 0.6,
            }}
          />
        </Stack>
        <Box
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            mb: 0.5,
          }}
        >
          <Box
            sx={{
              width: `${55 + index * 12}%`,
              height: "100%",
              borderRadius: 2,
              bgcolor: GOLD.main,
              opacity: 0.5,
            }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: serif,
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
        <Typography
          sx={{ color: GOLD.main, fontWeight: 700, fontSize: "0.88rem" }}
        >
          {price}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function LandingPage() {
  const t = useTranslations("landing");
  const tTestimonials = useTranslations("landing.testimonials");

  const features = [
    {
      key: "pronunciation",
      icon: <FiMic size={22} />,
      tone: "terracotta" as const,
    },
    { key: "shadowing", icon: <FiRadio size={22} />, tone: "teal" as const },
    {
      key: "recording",
      icon: <FiHeadphones size={22} />,
      tone: "teal" as const,
    },
    {
      key: "feedback",
      icon: <FiMessageCircle size={22} />,
      tone: "rose" as const,
    },
  ] as const;

  const courses = [
    "membership",
    "accent",
    "phrasalVerbs",
    "ipa",
    "shadowing",
  ] as const;

  const courseLayout: Record<
    (typeof courses)[number],
    { icon: React.ReactNode; tone: AccentTone; gridArea: string }
  > = {
    membership: {
      icon: <FiAward size={24} />,
      tone: "gold",
      gridArea: "featured",
    },
    accent: {
      icon: <FiMic size={22} />,
      tone: "terracotta",
      gridArea: "accent",
    },
    phrasalVerbs: {
      icon: <FiBookOpen size={22} />,
      tone: "rose",
      gridArea: "phrasal",
    },
    ipa: { icon: <FiLayers size={22} />, tone: "teal", gridArea: "ipa" },
    shadowing: {
      icon: <FiRadio size={22} />,
      tone: "teal",
      gridArea: "shadowing",
    },
  };

  const coachingTiers = ["starter", "intermediate", "advanced"] as const;

  const miniCourses = [
    "vowelsConsonants",
    "ipaSymbols",
    "diphthongsTriphthongs",
  ] as const;

  const miniCourseMeta: Record<
    (typeof miniCourses)[number],
    { icon: React.ReactNode; tone: AccentTone }
  > = {
    vowelsConsonants: { icon: <FiMic size={20} />, tone: "terracotta" },
    ipaSymbols: { icon: <FiLayers size={20} />, tone: "teal" },
    diphthongsTriphthongs: { icon: <FiActivity size={20} />, tone: "gold" },
  };

  const coachingMeta: Record<
    (typeof coachingTiers)[number],
    { icon: React.ReactNode; tone: AccentTone }
  > = {
    starter: { icon: <FiUsers size={22} />, tone: "rose" },
    intermediate: { icon: <FiTarget size={22} />, tone: "terracotta" },
    advanced: { icon: <FiAward size={22} />, tone: "gold" },
  };

  const credibilityItems = [
    {
      icon: <FiStar size={18} />,
      title: t("hero.eyebrow"),
      subtitle: t("about.eyebrow"),
    },
    {
      icon: <FiBookOpen size={18} />,
      title: `${courses.length} ${t("courses.eyebrow")}`,
      subtitle: t("courses.title"),
    },
    {
      icon: <FiUsers size={18} />,
      title: `${coachingTiers.length} ${t("coachingPackages.eyebrow")}`,
      subtitle: t("coachingPackages.title"),
    },
    {
      icon: <FiAward size={18} />,
      title: t("features.pronunciation.title"),
      subtitle: t("features.pronunciation.description"),
    },
    {
      icon: <FiMic size={18} />,
      title: t("features.shadowing.title"),
      subtitle: t("features.shadowing.description"),
    },
    {
      icon: <FiVideo size={18} />,
      title: t("features.recording.title"),
      subtitle: t("features.recording.description"),
    },
    {
      icon: <FiMessageCircle size={18} />,
      title: t("features.feedback.title"),
      subtitle: t("features.feedback.description"),
    },
    {
      icon: <FiCheck size={18} />,
      title: t("courses.membership.title"),
      subtitle: t("courses.membership.benefit2"),
    },
    {
      icon: <FiTarget size={18} />,
      title: t("coachingPackages.advanced.title"),
      subtitle: t("coachingPackages.advanced.sessions"),
    },
    {
      icon: <FiGlobe size={18} />,
      title: t("community.title"),
      subtitle: t("community.subtitle"),
    },
    {
      icon: <FiStar size={18} />,
      title: t("about.testimonialAuthor"),
      subtitle: t("about.pullQuote"),
    },
  ];

  const marqueeItems = [...credibilityItems, ...credibilityItems];

  const practiceItems = features.map(({ key, icon, tone }) => ({
    key,
    icon,
    tone,
    title: t(`features.${key}.title`),
    description: t(`features.${key}.description`),
  }));

  const testimonials = [
    {
      key: "student1",
      quote: tTestimonials("student1.quote"),
      author: tTestimonials("student1.author"),
    },
    {
      key: "student2",
      quote: tTestimonials("student2.quote"),
      author: tTestimonials("student2.author"),
    },
    {
      key: "student3",
      quote: tTestimonials("student3.quote"),
      author: tTestimonials("student3.author"),
    },
    {
      key: "student4",
      quote: tTestimonials("student4.quote"),
      author: tTestimonials("student4.author"),
    },
    {
      key: "student5",
      quote: tTestimonials("student5.quote"),
      author: tTestimonials("student5.author"),
    },
    {
      key: "student6",
      quote: tTestimonials("student6.quote"),
      author: tTestimonials("student6.author"),
    },
    {
      key: "student7",
      quote: tTestimonials("student7.quote"),
      author: tTestimonials("student7.author"),
    },
    {
      key: "student8",
      quote: tTestimonials("student8.quote"),
      author: tTestimonials("student8.author"),
    },
    {
      key: "student9",
      quote: tTestimonials("student9.quote"),
      author: tTestimonials("student9.author"),
    },
    {
      key: "student10",
      quote: tTestimonials("student10.quote"),
      author: tTestimonials("student10.author"),
    },
  ];

  const marqueeTestimonials = [...testimonials, ...testimonials];

  return (
    <Box sx={{ bgcolor: "#fff", color: GREEN.dark }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1100,
          bgcolor: "#fff",
          borderBottom: "1px solid #ece7df",
        }}
      >
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              minHeight: { xs: 56, sm: 64 },
            }}
          >
            <Box
              component="a"
              href="#home"
              sx={{
                position: "relative",
                height: { xs: 36, sm: 44 },
                width: { xs: 148, sm: 188 },
                display: "block",
                flexShrink: 0,
              }}
            >
              <Image
                src="/logo.png"
                alt={t("brand")}
                fill
                sizes="188px"
                style={{ objectFit: "contain", objectPosition: "left center" }}
                priority
              />
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              <LanguageSwitcher />
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="small"
                sx={{
                  borderColor: GREEN.dark,
                  color: GREEN.dark,
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  px: 2,
                  py: 0.5,
                  minHeight: 34,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                {t("signIn")}
              </Button>
              <GreenPillButton
                href={`mailto:${CONTACT_EMAIL}`}
                sx={{
                  px: 2.25,
                  py: 0.5,
                  minHeight: 34,
                  fontSize: "0.68rem",
                }}
              >
                {t("hero.cta")}
              </GreenPillButton>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Spacer for fixed navbar */}
      <Box sx={{ minHeight: { xs: 56, sm: 64 } }} aria-hidden />

      {/* Hero */}
      <Box
        id="home"
        component="section"
        sx={{
          minHeight: { xs: "calc(100dvh - 56px)", sm: "calc(100dvh - 64px)" },
          bgcolor: "#faf9f7",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1.08fr" },
            minHeight: { xs: "calc(100dvh - 56px)", sm: "calc(100dvh - 64px)" },
            width: "100%",
          }}
        >
          {/* Left content */}
          <Box
            sx={{
              px: "40px",
              py: { xs: 5, md: 0 },
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "10%",
                left: "-10%",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Box sx={{ maxWidth: 560, width: "100%" }}>
              <Typography
                component="span"
                sx={{
                  display: "inline-block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: GOLD.dark,
                  mb: 2,
                  px: 1.5,
                  py: 0.6,
                  border: `1px solid ${GOLD.main}`,
                  borderRadius: 999,
                }}
              >
                {t("hero.eyebrow")}
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontFamily: serif,
                  fontWeight: 700,
                  fontSize: {
                    xs: "2.4rem",
                    sm: "3rem",
                    md: "3.5rem",
                    lg: "3.75rem",
                  },
                  color: GREEN.dark,
                  lineHeight: 1.08,
                  mb: 1.5,
                  letterSpacing: -0.5,
                }}
              >
                {t("hero.title")}
              </Typography>

              <Typography
                sx={{
                  fontFamily: script,
                  fontSize: { xs: "1.35rem", md: "1.65rem" },
                  color: GOLD.main,
                  mb: 2.5,
                  lineHeight: 1.3,
                }}
              >
                {t("brandTagline")}
              </Typography>

              <Typography
                sx={{
                  color: "#4a5c56",
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.85,
                  mb: 4,
                }}
              >
                {t("hero.subtitle")}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 5 }}
              >
                <GreenPillButton
                  href={`mailto:${CONTACT_EMAIL}`}
                  startIcon={<FiPhone size={14} />}
                  sx={{ px: 3, py: 1.1, fontSize: "0.72rem" }}
                >
                  {t("hero.cta")}
                </GreenPillButton>
                <GoldOutlineButton href="#courses">
                  {t("courses.title")}
                </GoldOutlineButton>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "repeat(4, 1fr)",
                  },
                  gap: { xs: 2, sm: 2.5 },
                  pt: 3,
                  borderTop: "1px solid rgba(11,61,49,0.12)",
                }}
              >
                {features.map(({ key, icon }) => (
                  <Stack
                    key={key}
                    spacing={1}
                    alignItems={{ xs: "center", sm: "flex-start" }}
                  >
                    <Box
                      sx={{
                        color: GOLD.main,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: `1px solid rgba(201,162,39,0.35)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        color: GREEN.dark,
                        textAlign: { xs: "center", sm: "left" },
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        lineHeight: 1.35,
                      }}
                    >
                      {t(`features.${key}.title`)}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right image — full height */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 360, sm: 420, lg: "auto" },
              height: { lg: "100%" },
              order: { xs: -1, lg: 0 },
            }}
          >
            <Image
              src="/images/landing-page-1.png"
              alt={t("about.title")}
              fill
              sizes="(max-width: 1200px) 100vw, 55vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
              priority
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, #faf9f7 0%, transparent 18%), linear-gradient(to top, rgba(11,61,49,0.08) 0%, transparent 30%)",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Credibility marquee strip */}
      <Box
        sx={{
          bgcolor: GREEN.dark,
          color: "#fff",
          py: { xs: 2.5, md: 3 },
          overflow: "hidden",
          borderTop: `1px solid rgba(201,162,39,0.2)`,
          borderBottom: `1px solid rgba(201,162,39,0.2)`,
          "&:hover .credibility-marquee-track": {
            animationPlayState: "paused",
          },
        }}
      >
        <Box
          className="credibility-marquee-track"
          sx={{
            display: "flex",
            width: "max-content",
            animation: "credibilityMarquee 45s linear infinite",
            "@keyframes credibilityMarquee": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "center",
            },
          }}
        >
          {marqueeItems.map((item, index) => (
            <CredibilityStripItem
              key={`${item.title}-${index}`}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </Box>
      </Box>

      {/* Lyn's Courses — bento layout */}
      <Box
        id="courses"
        component="section"
        sx={{
          bgcolor: CREAM.main,
          py: { xs: 8, md: 11 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "rgba(201,162,39,0.05)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <SectionHeading
              eyebrow={t("courses.eyebrow")}
              title={t("courses.title")}
              subtitle={t("courses.subtitle")}
            />
          </Box>

          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={staggerContainer}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(12, 1fr)",
              },
              gridTemplateAreas: {
                xs: `"featured" "accent" "phrasal" "ipa" "shadowing"`,
                md: `"featured featured" "accent phrasal" "ipa shadowing"`,
                lg: `"featured featured featured featured featured featured accent accent phrasal phrasal phrasal phrasal"
                     "featured featured featured featured featured featured accent accent phrasal phrasal phrasal phrasal"
                     "ipa ipa ipa ipa shadowing shadowing shadowing shadowing shadowing shadowing shadowing shadowing"`,
              },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {courses.map((key) => {
              const isFeatured = key === "membership";
              const meta = courseLayout[key];
              return (
                <Box
                  key={key}
                  component={motion.div}
                  variants={fadeUp}
                  sx={{
                    gridArea: meta.gridArea,
                    minHeight: isFeatured ? { lg: 360 } : undefined,
                  }}
                >
                  <PremiumCourseCard
                    icon={meta.icon}
                    iconTone={meta.tone}
                    title={t(`courses.${key}.title`)}
                    description={t(`courses.${key}.description`)}
                    price={t(`courses.${key}.price`)}
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(`courses.${key}.title`))}`}
                    cta={t("courses.signUpCta")}
                    featured={isFeatured}
                    featuredBadge={
                      isFeatured ? t("courses.featuredBadge") : undefined
                    }
                    compact={!isFeatured && key !== "shadowing"}
                    benefits={
                      isFeatured
                        ? [
                            t(`courses.${key}.benefit1`),
                            t(`courses.${key}.benefit2`),
                            t(`courses.${key}.benefit3`),
                          ]
                        : undefined
                    }
                    sx={{ minHeight: "100%" }}
                  />
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* 1-on-1 Coaching — distinct horizontal scroll section */}
      <Box
        id="coaching"
        component="section"
        sx={{
          bgcolor: CREAM.warm,
          py: { xs: 8, md: 10 },
          borderTop: `1px solid ${CREAM.alt}`,
          borderBottom: `1px solid ${CREAM.alt}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(27,59,47,0.03) 28px, rgba(27,59,47,0.03) 29px)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <SectionHeading
              eyebrow={t("coachingPackages.eyebrow")}
              title={t("coachingPackages.title")}
              subtitle={t("coachingPackages.subtitle")}
            />
          </Box>

          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              pb: 2,
              mx: { xs: -2, md: 0 },
              px: { xs: 2, md: 0 },
              scrollSnapType: "x mandatory",
              position: "relative",
              zIndex: 1,
              "&::-webkit-scrollbar": { height: 5 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(27,59,47,0.2)",
                borderRadius: 3,
              },
            }}
          >
            {coachingTiers.map((key) => {
              const meta = coachingMeta[key];
              return (
                <Box
                  key={key}
                  component={motion.div}
                  variants={fadeUp}
                  sx={{
                    flex: { xs: "0 0 88%", sm: "0 0 340px", md: "1 1 0" },
                    minWidth: { md: 280 },
                    scrollSnapAlign: "start",
                  }}
                >
                  <PremiumCourseCard
                    icon={meta.icon}
                    iconTone={meta.tone}
                    title={t(`coachingPackages.${key}.title`)}
                    description={t(`coachingPackages.${key}.description`)}
                    price={`${t(`coachingPackages.${key}.price`)} · ${t(`coachingPackages.${key}.sessions`)}`}
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(`coachingPackages.${key}.title`))}`}
                    cta={t("coachingPackages.signUpCta")}
                    sx={{ minHeight: { md: 300 } }}
                  />
                </Box>
              );
            })}
          </Box>

          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            sx={{
              color: "#5a6a65",
              fontSize: "0.78rem",
              textAlign: "center",
              mt: 3,
              fontStyle: "italic",
              position: "relative",
              zIndex: 1,
            }}
          >
            {t("coachingPackages.cancellationNote")}
          </Typography>
        </Container>
      </Box>

      {/* Coming Soon — staggered cards with texture */}
      <Box
        id="coming-soon"
        component="section"
        sx={{
          bgcolor: GREEN.dark,
          py: { xs: 8, md: 11 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(135deg, rgba(201,162,39,0.06) 0%, transparent 40%), linear-gradient(225deg, rgba(74,140,130,0.08) 0%, transparent 45%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                component={motion.div}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                sx={{
                  display: "inline-block",
                  mb: 2,
                  "@media (prefers-reduced-motion: reduce)": {
                    animation: "none",
                  },
                }}
              >
                <Chip
                  icon={<FiClock size={14} />}
                  label={t("miniCourses.comingSoon")}
                  sx={{
                    bgcolor: "rgba(201,162,39,0.15)",
                    color: GOLD.main,
                    border: `1px solid rgba(201,162,39,0.4)`,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: 1,
                    px: 1,
                  }}
                />
              </Box>
              <SectionHeading
                eyebrow={t("courses.eyebrow")}
                title={t("miniCourses.title")}
                subtitle={t("miniCourses.subtitle")}
                align="center"
                light
              />
            </Box>
          </Box>

          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            sx={{
              display: "flex",
              gap: 3,
              overflowX: { xs: "auto", lg: "visible" },
              flexWrap: { lg: "nowrap" },
              alignItems: { lg: "flex-start" },
              pb: { xs: 1, md: 0 },
              position: "relative",
              zIndex: 1,
              scrollSnapType: { xs: "x mandatory", lg: "none" },
            }}
          >
            {miniCourses.map((key, index) => (
              <ComingSoonCard
                key={key}
                index={index}
                comingSoonLabel={t("miniCourses.comingSoon")}
                title={t(`miniCourses.${key}.title`)}
                description={t(`miniCourses.${key}.description`)}
                price={t(`miniCourses.${key}.price`)}
                icon={miniCourseMeta[key].icon}
                iconTone={miniCourseMeta[key].tone}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* What You'll Practice — sequential flow layout */}
      <Box
        id="teacher"
        component="section"
        sx={{
          bgcolor: "#fff",
          py: { xs: 8, md: 11 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            bgcolor: "rgba(74,140,130,0.06)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <SectionHeading
              eyebrow={t("hero.eyebrow")}
              title={t("features.title")}
              subtitle={t("hero.subtitle")}
              align="center"
            />
          </Box>

          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            sx={{ position: "relative" }}
          >
            {/* Connecting line — desktop */}
            <Box
              component={motion.div}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              sx={{
                display: { xs: "none", lg: "block" },
                position: "absolute",
                top: 52,
                left: "12%",
                right: "12%",
                height: 2,
                bgcolor: CREAM.alt,
                transformOrigin: "left center",
                zIndex: 0,
                "@media (prefers-reduced-motion: reduce)": {
                  transform: "none",
                },
              }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "repeat(4, 1fr)" },
                gap: { xs: 0, lg: 2 },
                position: "relative",
                zIndex: 1,
              }}
            >
              {practiceItems.map(
                ({ key, icon, tone, title, description }, index) => (
                  <Box key={key}>
                    <Box
                      component={motion.div}
                      variants={fadeUp}
                      className="card-hover-target"
                      sx={{
                        p: { xs: 3, lg: 2.5 },
                        ...cardHoverSx,
                        "@media (max-width: 1199px)": {
                          display: "grid",
                          gridTemplateColumns: "auto 1fr",
                          gap: 2,
                          borderLeft:
                            index > 0
                              ? `3px solid ${accentStyles[tone].color}`
                              : "none",
                          ml: index > 0 ? 2 : 0,
                          pl: index > 0 ? 2.5 : 0,
                          mb: index < practiceItems.length - 1 ? 1 : 0,
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <AccentIcon icon={icon} tone={tone} />
                        {index < practiceItems.length - 1 && (
                          <Box
                            sx={{
                              display: { xs: "none", lg: "flex" },
                              position: "absolute",
                              top: "50%",
                              right: -28,
                              transform: "translateY(-50%)",
                              color: accentStyles[tone].color,
                              opacity: 0.6,
                              zIndex: 2,
                            }}
                          >
                            <FiChevronRight size={20} />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ mt: { lg: 2.5 } }}>
                        <Typography
                          sx={{
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            color: accentStyles[tone].color,
                            mb: 0.75,
                          }}
                        >
                          Step {index + 1}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: serif,
                            fontWeight: 700,
                            fontSize: { xs: "1.1rem", md: "1.15rem" },
                            color: GREEN.dark,
                            mb: 1,
                            lineHeight: 1.3,
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#5a6a65",
                            fontSize: "0.88rem",
                            lineHeight: 1.7,
                          }}
                        >
                          {description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials — organic marquee */}
      <Box
        id="testimonials"
        component="section"
        sx={{
          bgcolor: GREEN.main,
          py: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(201,162,39,0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(184,122,133,0.08) 0%, transparent 35%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <SectionHeading
              eyebrow={tTestimonials("eyebrow")}
              title={tTestimonials("title")}
              align="center"
              light
            />
          </Box>
        </Container>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              width: { xs: 48, md: 120 },
              zIndex: 2,
              pointerEvents: "none",
            },
            "&::before": {
              left: 0,
              background: `linear-gradient(to right, ${GREEN.main}, transparent)`,
            },
            "&::after": {
              right: 0,
              background: `linear-gradient(to left, ${GREEN.main}, transparent)`,
            },
            "&:hover .testimonial-marquee-track": {
              animationPlayState: "paused",
            },
          }}
        >
          <Box
            className="testimonial-marquee-track"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "max-content",
              py: 2,
              animation: "testimonialMarquee 75s linear infinite",
              "@keyframes testimonialMarquee": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-50%)" },
              },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "center",
                gap: 2,
                px: "40px",
              },
            }}
          >
            {marqueeTestimonials.map((item, index) => {
              const variants: Array<"small" | "medium" | "large"> = [
                "medium",
                "large",
                "small",
                "medium",
                "large",
                "small",
                "medium",
                "large",
                "small",
                "medium",
              ];
              return (
                <TestimonialCard
                  key={`${item.key}-${index}`}
                  quote={item.quote}
                  author={item.author}
                  variant={variants[index % variants.length]}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* About Lyn — editorial layout */}
      <Box
        id="about"
        component="section"
        sx={{
          bgcolor: CREAM.main,
          py: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.95fr 1.05fr" },
              gap: { xs: 4, md: 6, lg: 8 },
              alignItems: "center",
            }}
          >
            <Box
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              sx={{ position: "relative" }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: -20, md: -30 },
                  left: { xs: -20, md: -30 },
                  width: { xs: "70%", md: "75%" },
                  height: "85%",
                  borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
                  bgcolor: "rgba(27,59,47,0.12)",
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: { xs: "4/5", lg: "auto" },
                  minHeight: { xs: 360, md: 440, lg: 500 },
                  height: { lg: "100%" },
                  boxShadow: "0 32px 70px rgba(22,48,42,0.18)",
                }}
              >
                <Image
                  src="/images/landing-page-2.png"
                  alt={t("about.title")}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, ${GREEN.dark}99 0%, transparent 45%)`,
                    opacity: 0.35,
                  }}
                />
              </Box>
            </Box>

            <Box
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={staggerContainer}
            >
              <Typography
                component={motion.span}
                variants={fadeUp}
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: GOLD.dark,
                  display: "block",
                  mb: 1.5,
                }}
              >
                {t("about.eyebrow")}
              </Typography>
              <Typography
                component={motion.h2}
                variants={fadeUp}
                sx={{
                  fontFamily: serif,
                  fontWeight: 700,
                  fontSize: { xs: "2.25rem", md: "3rem" },
                  color: GREEN.dark,
                  lineHeight: 1.08,
                  mb: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {t("about.title")}
              </Typography>
              <Typography
                component={motion.p}
                variants={fadeUp}
                sx={{
                  fontFamily: script,
                  fontSize: { xs: "1.15rem", md: "1.35rem" },
                  color: GOLD.main,
                  mb: 3,
                }}
              >
                {t("brandTagline")}
              </Typography>

              <Typography
                component={motion.blockquote}
                variants={fadeUp}
                sx={{
                  fontFamily: serif,
                  fontSize: { xs: "1.2rem", md: "1.45rem" },
                  lineHeight: 1.55,
                  fontStyle: "italic",
                  color: GREEN.dark,
                  mb: 3,
                  pl: 3,
                  borderLeft: `3px solid ${GOLD.main}`,
                  m: 0,
                }}
              >
                {t("about.pullQuote")}
              </Typography>

              <Typography
                component={motion.p}
                variants={fadeUp}
                sx={{
                  color: "#4a5c56",
                  fontSize: "0.92rem",
                  lineHeight: 1.85,
                  mb: 2,
                  whiteSpace: "pre-line",
                }}
              >
                {t("about.body").split("\n\n")[0]}
              </Typography>
              <Typography
                component={motion.p}
                variants={fadeUp}
                sx={{
                  color: "#4a5c56",
                  fontSize: "0.92rem",
                  lineHeight: 1.85,
                  mb: 3,
                  whiteSpace: "pre-line",
                }}
              >
                {t("about.body").split("\n\n").slice(1).join("\n\n")}
              </Typography>

              <Box component={motion.div} variants={fadeUp}>
                <GreenPillButton href={`mailto:${CONTACT_EMAIL}`}>
                  {t("hero.cta")}
                </GreenPillButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box
        id="contact"
        component="section"
        sx={{
          bgcolor: GREEN.dark,
          color: "#fff",
          py: { xs: 7, md: 9 },
          position: "relative",
          overflow: "hidden",
          backgroundImage: `
            radial-gradient(ellipse at 20% 80%, rgba(201,162,39,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(74,140,130,0.1) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(184,122,133,0.06) 0%, transparent 60%),
            linear-gradient(160deg, ${GREEN.dark} 0%, ${GREEN.main} 100%)
          `,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23C9A227' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            pointerEvents: "none",
          }}
        />
        <Container
          maxWidth={false}
          disableGutters
          sx={{ ...landingContainerSx, position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
              gap: { xs: 5, md: 8 },
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 160, sm: 188 },
                  height: { xs: 36, sm: 44 },
                  mb: 3,
                }}
              >
                <Image
                  src="/logo.png"
                  alt={t("brand")}
                  fill
                  sizes="188px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: serif,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.35rem" },
                  lineHeight: 1.2,
                  mb: 1.5,
                  letterSpacing: "-0.02em",
                }}
              >
                {t("footer.cta")}
              </Typography>
              <Typography
                sx={{
                  opacity: 0.88,
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  lineHeight: 1.75,
                  mb: 3.5,
                  maxWidth: 480,
                }}
              >
                {t("hero.subtitle")}
              </Typography>
              <Button
                href={`mailto:${CONTACT_EMAIL}`}
                variant="contained"
                endIcon={<FiArrowRight size={16} />}
                sx={{
                  bgcolor: GOLD.main,
                  color: GREEN.dark,
                  borderRadius: 999,
                  px: 3.5,
                  py: 1.35,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  boxShadow: "0 8px 24px rgba(201,162,39,0.25)",
                  "&:hover": { bgcolor: GOLD.light },
                }}
              >
                {t("hero.cta")}
              </Button>
            </Box>

            <Stack
              spacing={2}
              sx={{
                bgcolor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,162,39,0.18)",
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <AccentIcon
                  icon={<FiMail size={18} />}
                  tone="gold"
                  size={44}
                  rounded="circle"
                />
                <Typography
                  component="a"
                  href={`mailto:${CONTACT_EMAIL}`}
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    "&:hover": { color: GOLD.main },
                  }}
                >
                  {CONTACT_EMAIL}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,0,0,0.12)",
                    border: "1px solid rgba(255,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#FF0000",
                  }}
                >
                  <FaYoutube size={18} />
                </Box>
                <Typography
                  component="a"
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
                    "&:hover": { color: GOLD.main },
                  }}
                >
                  {t("community.youtube")}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "rgba(24,119,242,0.12)",
                    border: "1px solid rgba(24,119,242,0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#1877F2",
                  }}
                >
                  <FaFacebook size={18} />
                </Box>
                <Typography
                  component="a"
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
                    "&:hover": { color: GOLD.main },
                  }}
                >
                  {t("community.facebookPage")}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="flex-start">
                <AccentIcon
                  icon={<FiUsers size={18} />}
                  tone="rose"
                  size={44}
                  rounded="circle"
                />
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    opacity: 0.92,
                    pt: 0.5,
                  }}
                >
                  {t("community.subtitle")}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Bottom footer */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderTop: "1px solid #ece7df",
          py: { xs: 2.5, md: 3 },
        }}
      >
        <Container maxWidth={false} disableGutters sx={landingContainerSx}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              justifyContent: "space-between",
              gap: { xs: 2.5, md: 3 },
            }}
          >
            <Typography
              sx={{
                color: "#7a8a84",
                fontSize: "0.75rem",
                textAlign: { xs: "center", md: "left" },
                lineHeight: 1.5,
              }}
            >
              © {new Date().getFullYear()} {t("brand")} {t("brandTagline")}
            </Typography>

            <Stack
              direction="row"
              spacing={{ xs: 1.25, sm: 2 }}
              alignItems="center"
              flexWrap="wrap"
              justifyContent="center"
            >
              <Typography
                sx={{
                  color: GREEN.dark,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  mr: { xs: 0, sm: 0.5 },
                }}
              >
                {t("community.eyebrow")}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("community.facebookPage")}
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "#1877F2",
                    color: "#fff",
                    p: 0,
                    "&:hover": { bgcolor: "#166FE5" },
                  }}
                >
                  <FaFacebook size={16} />
                </Button>
                <Button
                  href={FACEBOOK_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("community.facebookGroup")}
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: GREEN.dark,
                    color: "#fff",
                    p: 0,
                    "&:hover": { bgcolor: GREEN.main },
                  }}
                >
                  <FaFacebookF size={15} />
                </Button>
                <Button
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("community.youtube")}
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "#FF0000",
                    color: "#fff",
                    p: 0,
                    "&:hover": { bgcolor: "#E60000" },
                  }}
                >
                  <FaYoutube size={16} />
                </Button>
              </Stack>

              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="small"
                sx={{
                  color: GREEN.dark,
                  borderColor: GREEN.dark,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.6,
                  ml: { xs: 0, sm: 1 },
                  textTransform: "none",
                  "&:hover": {
                    borderColor: GREEN.main,
                    bgcolor: "rgba(11,61,49,0.04)",
                  },
                }}
              >
                {t("signIn")}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

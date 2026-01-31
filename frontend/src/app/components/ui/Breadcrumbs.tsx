"use client";
import { Link } from "@/i18n/routing";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FiChevronRight, FiHome } from "react-icons/fi";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
}

export default function Breadcrumbs({
  items,
  showHome = true,
  homeHref = "/teacher",
}: BreadcrumbsProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs
        separator={<FiChevronRight size={14} />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            mx: 1,
            color: "text.disabled",
          },
        }}
      >
        {showHome && (
          <Typography
            component={Link}
            href={homeHref}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
              },
            }}
          >
            <FiHome size={14} />
          </Typography>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast || !item.href) {
            return (
              <Typography
                key={index}
                sx={{
                  color: isLast ? "text.primary" : "text.secondary",
                  fontSize: "0.875rem",
                  fontWeight: isLast ? 500 : 400,
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Typography
              key={index}
              component={Link}
              href={item.href}
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "0.875rem",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
            >
              {item.label}
            </Typography>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}

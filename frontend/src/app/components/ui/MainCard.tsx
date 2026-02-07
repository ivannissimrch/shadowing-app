"use client";
import { forwardRef, ReactNode } from "react";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

interface MainCardProps {
  id?: string;
  title?: string;
  secondary?: ReactNode;
  children: ReactNode;
  contentSX?: object;
  divider?: boolean;
  sx?: object;
}

/**
 * Berry-style MainCard component
 * Wrapper card with optional title, secondary action, and content
 */
const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      id,
      title,
      secondary,
      children,
      contentSX = {},
      divider = true,
      sx = {},
    },
    ref
  ) => {
    return (
      <MuiCard
        id={id}
        ref={ref}
        elevation={0}
        sx={{
          boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
          borderRadius: 2,
          ...sx,
        }}
      >
        {title && (
          <>
            <CardHeader
              title={
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              }
              action={secondary}
              sx={{ p: 2.5, "& .MuiCardHeader-action": { alignSelf: "center", m: 0 } }}
            />
            {divider && <Divider />}
          </>
        )}
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, ...contentSX }}>
          {children}
        </CardContent>
      </MuiCard>
    );
  }
);

MainCard.displayName = "MainCard";

export default MainCard;

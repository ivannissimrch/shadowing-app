import { Theme, Components } from "@mui/material/styles";
import { palette } from "./palette";

export const componentOverrides = (
  theme: Theme,
  borderRadius: number
): Components => ({
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: `${borderRadius}px`,
        textTransform: "capitalize",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
        "&:hover": { backgroundColor: theme.palette.primary.dark },
      },
      containedSecondary: {
        backgroundColor: theme.palette.secondary.main,
        "&:hover": { backgroundColor: theme.palette.secondary.dark },
      },
      outlinedPrimary: {
        borderColor: theme.palette.primary.main,
        "&:hover": { backgroundColor: theme.palette.primary.light },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${borderRadius}px`,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.light,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },
      input: {
        fontWeight: 500,
        backgroundColor: "transparent",
        padding: "15.5px 14px",
        borderRadius: `${borderRadius}px`,
      },
      inputSizeSmall: {
        padding: "10px 14px",
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: theme.palette.text.secondary,
        "&.Mui-focused": { color: theme.palette.primary.main },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.12)",
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  MuiCardHeader: {
    styleOverrides: {
      root: { padding: "24px" },
      title: {
        fontSize: "1.125rem",
        fontWeight: 600,
        color: theme.palette.text.primary,
      },
      subheader: {
        fontSize: "0.875rem",
        color: theme.palette.text.secondary,
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "24px",
        "&:last-child": { paddingBottom: "24px" },
      },
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${theme.palette.divider}`,
      },
      elevation1: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.12)" },
      elevation2: { boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.12)" },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        fontWeight: 600,
        "&.MuiChip-colorPrimary": {
          backgroundColor: theme.palette.primary.light,
          color: palette.primary[800],
        },
        "&.MuiChip-colorSecondary": {
          backgroundColor: theme.palette.secondary.light,
          color: palette.secondary[800],
        },
        "&.MuiChip-colorSuccess": {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.dark,
        },
        "&.MuiChip-colorError": {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.dark,
        },
        "&.MuiChip-colorWarning": {
          backgroundColor: theme.palette.warning.light,
          color: palette.warning.contrastText,
        },
      },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        fontSize: "1rem",
        fontWeight: 500,
      },
      colorDefault: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.dark,
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: `${borderRadius}px` },
      standardSuccess: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark,
      },
      standardError: {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.dark,
      },
      standardWarning: {
        backgroundColor: theme.palette.warning.light,
        color: palette.warning.contrastText,
      },
      standardInfo: {
        backgroundColor: theme.palette.primary.light,
        color: palette.primary[800],
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: { borderColor: theme.palette.divider },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        marginBottom: "4px",
        padding: "10px 16px",
        "&.Mui-selected": {
          backgroundColor: theme.palette.primary.light,
          color: palette.primary[800],
          "&:hover": { backgroundColor: theme.palette.primary.light },
          "& .MuiListItemIcon-root": { color: palette.primary[800] },
        },
        "&:hover": { backgroundColor: theme.palette.action.hover },
      },
    },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 36,
        color: theme.palette.text.secondary,
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: { backgroundColor: theme.palette.primary.main },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "capitalize",
        fontWeight: 500,
        minWidth: "auto",
        padding: "12px 16px",
        "&.Mui-selected": { color: theme.palette.primary.main },
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: palette.grey[900],
        borderRadius: `${borderRadius / 2}px`,
        fontSize: "0.75rem",
        padding: "8px 12px",
      },
      arrow: { color: palette.grey[900] },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: `${borderRadius * 1.5}px`,
        backgroundColor: theme.palette.background.paper,
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: "1.125rem",
        fontWeight: 600,
        padding: "24px 24px 16px",
        color: theme.palette.text.primary,
      },
    },
  },

  MuiDialogContent: {
    styleOverrides: {
      root: { backgroundColor: theme.palette.background.paper },
    },
  },

  MuiSelect: {
    styleOverrides: {
      select: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
      icon: { color: theme.palette.text.secondary },
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        color: theme.palette.text.primary,
        "&:hover": { backgroundColor: theme.palette.action.hover },
        "&.Mui-selected": {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.dark,
          "&:hover": { backgroundColor: theme.palette.primary.light },
        },
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: theme.palette.divider,
        padding: "16px",
      },
      head: {
        fontWeight: 600,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    },
  },

  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: theme.palette.text.disabled,
        "&.Mui-checked": { color: theme.palette.primary.main },
      },
    },
  },

  MuiSwitch: {
    styleOverrides: {
      root: { width: 42, height: 26, padding: 0 },
      switchBase: {
        padding: 0,
        margin: 2,
        "&.Mui-checked": {
          transform: "translateX(16px)",
          "& + .MuiSwitch-track": {
            backgroundColor: theme.palette.primary.main,
            opacity: 1,
          },
        },
      },
      thumb: { width: 22, height: 22, backgroundColor: "#fff" },
      track: {
        borderRadius: 13,
        backgroundColor: theme.palette.grey[300],
        opacity: 1,
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        "&:hover": { backgroundColor: theme.palette.action.hover },
      },
    },
  },

  MuiFab: {
    styleOverrides: {
      root: { boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.12)" },
    },
  },

  MuiLink: {
    styleOverrides: {
      root: {
        color: theme.palette.primary.main,
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
      },
    },
  },

  MuiSlider: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": { color: theme.palette.grey[300] },
      },
      mark: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: theme.palette.grey[400],
      },
      markActive: { backgroundColor: theme.palette.primary.main },
      markLabel: {
        fontSize: "0.7rem",
        color: theme.palette.text.secondary,
      },
      valueLabel: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: `${borderRadius / 2}px`,
      },
      thumb: {
        "&:hover, &.Mui-focusVisible": {
          boxShadow: `0 0 0 8px ${theme.palette.primary.light}`,
        },
      },
    },
  },
});

export default componentOverrides;

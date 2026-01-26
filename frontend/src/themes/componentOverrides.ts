import { Theme, Components } from '@mui/material/styles';
import { palette } from './palette';

// Berry Component Style Overrides
// These make MUI components look professional and polished

export const componentOverrides = (theme: Theme, borderRadius: number): Components => ({
  // ===== BUTTONS =====
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: `${borderRadius}px`,
        textTransform: 'capitalize',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      containedPrimary: {
        backgroundColor: palette.primary.main,
        '&:hover': {
          backgroundColor: palette.primary.dark,
        },
      },
      containedSecondary: {
        backgroundColor: palette.secondary.main,
        '&:hover': {
          backgroundColor: palette.secondary.dark,
        },
      },
      outlinedPrimary: {
        borderColor: palette.primary.main,
        '&:hover': {
          backgroundColor: palette.primary.light,
        },
      },
    },
  },

  // ===== TEXT INPUTS =====
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        backgroundColor: palette.grey[50],
        borderRadius: `${borderRadius}px`,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.grey[300],
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.primary.light,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.primary.main,
        },
      },
      input: {
        fontWeight: 500,
        backgroundColor: palette.grey[50],
        padding: '15.5px 14px',
        borderRadius: `${borderRadius}px`,
        '&::placeholder': {
          color: palette.grey[500],
          opacity: 1,
        },
      },
      inputSizeSmall: {
        padding: '10px 14px',
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: palette.grey[600],
        '&.Mui-focused': {
          color: palette.primary.main,
        },
      },
    },
  },

  // ===== CARDS =====
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        // Stronger shadow for better visibility on Mac displays (Display P3 gamma)
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.12)',
        border: `1px solid ${palette.grey[200]}`,
        '&:hover': {
          boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },

  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '24px',
      },
      title: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: palette.grey[900],
      },
      subheader: {
        fontSize: '0.875rem',
        color: palette.grey[500],
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
  },

  // ===== PAPER (base for cards, dialogs, menus) =====
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        // Subtle border for Mac display compatibility
        border: `1px solid ${palette.grey[200]}`,
      },
      elevation1: {
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.12)',
      },
      elevation2: {
        boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.15)',
      },
    },
  },

  // ===== CHIPS =====
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        fontWeight: 500,
        '&.MuiChip-colorPrimary': {
          backgroundColor: palette.primary.light,
          color: palette.primary.dark,
        },
        '&.MuiChip-colorSecondary': {
          backgroundColor: palette.secondary.light,
          color: palette.secondary.dark,
        },
        '&.MuiChip-colorSuccess': {
          backgroundColor: palette.success.light,
          color: palette.success.dark,
        },
        '&.MuiChip-colorError': {
          backgroundColor: palette.error.light,
          color: palette.error.dark,
        },
        '&.MuiChip-colorWarning': {
          backgroundColor: palette.warning.light,
          color: palette.warning.dark,
        },
      },
    },
  },

  // ===== AVATAR =====
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        fontSize: '1rem',
        fontWeight: 500,
      },
      colorDefault: {
        backgroundColor: palette.primary.light,
        color: palette.primary.dark,
      },
    },
  },

  // ===== ALERT =====
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
      },
      standardSuccess: {
        backgroundColor: palette.success.light,
        color: palette.success.dark,
      },
      standardError: {
        backgroundColor: palette.error.light,
        color: palette.error.dark,
      },
      standardWarning: {
        backgroundColor: palette.warning.light,
        color: palette.grey[700],
      },
      standardInfo: {
        backgroundColor: palette.primary.light,
        color: palette.primary.dark,
      },
    },
  },

  // ===== DIVIDER =====
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: palette.grey[200],
      },
    },
  },

  // ===== LIST ITEMS (for sidebar menus) =====
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        marginBottom: '4px',
        padding: '10px 16px',
        '&.Mui-selected': {
          backgroundColor: palette.primary.light,
          color: palette.primary.main,
          '&:hover': {
            backgroundColor: palette.primary.light,
          },
          '& .MuiListItemIcon-root': {
            color: palette.primary.main,
          },
        },
        '&:hover': {
          backgroundColor: palette.grey[100],
        },
      },
    },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 36,
        color: palette.grey[600],
      },
    },
  },

  // ===== TABS =====
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: palette.primary.main,
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'capitalize',
        fontWeight: 500,
        minWidth: 'auto',
        padding: '12px 16px',
        '&.Mui-selected': {
          color: palette.primary.main,
        },
      },
    },
  },

  // ===== TOOLTIPS =====
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: palette.grey[900],
        borderRadius: `${borderRadius / 2}px`,
        fontSize: '0.75rem',
        padding: '8px 12px',
      },
      arrow: {
        color: palette.grey[900],
      },
    },
  },

  // ===== DIALOGS =====
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: `${borderRadius * 1.5}px`,
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.125rem',
        fontWeight: 600,
        padding: '24px 24px 16px',
      },
    },
  },

  // ===== TABLE =====
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: palette.grey[200],
        padding: '16px',
      },
      head: {
        fontWeight: 600,
        backgroundColor: palette.grey[50],
        color: palette.grey[700],
      },
    },
  },

  // ===== CHECKBOX =====
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: palette.grey[400],
        '&.Mui-checked': {
          color: palette.primary.main,
        },
      },
    },
  },

  // ===== SWITCH =====
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 0,
        margin: 2,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          '& + .MuiSwitch-track': {
            backgroundColor: palette.primary.main,
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 22,
        height: 22,
        backgroundColor: '#fff',
      },
      track: {
        borderRadius: 13,
        backgroundColor: palette.grey[300],
        opacity: 1,
      },
    },
  },

  // ===== ICON BUTTON =====
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: `${borderRadius}px`,
        '&:hover': {
          backgroundColor: palette.grey[100],
        },
      },
    },
  },

  // ===== FAB =====
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },

  // ===== LINK =====
  MuiLink: {
    styleOverrides: {
      root: {
        color: palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export default componentOverrides;
